#!/usr/bin/env node

/**
 * Local KBM Validation and Build Helper
 * 
 * Usage:
 *   node validate.js <kbm-file.json>
 *   node validate.js <kbm-file.json> --build <output.kwgt>
 */

const fs = require('fs');

// Simple validation function (matches Worker logic)
function validateKBM(kbm) {
  const warnings = [];
  const errors = [];
  
  // Check root_layer
  if (!kbm.root_layer) {
    errors.push('Missing root_layer');
  } else if (kbm.root_layer.internal_type !== 'LayerModule') {
    warnings.push(`root_layer.internal_type should be "LayerModule", got "${kbm.root_layer.internal_type}"`);
  }
  
  // Check globals
  if (!Array.isArray(kbm.globals)) {
    warnings.push('globals should be an array');
  }
  
  // Check items
  if (!Array.isArray(kbm.items)) {
    warnings.push('items should be an array');
  }
  
  // Check for 6-digit colors
  const colorRegex = /#[0-9A-Fa-f]{6}(?![0-9A-Fa-f])/g;
  const jsonStr = JSON.stringify(kbm);
  const matches = jsonStr.match(colorRegex);
  if (matches && matches.length > 0) {
    warnings.push(`Found ${matches.length} colors in #RRGGBB format (should be #AARRGGBB)`);
  }
  
  return {
    valid: errors.length === 0,
    warnings,
    errors
  };
}

// Main
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: node validate.js <kbm-file.json> [--build <output.kwgt>]');
  process.exit(1);
}

const inputFile = args[0];
const buildMode = args.includes('--build');
const outputFile = buildMode ? args[args.indexOf('--build') + 1] : null;

// Check input file exists
if (!fs.existsSync(inputFile)) {
  console.error(`Error: File not found: ${inputFile}`);
  process.exit(1);
}

// Read and parse KBM
let kbm;
try {
  const content = fs.readFileSync(inputFile, 'utf8');
  kbm = JSON.parse(content);
} catch (error) {
  console.error(`Error: Failed to parse JSON: ${error.message}`);
  process.exit(1);
}

// Validate
console.log('Validating KBM...\n');
const result = validateKBM(kbm);

if (result.errors.length > 0) {
  console.error('❌ Validation Failed\n');
  result.errors.forEach(err => console.error(`  - ${err}`));
  process.exit(1);
}

if (result.warnings.length > 0) {
  console.warn('⚠️  Warnings:\n');
  result.warnings.forEach(warn => console.warn(`  - ${warn}`));
  console.log();
}

if (result.warnings.length === 0) {
  console.log('✅ Validation passed with no warnings\n');
} else {
  console.log('✅ Validation passed (with warnings)\n');
}

// Build if requested
if (buildMode) {
  if (!outputFile) {
    console.error('Error: --build requires output filename');
    process.exit(1);
  }
  
  console.log(`Building KWGT file...`);
  console.log(`Note: This script performs validation only.`);
  console.log(`To build the .kwgt file, use the Worker API:`);
  console.log();
  console.log(`Option 1: Create a wrapper JSON file (wrapper.json):`);
  console.log(`  {`);
  console.log(`    "kbm": <paste your KBM JSON here>,`);
  console.log(`    "filename": "${outputFile}"`);
  console.log(`  }`);
  console.log();
  console.log(`Then run:`);
  console.log(`  curl -X POST https://your-worker.workers.dev/build-kwgt \\`);
  console.log(`    -H "Content-Type: application/json" \\`);
  console.log(`    -d @wrapper.json \\`);
  console.log(`    --output ${outputFile}`);
  console.log();
  console.log(`Option 2: Use jq to wrap the KBM:`);
  console.log(`  jq -n --slurpfile kbm ${inputFile} \\`);
  console.log(`    '{"kbm": $kbm[0], "filename": "${outputFile}"}' | \\`);
  console.log(`  curl -X POST https://your-worker.workers.dev/build-kwgt \\`);
  console.log(`    -H "Content-Type: application/json" \\`);
  console.log(`    -d @- \\`);
  console.log(`    --output ${outputFile}`);
  console.log();
}

// Show summary
console.log('Summary:');
console.log(`  Root type: ${kbm.root_layer?.internal_type || 'N/A'}`);
console.log(`  Globals: ${kbm.globals?.length || 0}`);
console.log(`  Items: ${kbm.items?.length || 0}`);
console.log();

console.log('For full validation and building, use the Worker API.');
