# Troubleshooting Guide

Common issues and solutions for the KWGT AI Toolchain.

## Table of Contents

- [Worker Issues](#worker-issues)
- [Notebook Issues](#notebook-issues)
- [Custom GPT Issues](#custom-gpt-issues)
- [Build/Deployment Issues](#builddeployment-issues)
- [File Format Issues](#file-format-issues)

## Worker Issues

### Worker Returns 401 Unauthorized

**Symptoms**: All requests return `{"error": "Unauthorized - X-API-Key required"}`

**Cause**: X_API_KEY environment variable is set, but request doesn't include matching key

**Solutions**:
1. Add `X-API-Key` header to requests:
   ```bash
   curl -H "X-API-Key: your-secret-key" https://your-worker.workers.dev/
   ```

2. Remove X_API_KEY if authentication not needed:
   ```bash
   npx wrangler secret delete X_API_KEY
   ```

3. Verify key value:
   ```bash
   # Set the correct key
   npx wrangler secret put X_API_KEY
   ```

### Worker Returns 404 Not Found

**Symptoms**: Requests to valid endpoints return 404

**Cause**: Worker not deployed or incorrect URL

**Solutions**:
1. Verify worker is deployed:
   ```bash
   npx wrangler deployments list
   ```

2. Check worker URL in Cloudflare dashboard:
   - Go to Workers & Pages
   - Click your worker name
   - Copy the URL (e.g., `kwgt-ai-worker.your-subdomain.workers.dev`)

3. Redeploy worker:
   ```bash
   cd worker
   npm run deploy
   ```

### CORS Errors in Browser

**Symptoms**: Browser console shows CORS policy errors

**Cause**: CORS headers not properly configured

**Solutions**:
1. Check that worker includes CORS headers in all responses
2. Verify preflight (OPTIONS) requests are handled
3. For production, update allowed origins in `src/index.ts`:
   ```typescript
   const corsHeaders = {
     'Access-Control-Allow-Origin': 'https://yourdomain.com',
     // ...
   };
   ```

### Build Endpoint Returns Corrupted File

**Symptoms**: Downloaded .kwgt file cannot be opened

**Cause**: File not properly binary-encoded or corrupted during transfer

**Solutions**:
1. Verify Content-Type header is `application/zip`
2. Check that response is binary (Uint8Array)
3. Test with curl:
   ```bash
   curl -X POST https://your-worker.workers.dev/build-kwgt \
     -H "Content-Type: application/json" \
     -d @test-kbm.json \
     --output test.kwgt
   
   # Verify it's a valid ZIP
   unzip -t test.kwgt
   ```

### Worker Timeout

**Symptoms**: Request takes too long and times out

**Cause**: Large assets or complex KBM structure

**Solutions**:
1. Reduce asset sizes (compress images, subset fonts)
2. Simplify KBM structure (reduce nesting, fewer items)
3. Check CPU time limits:
   - Free tier: 10ms CPU time
   - Paid tier: 50ms CPU time
4. Use streaming for large files (future enhancement)

## Notebook Issues

### Google Drive Mount Fails

**Symptoms**: `drive.mount()` throws error or times out

**Solutions**:
1. Restart runtime: Runtime > Restart runtime
2. Clear browser cache and cookies
3. Try incognito/private browsing mode
4. Re-authenticate with Google account
5. Check Google Drive permissions

### No .kwgt Files Found

**Symptoms**: Notebook reports 0 files found

**Cause**: Files not in expected directory or wrong permissions

**Solutions**:
1. Verify files are in `MyDrive/kwgt_local_input`:
   ```python
   !ls -la /content/drive/MyDrive/kwgt_local_input/
   ```

2. Create directory if missing:
   ```python
   !mkdir -p /content/drive/MyDrive/kwgt_local_input
   ```

3. Upload files manually using Colab Files panel
4. Check file extensions (must be `.kwgt`)

### GitHub Rate Limit Exceeded

**Symptoms**: `403 Forbidden` errors from GitHub API

**Cause**: Exceeded hourly rate limit (60 without token, 5000 with token)

**Solutions**:
1. Use GitHub Personal Access Token:
   ```python
   import os
   os.environ['GH_TOKEN'] = 'your_token_here'
   ```

2. Wait for rate limit to reset (check headers):
   ```python
   rate_limit = g.get_rate_limit()
   print(f"Remaining: {rate_limit.core.remaining}")
   print(f"Resets at: {rate_limit.core.reset}")
   ```

3. Reduce MAX_RESULTS to fetch fewer files
4. Cache results to avoid repeated searches

### Preset Extraction Fails

**Symptoms**: `.kwgt` file doesn't contain `preset.json`

**Cause**: Invalid or corrupted .kwgt file, or not a real KWGT file

**Solutions**:
1. Verify file is a valid ZIP:
   ```python
   import zipfile
   with zipfile.ZipFile('file.kwgt', 'r') as z:
       print(z.namelist())
   ```

2. Check file was created by KWGT app (not manually)
3. Try opening in KWGT app first to verify
4. Re-export from KWGT app

### Out of Memory Error

**Symptoms**: Colab kernel crashes or restarts

**Cause**: Processing too many large files

**Solutions**:
1. Reduce MAX_RESULTS in harvest notebook
2. Process files in batches
3. Clear variables between batches:
   ```python
   import gc
   del large_variable
   gc.collect()
   ```
4. Use Colab Pro for more RAM
5. Filter by file size before processing

## Custom GPT Issues

### GPT Cannot Access API

**Symptoms**: "API request failed" or connection errors

**Cause**: Worker not deployed or incorrect URL in OpenAPI schema

**Solutions**:
1. Verify worker URL in `gpt/openapi.yaml`:
   ```yaml
   servers:
     - url: https://kwgt-ai-worker.YOUR_SUBDOMAIN.workers.dev
   ```

2. Update with your actual worker URL
3. Re-import schema in GPT configuration
4. Test endpoints manually first

### Authentication Errors

**Symptoms**: GPT receives 401 Unauthorized

**Solutions**:
1. If using X-API-Key:
   - Add API key in GPT Actions authentication settings
   - Use "API Key" auth type
   - Set header name: `X-API-Key`
   - Enter your secret key value

2. If not using authentication:
   - Remove `security` section from openapi.yaml
   - Redeploy worker without X_API_KEY

### Invalid KBM Generated

**Symptoms**: Validation fails or build produces incorrect widget

**Cause**: GPT generated malformed KBM structure

**Solutions**:
1. Review KBM_SPEC.md for correct structure
2. Use /validate endpoint before /build-kwgt
3. Check validation warnings in response
4. Update Custom GPT instructions with specific requirements
5. Provide example KBM structures in instructions

### GPT Response Too Long

**Symptoms**: GPT truncates responses or times out

**Solutions**:
1. Simplify widget complexity
2. Ask for specific parts only (e.g., just root_layer)
3. Break large widgets into smaller components
4. Use globals instead of inline values

## Build/Deployment Issues

### GitHub Actions Fails

**Symptoms**: Deploy workflow fails with error

**Common Causes & Solutions**:

1. **Missing Secrets**:
   ```
   Error: CLOUDFLARE_API_TOKEN not found
   ```
   - Add secrets in repository Settings > Secrets > Actions
   - Required: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

2. **Build Fails**:
   ```
   Error: Cannot find module 'jszip'
   ```
   - Check package.json dependencies
   - Ensure `npm ci` runs before build
   - Verify package-lock.json is committed

3. **Deployment Fails**:
   ```
   Error: Authentication error
   ```
   - Verify API token has Workers edit permissions
   - Check token hasn't expired
   - Ensure account ID is correct

4. **Syntax Errors**:
   - Run `npm run type-check` locally
   - Fix TypeScript errors before pushing
   - Check wrangler.toml syntax

### npm install Fails

**Symptoms**: Cannot install dependencies

**Solutions**:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and package-lock.json:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Update npm:
   ```bash
   npm install -g npm@latest
   ```

4. Check Node.js version (requires Node 16+):
   ```bash
   node --version
   ```

### TypeScript Compilation Errors

**Symptoms**: `tsc` command fails with errors

**Solutions**:
1. Check TypeScript version matches config:
   ```bash
   npm list typescript
   ```

2. Verify tsconfig.json is valid
3. Install type definitions:
   ```bash
   npm install --save-dev @cloudflare/workers-types
   ```

4. Run type check to see all errors:
   ```bash
   npm run type-check
   ```

## File Format Issues

### Invalid KBM JSON

**Symptoms**: Validation endpoint reports errors

**Common Issues**:

1. **Missing Required Fields**:
   ```json
   {
     "root_layer": {
       "internal_type": "LayerModule"  // Required
     },
     "globals": [],  // Required
     "items": []     // Required
   }
   ```

2. **Invalid Color Format**:
   ```
   Bad:  #FF0000
   Good: #FFFF0000
   ```

3. **Unwrapped Formulas**:
   ```
   Bad:  df(HH:mm)
   Good: $df(HH:mm)$
   ```

4. **Invalid JSON Syntax**:
   - Missing commas
   - Trailing commas
   - Unquoted keys
   - Single quotes instead of double quotes

**Solutions**:
1. Use JSON validator (jsonlint.com)
2. Run through /validate endpoint
3. Check validation warnings
4. Use provided examples as templates

### KWGT Won't Open File

**Symptoms**: KWGT app says "Invalid file" or crashes

**Possible Causes**:
1. File not actually a .kwgt (missing .zip structure)
2. preset.json is malformed
3. Missing required fields in KBM
4. Assets referenced but not included
5. File corrupted during transfer

**Solutions**:
1. Verify ZIP structure:
   ```bash
   unzip -l widget.kwgt
   # Should show: preset.json and optional assets
   ```

2. Extract and validate preset.json:
   ```bash
   unzip widget.kwgt preset.json
   cat preset.json | jq .  # Validate JSON
   ```

3. Check SHA256 hash matches X-KWGT-SHA256 header
4. Re-build from known-good KBM
5. Test in KWGT app with simpler widget first

### Fonts Not Loading

**Symptoms**: Widget displays with default font

**Cause**: Font file not included or wrong path

**Solutions**:
1. Include font in assets:
   ```json
   {
     "kbm": { ... },
     "assets": {
       "fonts": [
         {
           "name": "CustomFont.ttf",
           "data": "base64_encoded_font_data"
         }
       ]
     }
   }
   ```

2. Reference correct filename in KBM:
   ```json
   {
     "text_font": "CustomFont.ttf"
   }
   ```

3. Verify font is in fonts/ directory of ZIP
4. Check font file is valid TTF/OTF

### Images Not Displaying

**Symptoms**: Widget shows placeholder or missing image

**Cause**: Bitmap not included or wrong path

**Solutions**:
1. Include bitmap in assets (same as fonts)
2. Check bitmap_path references correct filename
3. Verify image is in bitmaps/ directory
4. Ensure image format is supported (PNG, JPG, WebP)
5. Check image file size isn't too large

## Getting Help

### Self-Service Resources

1. **Documentation**: Read ARCHITECTURE.md, KBM_SPEC.md
2. **Examples**: Check included test files and notebooks
3. **Logs**: Review Cloudflare logs and GitHub Actions output
4. **API Testing**: Use curl or Postman to test endpoints

### Community Support

1. **GitHub Issues**: Open issue with detailed description
   - Include error messages
   - Provide reproduction steps
   - Share relevant code snippets
   - Attach logs when applicable

2. **GitHub Discussions**: Ask questions and share experiences

### Bug Reports

When reporting bugs, include:
- Environment (OS, Node version, browser)
- Steps to reproduce
- Expected vs actual behavior
- Error messages and logs
- Screenshots if relevant
- Sample files (if safe to share)

### Feature Requests

Use GitHub Issues with:
- Clear description of desired functionality
- Use cases and motivation
- Proposed implementation (if any)
- Alternatives considered

## Debugging Tips

### Enable Verbose Logging

**Worker**:
```typescript
console.log('Debug:', JSON.stringify(data, null, 2));
```

View logs:
```bash
npx wrangler tail
```

**Notebook**:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Test Endpoints Manually

```bash
# Service info
curl https://your-worker.workers.dev/

# Validate
curl -X POST https://your-worker.workers.dev/validate \
  -H "Content-Type: application/json" \
  -d '{"root_layer":{"internal_type":"LayerModule"},"globals":[],"items":[]}'

# Build
curl -X POST https://your-worker.workers.dev/build-kwgt \
  -H "Content-Type: application/json" \
  -d '{"kbm":{"root_layer":{"internal_type":"LayerModule"},"globals":[],"items":[]},"filename":"test.kwgt"}' \
  --output test.kwgt
```

### Verify File Integrity

```bash
# Check SHA256
sha256sum widget.kwgt
# Compare with X-KWGT-SHA256 header

# Inspect ZIP contents
unzip -l widget.kwgt

# Extract and examine
unzip widget.kwgt
cat preset.json | jq .
```

### Check Service Status

- Cloudflare Status: https://www.cloudflarestatus.com/
- GitHub Status: https://www.githubstatus.com/
- Colab Status: Check Google status dashboard

## Prevention Best Practices

1. **Test Locally First**: Use `wrangler dev` before deploying
2. **Validate Early**: Use /validate before /build-kwgt
3. **Version Control**: Commit working code before changes
4. **Backup Data**: Keep copies of successful KBM files
5. **Monitor Logs**: Review regularly for warnings
6. **Update Dependencies**: Keep packages current
7. **Document Changes**: Note what worked and what didn't
8. **Use Examples**: Start from known-good templates

---

**Still having issues?** Open a GitHub issue with details, and we'll help troubleshoot!
