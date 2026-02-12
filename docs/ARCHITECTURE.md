# KWGT AI Toolchain Architecture

## Overview

The KWGT AI Toolchain is a comprehensive system for building, validating, and analyzing KWGT (Kustom Widget) files using AI-powered tools. The architecture consists of three main components:

1. **Cloudflare Worker** - API for building and validating KWGT files
2. **Custom GPT Interface** - AI assistant for widget creation
3. **Analysis Notebooks** - Tools for mining and analyzing existing widgets

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Users/Clients                        │
└───────────────┬─────────────────────┬───────────────────────┘
                │                     │
                │                     │
        ┌───────▼──────┐     ┌────────▼────────┐
        │  Custom GPT  │     │  Direct API     │
        │  Interface   │     │  Access         │
        └───────┬──────┘     └────────┬────────┘
                │                     │
                └──────────┬──────────┘
                           │
                  ┌────────▼────────┐
                  │  Cloudflare     │
                  │  Worker API     │
                  │  (TypeScript)   │
                  └────────┬────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼─────┐     ┌─────▼──────┐    ┌─────▼──────┐
   │ Validate │     │   Build    │    │  Service   │
   │   KBM    │     │   KWGT     │    │    Info    │
   └──────────┘     └─────┬──────┘    └────────────┘
                          │
                    ┌─────▼──────┐
                    │   JSZip    │
                    │  Creation  │
                    └────────────┘
```

## Components

### 1. Cloudflare Worker (`worker/`)

A TypeScript-based serverless function that handles KWGT file operations.

#### Endpoints

**GET /**
- Returns service information and available endpoints
- No authentication required

**POST /validate**
- Validates and repairs KBM JSON structures
- Normalizes colors (#RRGGBB → #FFRRGGBB)
- Ensures required fields (root_layer, globals, items)
- Returns validation warnings and repaired structure

**POST /build-kwgt**
- Accepts KBM JSON and optional assets (fonts, bitmaps)
- Creates .kwgt ZIP file using JSZip
- Returns binary file with metadata headers
- Calculates SHA256 hash for verification

#### Key Features

- **Color Normalization**: Automatically converts 6-digit colors to 8-digit format
- **Schema Validation**: Ensures root_layer.internal_type is "LayerModule"
- **Formula Wrapping**: Detects and wraps formulas with $ delimiters
- **Asset Support**: Handles base64-encoded fonts and bitmaps
- **CORS Support**: Enables cross-origin requests
- **Optional Authentication**: X-API-Key header when configured

#### Technology Stack

- **Runtime**: Cloudflare Workers (V8 isolates)
- **Language**: TypeScript
- **Build Tool**: Wrangler CLI
- **Dependencies**:
  - JSZip: ZIP file creation
  - @cloudflare/workers-types: Type definitions

### 2. Custom GPT Integration (`gpt/`)

OpenAPI schema and instructions for building a Custom GPT assistant.

#### Components

**openapi.yaml**
- API specification for GPT Actions
- Defines all endpoints with request/response schemas
- Includes authentication configuration

**CUSTOM_GPT_INSTRUCTIONS.md**
- Detailed instructions for GPT behavior
- Workflow guidance for widget creation
- Best practices and error handling

**KBM_SPEC.md**
- Complete KBM JSON specification
- Layer types and properties
- Formula syntax and examples
- Color formats and conventions

### 3. Analysis Notebooks (`notebooks/`)

Jupyter/Colab notebooks for analyzing KWGT files.

#### Local Ingest Notebook
- Processes .kwgt files from Google Drive
- Extracts preset.json from each file
- Mines internal_type registry
- Generates schema analysis
- Exports results as ZIP

#### GitHub Harvest Notebook
- Searches GitHub for .kwgt files
- Downloads files using optional GH_TOKEN
- Extracts and analyzes preset.json
- Creates comprehensive registry
- Includes source metadata

Both notebooks provide:
- Internal type registry (frequency, keys, contexts)
- Schema statistics (globals, items, structure)
- Exportable results for further analysis

## Data Flow

### Widget Creation Flow

```
User Request
    ↓
Custom GPT generates KBM JSON
    ↓
POST /validate (check structure)
    ↓
Review warnings
    ↓
POST /build-kwgt (create file)
    ↓
Download .kwgt with SHA256
```

### Analysis Flow

```
.kwgt files (local or GitHub)
    ↓
Notebook extracts preset.json
    ↓
Parse and analyze KBM structure
    ↓
Collect internal_types and schemas
    ↓
Generate registry and statistics
    ↓
Export ZIP with results
```

## Deployment Architecture

### Cloudflare Workers Deployment

```
GitHub Repository
    ↓
GitHub Actions Workflow
    ↓
npm ci && npm run build
    ↓
Wrangler Deploy
    ↓
Cloudflare Edge Network
    ↓
