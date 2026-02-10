import JSZip from 'jszip';

interface Env {
  X_API_KEY?: string;
}

interface KBMJson {
  root_layer?: {
    internal_type?: string;
    [key: string]: any;
  };
  globals?: any[];
  items?: any[];
  [key: string]: any;
}

interface ValidationResult {
  valid: boolean;
  repaired?: KBMJson;
  warnings?: string[];
  errors?: string[];
}

// Normalize color from #RRGGBB to #FFRRGGBB or #AARRGGBB to #AARRGGBB
function normalizeColor(color: string): string {
  if (!color || typeof color !== 'string') return color;
  
  // If it's #RRGGBB, add FF for full opacity
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return '#FF' + color.substring(1);
  }
  
  // If already #AARRGGBB, return as-is
  if (/^#[0-9A-Fa-f]{8}$/.test(color)) {
    return color.toUpperCase();
  }
  
  return color;
}

// Recursively normalize colors in an object
function normalizeColorsInObject(obj: any): void {
  if (!obj || typeof obj !== 'object') return;
  
  for (const key in obj) {
    if (key.toLowerCase().includes('color') && typeof obj[key] === 'string') {
      obj[key] = normalizeColor(obj[key]);
    } else if (typeof obj[key] === 'object') {
      normalizeColorsInObject(obj[key]);
    }
  }
}

// Wrap common formulas if needed
function wrapFormula(formula: string): string {
  if (!formula || typeof formula !== 'string') return formula;
  
  // Already wrapped
  if (formula.startsWith('$') || formula.startsWith('=')) {
    return formula;
  }
  
  // Check if it looks like a formula (contains functions or operators)
  if (/[+\-*/()]|tc\(|df\(|wg\(|si\(|mi\(|bi\(|ci\(/.test(formula)) {
    return '$' + formula + '$';
  }
  
  return formula;
}

// Validate and repair KBM JSON
function validateAndRepairKBM(kbm: any): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Make a deep copy
  const repaired: KBMJson = JSON.parse(JSON.stringify(kbm));
  
  // Ensure root_layer exists
  if (!repaired.root_layer) {
    repaired.root_layer = {};
    warnings.push('Missing root_layer - created empty object');
  }
  
  // Ensure root_layer.internal_type is LayerModule
  if (repaired.root_layer.internal_type !== 'LayerModule') {
    warnings.push(
      `root_layer.internal_type was "${repaired.root_layer.internal_type}" - changed to "LayerModule"`
    );
    repaired.root_layer.internal_type = 'LayerModule';
  }
  
  // Ensure globals array exists
  if (!Array.isArray(repaired.globals)) {
    repaired.globals = [];
    warnings.push('Missing or invalid globals array - created empty array');
  }
  
  // Ensure items array exists
  if (!Array.isArray(repaired.items)) {
    repaired.items = [];
    warnings.push('Missing or invalid items array - created empty array');
  }
  
  // Normalize colors throughout the object
  normalizeColorsInObject(repaired);
  
  return {
    valid: errors.length === 0,
    repaired,
    warnings,
    errors: errors.length > 0 ? errors : undefined,
  };
}

// Build KWGT file from KBM JSON
async function buildKwgtFile(kbm: KBMJson, assets?: { fonts?: any[]; bitmaps?: any[] }): Promise<{
  blob: Uint8Array;
  sha256: string;
  warnings: string[];
}> {
  const zip = new JSZip();
  const warnings: string[] = [];
  
  // Validate and repair KBM
  const validation = validateAndRepairKBM(kbm);
  warnings.push(...(validation.warnings || []));
  
  // Add preset.json to zip
  const presetJson = JSON.stringify(validation.repaired, null, 2);
  zip.file('preset.json', presetJson);
  
  // Add fonts if provided (base64 encoded)
  if (assets?.fonts && Array.isArray(assets.fonts)) {
    for (const font of assets.fonts) {
      if (font.name && font.data) {
        try {
          // Decode base64 data
          const data = atob(font.data);
          const bytes = new Uint8Array(data.length);
          for (let i = 0; i < data.length; i++) {
            bytes[i] = data.charCodeAt(i);
          }
          zip.file(`fonts/${font.name}`, bytes);
        } catch (e) {
          warnings.push(`Failed to add font ${font.name}: ${e}`);
        }
      }
    }
  }
  
  // Add bitmaps if provided (base64 encoded)
  if (assets?.bitmaps && Array.isArray(assets.bitmaps)) {
    for (const bitmap of assets.bitmaps) {
      if (bitmap.name && bitmap.data) {
        try {
          // Decode base64 data
          const data = atob(bitmap.data);
          const bytes = new Uint8Array(data.length);
          for (let i = 0; i < data.length; i++) {
            bytes[i] = data.charCodeAt(i);
          }
          zip.file(`bitmaps/${bitmap.name}`, bytes);
        } catch (e) {
          warnings.push(`Failed to add bitmap ${bitmap.name}: ${e}`);
        }
      }
    }
  }
  
  // Generate ZIP file
  const blob = await zip.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
  
  // Calculate SHA256 hash
  // Note: crypto.subtle is available in Workers
  const hashBuffer = await crypto.subtle.digest('SHA-256', blob);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const sha256 = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return { blob, sha256, warnings };
}

// Check API key if required
function checkAuth(request: Request, env: Env): boolean {
  if (!env.X_API_KEY) {
    // No API key configured, allow all requests
    return true;
  }
  
  const providedKey = request.headers.get('X-API-Key');
  return providedKey === env.X_API_KEY;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    };
    
    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Check authentication
    if (!checkAuth(request, env)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - X-API-Key required' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    try {
      // GET / - Service info
      if (path === '/' && request.method === 'GET') {
        return new Response(
          JSON.stringify({
            service: 'KWGT AI Toolchain Worker',
            version: '1.0.0',
            endpoints: {
              'GET /': 'Service information',
              'POST /validate': 'Validate and repair KBM JSON',
              'POST /build-kwgt': 'Build .kwgt file from KBM JSON',
            },
            documentation: 'https://github.com/CyberBASSLord-666/kwgt-ai-toolchain',
          }, null, 2),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      // POST /validate - Validate and repair KBM
      if (path === '/validate' && request.method === 'POST') {
        const body = await request.json();
        const validation = validateAndRepairKBM(body);
        
        return new Response(JSON.stringify(validation, null, 2), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // POST /build-kwgt - Build KWGT file
      if (path === '/build-kwgt' && request.method === 'POST') {
        const body = await request.json() as { kbm?: KBMJson; assets?: { fonts?: any[]; bitmaps?: any[] }; filename?: string };
        const { kbm, assets, filename } = body;
        
        if (!kbm) {
          return new Response(
            JSON.stringify({ error: 'Missing kbm field in request body' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
        
        const result = await buildKwgtFile(kbm, assets);
        const kwgtFilename = filename || 'widget.kwgt';
        
        return new Response(result.blob, {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${kwgtFilename}"`,
            'X-KWGT-SHA256': result.sha256,
            'X-KWGT-Warnings': result.warnings.join('; ') || 'none',
          },
        });
      }
      
      // 404 for unknown routes
      return new Response(
        JSON.stringify({ error: 'Not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
