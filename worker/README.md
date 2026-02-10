# KWGT AI Worker

Cloudflare Worker for building KWGT files from KBM JSON using JSZip.

## Features

- **KBM Validation & Repair**: Validates and normalizes KBM JSON structures
- **KWGT File Building**: Creates .kwgt ZIP files with preset.json and assets
- **Color Normalization**: Converts #RRGGBB to #FFRRGGBB automatically
- **Formula Wrapping**: Ensures formulas are properly wrapped
- **Optional Authentication**: Guard endpoints with X-API-Key header

## Endpoints

### GET /
Returns service information and available endpoints.

### POST /validate
Validates and repairs KBM JSON structure.

**Request Body:**
```json
{
  "root_layer": { ... },
  "globals": [],
  "items": []
}
```

**Response:**
```json
{
  "valid": true,
  "repaired": { ... },
  "warnings": ["..."],
  "errors": []
}
```

### POST /build-kwgt
Builds a .kwgt file from KBM JSON.

**Request Body:**
```json
{
  "kbm": {
    "root_layer": { ... },
    "globals": [],
    "items": []
  },
  "assets": {
    "fonts": [
      { "name": "font.ttf", "data": "base64..." }
    ],
    "bitmaps": [
      { "name": "image.png", "data": "base64..." }
    ]
  },
  "filename": "widget.kwgt"
}
```

**Response:**
Binary .kwgt file with headers:
- `X-KWGT-SHA256`: SHA256 hash of the file
- `X-KWGT-Warnings`: Any warnings from validation

## Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Type check
npm run type-check

# Build
npm run build
```

## Deployment

Deploy using Wrangler:

```bash
# Deploy to Cloudflare Workers
npm run deploy
```

Or use the GitHub Actions workflow to deploy automatically.

## Configuration

### Environment Variables

- `X_API_KEY` (optional): Require this key in `X-API-Key` header for authentication

Set via Wrangler:
```bash
npx wrangler secret put X_API_KEY
```

Or via Cloudflare dashboard under Workers & Pages > Your Worker > Settings > Variables.

## Authentication

If `X_API_KEY` environment variable is set, all requests must include:
```
X-API-Key: your-secret-key
```

If `X_API_KEY` is not set, endpoints are publicly accessible.

## License

MIT
