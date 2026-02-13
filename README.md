# KWGT AI Toolchain

A comprehensive toolchain for building, validating, and analyzing KWGT (Kustom Widget) files using AI-powered tools and serverless infrastructure.

## 🌟 Features

- **Cloudflare Worker API**: Serverless API for building and validating KWGT files
  - Validate and repair KBM JSON structures
  - Build .kwgt files with JSZip
  - Color normalization and formula wrapping
  - Optional authentication with API keys
  
- **Custom GPT Integration**: OpenAPI schema and instructions for AI-powered widget creation
  - Generate KBM JSON from natural language
  - Validate before building
  - Comprehensive KBM specification

- **Analysis Notebooks**: Colab notebooks for mining and analyzing KWGT files
  - Local ingest from Google Drive
  - GitHub repository harvesting
  - Internal type registry generation
  - Schema analysis and statistics

## 📁 Repository Structure

```
kwgt-ai-toolchain/
├── worker/                  # Cloudflare Worker (TypeScript)
│   ├── src/
│   │   └── index.ts        # Main Worker implementation
│   ├── package.json
│   ├── tsconfig.json
│   ├── wrangler.toml       # Worker configuration
│   └── README.md
├── gpt/                     # Custom GPT resources
│   ├── openapi.yaml        # OpenAPI schema for GPT Actions
│   ├── CUSTOM_GPT_INSTRUCTIONS.md
│   └── KBM_SPEC.md         # KBM JSON specification
├── notebooks/               # Jupyter/Colab notebooks
│   ├── KWGT_miner_optimized_with_local_ingest.ipynb
│   └── KWGT_harvest_and_extract_from_github.ipynb
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md     # System architecture
│   ├── SECURITY.md         # Security guidelines
│   └── TROUBLESHOOTING.md  # Common issues and solutions
├── scripts/                 # Helper scripts
│   └── validate.js         # Local KBM validation
├── .github/
│   └── workflows/
│       └── deploy-worker.yml  # GitHub Actions deployment
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Deploy the Cloudflare Worker

#### Prerequisites
- Node.js 18+ and npm
- Cloudflare account (free tier works)
- GitHub account (for automatic deployment)

#### Local Development

```bash
# Navigate to worker directory
cd worker

# Install dependencies
npm install

# Run locally
npm run dev

# Open http://localhost:8787 in your browser
```

#### Deploy to Cloudflare

**Option A: Manual Deployment**

```bash
# Login to Cloudflare
npx wrangler login

