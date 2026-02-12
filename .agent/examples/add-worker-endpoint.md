# ExecPlan: Add New Worker Endpoint with Tests

**Status**: Complete (Example Template)  
**Created**: 2026-02-12  
**Last Updated**: 2026-02-12  
**Author**: Agent (Example)  
**Related Issues**: N/A (Template)

## Purpose and Big Picture

**What**: This is an example ExecPlan demonstrating how to add a new endpoint to the Cloudflare Worker, update the GPT OpenAPI schema, and add corresponding tests.

**Why**: Provides a concrete template for common repository changes. Shows the full cycle: Worker implementation → API schema → tests → documentation.

**Success Criteria**:
- New endpoint responds correctly to HTTP requests
- OpenAPI schema accurately describes the endpoint
- Integration tests verify endpoint behavior
- Documentation reflects the new capability

## Context and Orientation

The KWGT AI Toolchain Worker (`worker/src/index.ts`) currently has three main endpoints:

1. `GET /` - Service information
2. `POST /validate` - KBM validation and repair
3. `POST /build-kwgt` - KWGT file generation

This example shows how to add a fourth endpoint: `GET /health` for health checks.

### Current Architecture

```
worker/src/index.ts
├── fetch() handler (main entry point)
├── corsHeaders (applied to all responses)
├── checkAuth() (optional authentication)
└── endpoint handlers (inline in try/catch block)
```

### Files to Modify

- `worker/src/index.ts` - Add endpoint handler
- `gpt/openapi.yaml` - Add OpenAPI schema definition
- `worker/tests/integration.test.ts` - Add test coverage (if tests exist)
- `README.md` - Update API documentation
- `docs/ARCHITECTURE.md` - Update endpoint list

## Plan of Work

### Milestone 1: Implement Worker Endpoint

**Tasks**:
- [ ] Add `GET /health` handler in `worker/src/index.ts`
- [ ] Return JSON with status, timestamp, and version
- [ ] Include appropriate CORS headers
- [ ] Handle OPTIONS preflight for CORS

**Code Location**: `worker/src/index.ts`, in the `fetch()` handler after existing endpoints

**Expected Output**:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-12T00:00:00.000Z",
  "version": "1.0.0",
  "checks": {
    "memory": "ok",
    "cpu": "ok"
  }
}
```

**Validation**: 
```bash
cd worker && npm run dev
curl http://localhost:8787/health
# Should return 200 with JSON status
```

### Milestone 2: Update OpenAPI Schema

**Tasks**:
- [ ] Add `/health` path to `gpt/openapi.yaml`
- [ ] Define response schema with proper types
- [ ] Add example response
- [ ] Document optional query parameters (if any)

**Code Location**: `gpt/openapi.yaml`, under `paths:`

**Schema Structure**:
```yaml
/health:
  get:
    summary: Health check endpoint
    operationId: healthCheck
    responses:
      '200':
        description: Service is healthy
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HealthResponse'
```

**Validation**:
```bash
# Validate OpenAPI schema
npx @stoplight/spectral-cli lint gpt/openapi.yaml
```

### Milestone 3: Add Integration Tests

**Tasks**:
- [ ] Create test file `worker/tests/health.test.ts` (or add to existing)
- [ ] Test successful health check (200 response)
- [ ] Test response structure (all expected fields present)
- [ ] Test CORS headers are included
- [ ] Test response time is reasonable (<100ms)

**Test Framework**: Vitest + Miniflare (recommended for Workers)

**Example Test**:
```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import worker from '../src/index';

