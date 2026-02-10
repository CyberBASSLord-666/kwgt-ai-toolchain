# Security Guidelines

This document outlines security considerations and best practices for the KWGT AI Toolchain.

## Authentication & Authorization

### API Key Protection

**Worker API Keys**
- Store `X_API_KEY` as a Cloudflare Workers secret (never commit to repository)
- Use strong, randomly generated keys (minimum 32 characters)
- Rotate keys regularly (every 90 days recommended)
- Use different keys for different environments (dev, staging, production)

**Setting Worker Secrets**:
```bash
# Using Wrangler CLI
npx wrangler secret put X_API_KEY

# Via Cloudflare Dashboard
# Workers & Pages > [Your Worker] > Settings > Variables > Add
```

### GitHub Token Security

**For Harvest Notebook**
- Use Personal Access Tokens (PAT) with minimal scopes
- Required scope: `public_repo` (or `repo` for private repos)
- Set expiration dates on tokens (90 days maximum)
- Store as Colab secrets or environment variables
- Never commit tokens to notebooks

**Creating GitHub PAT**:
1. GitHub Settings > Developer Settings > Personal Access Tokens
2. Generate new token (fine-grained recommended)
3. Set expiration and minimal permissions
4. Copy token immediately (shown only once)

### Request Authentication

**Worker Authentication Flow**:
```
Client Request
    ↓
Check X-API-Key header exists? → No → Allow (if X_API_KEY not configured)
    ↓ Yes
Compare with stored X_API_KEY → Match? → Allow
    ↓ No
Return 401 Unauthorized
```

**CORS Configuration**:
- Current: `Access-Control-Allow-Origin: *` (permissive)
- Production: Restrict to known domains
- Example: `Access-Control-Allow-Origin: https://yourdomain.com`

## Input Validation

### KBM JSON Validation

**Potential Threats**:
- Malicious JSON payloads
- Extremely large structures (DoS)
- Recursive/circular references
- Code injection via formulas

**Mitigations**:
1. **Size Limits**: Enforce maximum payload size (e.g., 10MB)
2. **Schema Validation**: Verify structure before processing
3. **Sanitization**: Escape special characters in formulas
4. **Timeout**: Limit processing time per request

**Implementation Example**:
```typescript
// Add to Worker
const MAX_PAYLOAD_SIZE = 10 * 1024 * 1024; // 10MB

if (request.headers.get('content-length') > MAX_PAYLOAD_SIZE) {
  return new Response('Payload too large', { status: 413 });
}
```

### Asset Validation

**Risks**:
- Malicious files (viruses, scripts)
- Excessive file sizes
- Invalid base64 encoding
- Unsupported file types

**Recommended Checks**:
1. Validate base64 encoding
2. Verify file signatures (magic numbers)
3. Limit asset sizes (fonts: 5MB, images: 2MB)
4. Check MIME types
5. Scan for embedded scripts

### Formula Validation

**Security Concerns**:
- While KWGT formulas are not executable in the Worker, ensure they don't contain sensitive data
- Sanitize formula strings before storage
- Validate formula syntax

## Data Privacy

### User Data Handling

**Worker Processing**:
- Stateless operation (no data persistence)
- No logging of KBM content
- Temporary memory only during request
- No third-party data sharing

**Notebook Processing**:
- Local Colab execution
- User controls data sources
- No automatic uploads
- Results stored in user's Drive

### Sensitive Information

**Never Include**:
- API keys in KBM JSON
- Personal information (names, emails, addresses)
- Location data (unless required for functionality)
- Authentication tokens
- Private URLs or endpoints

**Scanning for Secrets**:
```bash
# Use secret scanning tools
npm install -g @gitguardian/ggshield
ggshield secret scan path ./
```

## Deployment Security

### GitHub Actions Secrets

**Required Secrets**:
- `CLOUDFLARE_API_TOKEN`: API token with Workers edit permissions
- `CLOUDFLARE_ACCOUNT_ID`: Account identifier

**Best Practices**:
1. Use repository secrets (Settings > Secrets > Actions)
2. Limit token permissions to Workers only
3. Use short-lived tokens when possible
4. Audit secret access regularly
5. Rotate tokens after team member changes

### Worker Deployment

**Security Checklist**:
- [ ] X_API_KEY configured in production
- [ ] CORS restricted to known domains
- [ ] Rate limiting configured (if needed)
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies are up-to-date
- [ ] No hardcoded secrets in code
- [ ] Wrangler.toml doesn't contain secrets

### Cloudflare Workers Security Features

**Built-in Protections**:
- DDoS protection
- TLS/SSL encryption
- Isolated execution (V8 isolates)
- No file system access
- Limited CPU time per request
- Network egress restrictions

## Dependency Management

### NPM Dependencies

**Current Dependencies**:
- `jszip`: ZIP file creation
- `@cloudflare/workers-types`: TypeScript definitions
- `typescript`: Language compiler
- `wrangler`: Deployment CLI

**Security Practices**:
1. Audit dependencies regularly
   ```bash
   npm audit
   npm audit fix
   ```