Global Distribution (200+ cities)
```

**Advantages**:
- Zero cold starts
- Global edge deployment
- Free tier: 100k requests/day
- Sub-millisecond CPU time per request
- Automatic SSL/TLS

### Configuration

**Environment Variables**:
- `X_API_KEY` (optional): Shared secret for authentication
- `CLOUDFLARE_API_TOKEN`: Deployment token (GitHub Actions)
- `CLOUDFLARE_ACCOUNT_ID`: Account identifier (GitHub Actions)

## Security Model

### Authentication
- Optional X-API-Key header for Worker endpoints
- GitHub token for API access in notebooks
- No secrets in repository (use secrets management)

### Data Handling
- Stateless request processing
- No persistent storage of user data
- Binary files streamed, not stored
- CORS headers for controlled access

### Best Practices
1. Use X_API_KEY for production deployments
2. Rotate API keys regularly
3. Use GitHub tokens for harvest notebook
4. Validate all user inputs
5. Sanitize error messages

## Scalability

### Worker Scalability
- Automatically scales to zero
- Handles millions of requests globally
- No infrastructure management
- Pay-per-use pricing model

### Rate Limits
- Free tier: 100,000 requests/day
- Paid tier: Unlimited requests
- CPU time: 10ms (free) / 50ms (paid) per request

### Analysis Notebooks
- Process hundreds of files per run
- Rate limited by GitHub API (5000/hour with token)
- Local execution on Colab infrastructure

## Extension Points

### Adding New Endpoints
1. Define handler in `worker/src/index.ts`
2. Add schema to `gpt/openapi.yaml`
3. Update Custom GPT instructions
4. Deploy via GitHub Actions

### Adding Analysis Features
1. Extend notebook code cells
2. Add new analysis functions
3. Update output schema
4. Document in notebook markdown

### Custom Validations
1. Add validation functions in Worker
2. Return warnings/errors in response
3. Update KBM_SPEC.md documentation

## Monitoring & Observability

### Worker Metrics (Cloudflare Dashboard)
- Request count and rate
- Error rate and types
- CPU usage per request
- Bandwidth usage
- Geographic distribution

### Logs
- `console.log()` captured in Wrangler tail
- Real-time log streaming during development
- Production logs in Cloudflare dashboard

### Analysis Tracking
- Notebook outputs include statistics
- Registry shows type frequencies
- Schema analysis tracks patterns

## Development Workflow

### Engineering Process

This repository uses **ExecPlans** (Execution Plans) for complex, multi-component changes:

- **Purpose**: Structured, living documents that guide implementation
- **Format**: Defined in `.agent/PLANS.md`
- **Examples**: See `.agent/examples/` for complete templates
- **Requirements**: See `AGENTS.md` and `CONTRIBUTING.md` for when to use

**ExecPlan Integration Points**:

When making changes spanning multiple components:

1. **Worker changes** (`worker/src/index.ts`)
   - Define expected HTTP behavior (status codes, headers)
   - Include curl commands for verification
   - Update OpenAPI schema in same milestone

2. **GPT integration** (`gpt/openapi.yaml`)
   - Keep API contract synchronized with Worker
   - Include example requests/responses
   - Validate schema after changes

3. **Notebooks** (`notebooks/*.ipynb`)
   - Document external dependencies
   - Note rate limit considerations
   - Include example outputs

The ExecPlan pattern ensures changes are:
- **Reviewable**: Diff matches plan milestones
- **Verifiable**: Acceptance criteria are demonstrable
- **Traceable**: Decisions and discoveries are documented

### Local Development
```bash
cd worker
npm install
npm run dev  # Start local server
```

### Testing
```bash
# Test validate endpoint
curl -X POST http://localhost:8787/validate \
  -H "Content-Type: application/json" \
  -d '{"root_layer": {...}}'

# Test build endpoint
curl -X POST http://localhost:8787/build-kwgt \
  -H "Content-Type: application/json" \
  -d '{"kbm": {...}, "filename": "test.kwgt"}' \
  --output test.kwgt
```

### Deployment
```bash
# Manual deployment
npm run deploy

# Automatic deployment via GitHub Actions
git push origin main
```

## Performance Considerations

### Worker Performance
- Average response time: <50ms
- JSZip compression: ~100-500ms for typical widgets
- SHA256 calculation: <10ms
- Memory efficient streaming

### Optimization Strategies
1. Minimize JSON parsing overhead
2. Stream large responses
3. Cache static resources
4. Use efficient compression
5. Limit asset sizes

### Notebook Performance
- Parallel processing where possible
- Batch operations for efficiency
- Progress indicators for long operations
- Configurable limits (MAX_RESULTS)

## Future Enhancements

### Potential Features
1. **Widget Templates**: Pre-built templates library
2. **Advanced Validation**: Layer-specific rules
3. **Asset Management**: CDN for common assets
4. **Versioning**: KBM schema version handling
5. **Batch Operations**: Process multiple widgets
6. **WebSocket API**: Real-time preview updates
7. **Analytics Dashboard**: Usage statistics
8. **Community Hub**: Share and discover widgets

### Integration Opportunities
1. KWGT app direct integration
2. Widget marketplace API
3. Design tool plugins (Figma, Sketch)
4. CI/CD for widget development
5. Automated testing framework

## Conclusion

The KWGT AI Toolchain provides a complete, scalable solution for KWGT file operations. The serverless architecture ensures low latency, high availability, and cost-effective scaling. The modular design allows easy extension and customization for specific use cases.