describe('GET /health', () => {
  it('returns 200 with health status', async () => {
    const request = new Request('http://localhost/health', {
      method: 'GET'
    });
    
    const response = await worker.fetch(request, {});
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
    expect(data.version).toBeDefined();
    expect(data.timestamp).toBeDefined();
  });
  
  it('includes CORS headers', async () => {
    const request = new Request('http://localhost/health');
    const response = await worker.fetch(request, {});
    
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });
});
```

**Validation**:
```bash
cd worker && npm test
# All tests should pass
```

### Milestone 4: Update Documentation

**Tasks**:
- [ ] Add health endpoint to `README.md` API section
- [ ] Update `docs/ARCHITECTURE.md` endpoint list
- [ ] Add example curl command to documentation
- [ ] Note any operational considerations

**Validation**: Review docs for completeness and accuracy

## Validation and Acceptance

### Manual Verification Steps

1. **Start local Worker**:
   ```bash
   cd worker
   npm install  # if first time
   npm run dev
   ```

2. **Test health endpoint**:
   ```bash
   # Basic check
   curl http://localhost:8787/health
   
   # Verify response format
   curl -s http://localhost:8787/health | jq .
   
   # Check CORS headers
   curl -i http://localhost:8787/health | grep -i "access-control"
   ```

3. **Validate OpenAPI schema**:
   ```bash
   npx @stoplight/spectral-cli lint gpt/openapi.yaml
   # Should show no errors
   ```

4. **Run tests**:
   ```bash
   cd worker && npm test
   # All tests pass, including new health check tests
   ```

### Automated Tests

Run the full test suite:
```bash
cd worker
npm run type-check  # TypeScript validation
npm run build       # Build check
npm test           # Run all tests
```

### Acceptance Checklist

- [ ] `GET /health` returns 200 with correct JSON structure
- [ ] Response includes `status`, `timestamp`, `version` fields
- [ ] CORS headers present in response
- [ ] OpenAPI schema updated and validates
- [ ] Integration tests added and passing
- [ ] TypeScript types are correct (no `any` types)
- [ ] Documentation updated in README and ARCHITECTURE
- [ ] Code follows repository style guidelines
- [ ] No security issues introduced (verified with CodeQL if available)

## Progress

**Current Status**: Complete (Example)

- [x] Milestone 1: Implement Worker Endpoint
- [x] Milestone 2: Update OpenAPI Schema  
- [x] Milestone 3: Add Integration Tests
- [x] Milestone 4: Update Documentation

**Next Steps**: This is a template. Copy and adapt for your specific endpoint.

## Decision Log

### Decision 1: Include version in health response
**Date**: 2026-02-12  
**Choice**: Include `version` field in health response matching package.json  
**Rationale**: Helps with debugging and deployment verification  
**Alternatives Considered**: Omit version (rejected: less useful for ops)

### Decision 2: Simple health check vs. dependency checks
**Date**: 2026-02-12  
**Choice**: Return simple "healthy" status without deep dependency checks  
**Rationale**: Worker has no external dependencies to check. Simple check sufficient.  
**Alternatives Considered**: Add checks for JSZip initialization (rejected: over-engineering for current needs)

### Decision 3: No authentication required for health endpoint
**Date**: 2026-02-12  
**Choice**: Health endpoint bypasses X_API_KEY authentication  
**Rationale**: Health checks need to work for monitoring/load balancers without credentials  
**Implementation**: Add conditional check in `checkAuth()` or handle before auth check

## Discoveries and Issues

### Discovery 1: Wrangler dev hot-reload
**Date**: 2026-02-12  
**Finding**: `wrangler dev` auto-reloads on file changes, making iteration faster  
**Impact**: Can test changes immediately without restarting server  

### Discovery 2: Miniflare environment differences
**Date**: 2026-02-12  
**Issue**: Some Worker APIs behave slightly differently in Miniflare vs production  
**Resolution**: Document known differences, test in staging before deploying  

### Issue 1: TypeScript strict mode errors
**Date**: 2026-02-12  
**Issue**: Adding new response type triggered strict null checks elsewhere  
**Status**: Fixed by properly typing all response handlers  
**Prevention**: Always run `npm run type-check` before claiming milestone complete

## Retrospective

**What Went Well**:
- Clear milestone structure made progress easy to track
- Validation steps caught issues early (before tests)
- Reusing existing patterns (corsHeaders, error handling) reduced complexity
- OpenAPI schema as single source of truth prevented API drift

**What Could Be Improved**:
- Should have added tests first (TDD approach)
- Initial time estimate (1 hour total) was too optimistic
- More example curl commands in docs would help users
- Consider adding performance benchmarks for new endpoints

**Lessons Learned**:
- Always implement endpoint + schema + tests together (don't defer tests)
- Budget 30 minutes per milestone for unexpected TypeScript issues
- Use OpenAPI schema examples as basis for integration tests
- Run full validation cycle after each milestone, not just at end

**Recommendations for Next Time**:
- Start with OpenAPI schema (contract-first development)
- Write tests before implementation (TDD)
- Add curl examples to plan as you discover edge cases
- Keep Decision Log updated in real-time, not as afterthought

## Notes for Using This Template

When creating your own ExecPlan:

1. **Copy this file** to `.agent/plans/your-feature-name.md`
2. **Update all sections** with your specific requirements
3. **Keep it updated** as you work (Progress, Decision Log, Discoveries)
4. **Link from PR** description so reviewers can reference it
5. **Complete Retrospective** after merging to help future work

Remember: The plan is the ground truth. Update it as you learn and discover during implementation.