2. Use lock files (`package-lock.json`)
3. Update dependencies monthly
4. Review dependency licenses
5. Monitor security advisories

### Vulnerable Dependencies

**Response Process**:
1. Identify vulnerability (GitHub Dependabot, `npm audit`)
2. Check severity and exploitability
3. Update to patched version
4. Test thoroughly
5. Deploy fix immediately for critical issues

## Rate Limiting

### Worker Rate Limits

**Cloudflare Built-in**:
- Free tier: 100,000 requests/day
- Automatically enforced
- Returns 429 Too Many Requests when exceeded

**Custom Rate Limiting** (optional):
```typescript
// Example: Per-IP rate limiting
const rateLimiter = new Map<string, number>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const lastRequest = rateLimiter.get(ip) || 0;
  
  if (now - lastRequest < 1000) { // 1 req/second
    return false;
  }
  
  rateLimiter.set(ip, now);
  return true;
}
```

### GitHub API Rate Limits

**Limits**:
- Unauthenticated: 60 requests/hour
- Authenticated: 5000 requests/hour

**Best Practices**:
1. Use authentication token
2. Cache results when possible
3. Implement exponential backoff
4. Monitor rate limit headers
5. Batch requests when possible

## Error Handling

### Secure Error Messages

**Bad Example** (leaks information):
```json
{
  "error": "Database connection failed at 10.0.1.5:5432"
}
```

**Good Example** (generic):
```json
{
  "error": "Internal server error",
  "request_id": "abc123"
}
```

**Implementation**:
```typescript
try {
  // Process request
} catch (error) {
  console.error('Error:', error); // Log detailed error
  
  // Return generic message to user
  return new Response(
    JSON.stringify({ error: 'Internal server error' }),
    { status: 500 }
  );
}
```

## Monitoring & Incident Response

### Security Monitoring

**Watch For**:
- Unusual request patterns
- High error rates
- Large payload sizes
- Failed authentication attempts
- Unexpected geographic distribution

**Tools**:
- Cloudflare Analytics Dashboard
- Wrangler tail (real-time logs)
- GitHub Actions logs
- Dependabot alerts

### Incident Response Plan

**Steps**:
1. **Detection**: Identify security issue
2. **Containment**: Disable affected service if needed
3. **Investigation**: Analyze scope and impact
4. **Remediation**: Apply fixes
5. **Recovery**: Restore service
6. **Post-Mortem**: Document and improve

**Emergency Contacts**:
- Repository owner/maintainers
- Cloudflare support (for infrastructure issues)
- GitHub security team (for repository issues)

## Compliance & Regulations

### Data Residency

**Cloudflare Workers**:
- Executes in edge locations globally
- No persistent data storage
- Temporary memory only during request
- Complies with GDPR (no personal data stored)

### GDPR Considerations

**User Rights**:
- Right to access: No user data stored
- Right to deletion: N/A (no persistence)
- Right to portability: Users own their KBM data

**Recommendations**:
- Document data flow in privacy policy
- Provide transparency about processing
- Allow users to opt-out of optional features

## Best Practices Summary

### For Developers

1. ✅ Never commit secrets to repository
2. ✅ Use environment variables for configuration
3. ✅ Validate all inputs thoroughly
4. ✅ Keep dependencies updated
5. ✅ Use TypeScript for type safety
6. ✅ Implement proper error handling
7. ✅ Test security controls regularly
8. ✅ Review code for security issues
9. ✅ Document security assumptions
10. ✅ Follow principle of least privilege

### For Users

1. ✅ Keep API keys secret
2. ✅ Use strong, unique keys
3. ✅ Don't share GitHub tokens
4. ✅ Review widget content before building
5. ✅ Verify SHA256 hashes
6. ✅ Download from trusted sources only
7. ✅ Report security issues responsibly
8. ✅ Keep software updated

### For Operators

1. ✅ Configure X_API_KEY in production
2. ✅ Restrict CORS to known domains
3. ✅ Monitor for unusual activity
4. ✅ Rotate secrets regularly
5. ✅ Enable Cloudflare security features
6. ✅ Review access logs
7. ✅ Maintain incident response plan
8. ✅ Document security configuration

## Responsible Disclosure

If you discover a security vulnerability, please:

1. **Do NOT** open a public issue
2. Email security contact (set in GitHub Security settings)
3. Provide detailed description and reproduction steps
4. Allow reasonable time for fix before disclosure
5. Follow coordinated disclosure practices

**Response Timeline**:
- Acknowledgment: Within 48 hours
- Initial assessment: Within 7 days
- Fix timeline: Based on severity
  - Critical: 24-48 hours
  - High: 1 week
  - Medium: 2-4 weeks
  - Low: Next release

## Security Resources

### Cloudflare Security
- [Workers Security Documentation](https://developers.cloudflare.com/workers/platform/security/)
- [Security Best Practices](https://developers.cloudflare.com/fundamentals/security/)

### GitHub Security
- [GitHub Security Features](https://docs.github.com/en/code-security)
- [Actions Security Hardening](https://docs.github.com/en/actions/security-guides)

### General Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)

## Changelog

- 2024-02-10: Initial security guidelines created