# Deploy
npm run deploy
```

**Option B: Automatic Deployment via GitHub Actions**

1. Get your Cloudflare credentials:
   - API Token: Cloudflare Dashboard > My Profile > API Tokens > Create Token
   - Account ID: Cloudflare Dashboard > Workers & Pages (in the URL or sidebar)

2. Add secrets to GitHub repository:
   - Go to Settings > Secrets and variables > Actions
   - Add `CLOUDFLARE_API_TOKEN`
   - Add `CLOUDFLARE_ACCOUNT_ID`

3. Push to main branch or manually trigger the workflow

4. Worker automatically deploys on changes to `worker/` directory

### 2. Set Up Custom GPT (Optional)

1. Go to OpenAI ChatGPT > Explore GPTs > Create
2. Configure GPT:
   - Name: "KWGT Widget Builder"
   - Description: "Builds KWGT widgets from natural language"
   - Instructions: Copy from `gpt/CUSTOM_GPT_INSTRUCTIONS.md`
3. Add Actions:
   - Import schema from `gpt/openapi.yaml`
   - Update server URL to your deployed Worker URL
   - Configure authentication if using X-API-Key
4. Test and publish

### 3. Use Analysis Notebooks

#### Local Ingest Notebook

1. Open in Google Colab: Upload `notebooks/KWGT_miner_optimized_with_local_ingest.ipynb`
2. Upload .kwgt files to `MyDrive/kwgt_local_input` in Google Drive
3. Run all cells
4. Download `kwgt_mining_results.zip` with extracted data

#### GitHub Harvest Notebook

1. Open in Google Colab: Upload `notebooks/KWGT_harvest_and_extract_from_github.ipynb`
2. (Optional) Set `GH_TOKEN` environment variable for higher rate limits
3. Run all cells
4. Download `kwgt_github_harvest.zip` with harvested widgets

## 🔧 Configuration

### Worker Environment Variables

Set via Wrangler or Cloudflare Dashboard:

```bash
# Optional: Require API key for requests
npx wrangler secret put X_API_KEY
```

Or in Cloudflare Dashboard:
- Workers & Pages > [Your Worker] > Settings > Variables

### Worker Customization

Edit `worker/wrangler.toml`:
```toml
name = "kwgt-ai-worker"  # Change worker name
compatibility_date = "2024-01-01"
```

## 📚 API Documentation

### Endpoints

#### GET /
Get service information.

**Response:**
```json
{
  "service": "KWGT AI Toolchain Worker",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

#### POST /validate
Validate and repair KBM JSON.

**Request:**
```json
{
  "root_layer": {
    "internal_type": "LayerModule"
  },
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

#### POST /build-kwgt
Build .kwgt file from KBM JSON.

**Request:**
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
- Binary .kwgt file (application/zip)
- Headers:
  - `X-KWGT-SHA256`: File hash
  - `X-KWGT-Warnings`: Validation warnings

### Example Usage

```bash
# Validate KBM
curl -X POST https://your-worker.workers.dev/validate \
  -H "Content-Type: application/json" \
  -d '{"root_layer":{"internal_type":"LayerModule"},"globals":[],"items":[]}'

# Build KWGT file
curl -X POST https://your-worker.workers.dev/build-kwgt \
  -H "Content-Type: application/json" \
  -d @my-widget.json \
  --output widget.kwgt
```

With API key authentication:
```bash
curl -H "X-API-Key: your-secret-key" \
  https://your-worker.workers.dev/
```

## 🛠️ Development

### Local Testing

```bash
# Worker
cd worker
npm run dev          # Start local server
npm run type-check   # TypeScript validation
npm run build        # Compile TypeScript

# Local validation script
node scripts/validate.js examples/simple-clock.json
```

### Project Scripts

Worker (`worker/package.json`):
- `npm run dev` - Start local development server
- `npm run build` - Build TypeScript
- `npm run type-check` - Check types without building
- `npm run deploy` - Deploy to Cloudflare

## 🤖 Working with AI Coding Agents

This repository supports AI-assisted development through **ExecPlans** (Execution Plans).

### Quick Start with ExecPlans

**Create a new ExecPlan** (interactive):
```bash
node .agent/scripts/new-plan.js
```

**Or copy the template manually**:
```bash
cp .agent/templates/execplan-template.md .agent/plans/my-change.md
```

### What Are ExecPlans?

- **What**: Structured, living documents that guide complex changes
- **Why**: Make agent-driven development predictable, reviewable, and reliable
- **When**: Required for multi-component changes, new endpoints, schema updates
- **How**: See `.agent/QUICKSTART.md` for 5-minute guide

### When to Use ExecPlans

✅ **Use ExecPlan for**:
- New Worker endpoints or schema changes
- Multi-component changes (3+ directories)
- Security/performance work
- Refactoring or test infrastructure

❌ **Skip ExecPlan for**:
- Typo fixes or simple doc updates
- Single-function bug fixes
- Dependency version bumps

### Resources

- 📖 **Quick Start**: `.agent/QUICKSTART.md` - Get started in 5 minutes
- 📋 **Template**: `.agent/templates/execplan-template.md` - Copy-paste ready
- 📚 **Full Format**: `.agent/PLANS.md` - Complete specification
- 💡 **Examples**: `.agent/examples/` - Real-world examples
- 🤖 **Agent Guide**: `AGENTS.md` - How agents should work in this repo

## 📖 Documentation

- **[Architecture](docs/ARCHITECTURE.md)**: System design and component overview
- **[Security](docs/SECURITY.md)**: Security guidelines and best practices
- **[Troubleshooting](docs/TROUBLESHOOTING.md)**: Common issues and solutions
- **[KBM Spec](gpt/KBM_SPEC.md)**: Complete KBM JSON specification
- **[Worker README](worker/README.md)**: Worker-specific documentation

## 🔒 Security

- Store API keys as secrets (never commit)
- Use HTTPS for all API requests
- Validate all inputs
- Review [SECURITY.md](docs/SECURITY.md) for details

### Setting Secrets

```bash
# Cloudflare Worker
npx wrangler secret put X_API_KEY

# GitHub Actions
# Add via repository Settings > Secrets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🐛 Troubleshooting

Common issues and solutions are documented in [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

Quick checks:
- Worker deployed? Check Cloudflare Dashboard
- Correct URL? Verify in openapi.yaml and requests
- API key required? Check X_API_KEY configuration
- CORS issues? Check browser console and Worker CORS headers

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/CyberBASSLord-666/kwgt-ai-toolchain/issues)
- **Discussions**: [GitHub Discussions](https://github.com/CyberBASSLord-666/kwgt-ai-toolchain/discussions)
- **Documentation**: See `docs/` directory

## 🎯 Use Cases

- **AI-Assisted Widget Creation**: Use Custom GPT to generate widgets from descriptions
- **Widget Validation**: Ensure KBM structures are valid before testing
- **Batch Building**: Programmatically create multiple widgets
- **Widget Analysis**: Mine existing widgets for patterns and best practices
- **Schema Discovery**: Identify all internal_type values and their properties

## 🔮 Future Enhancements

- Widget template library
- Advanced validation rules
- Asset management and CDN
- Batch processing API
- Real-time preview generation
- Community widget marketplace
- Automated testing framework

## 🙏 Acknowledgments

- KWGT app by [Kustom Industries](https://kustom.rocks)
- Cloudflare Workers platform
- OpenAI Custom GPT platform
- Google Colab for notebook hosting

---

**Built with ❤️ for the KWGT community**
