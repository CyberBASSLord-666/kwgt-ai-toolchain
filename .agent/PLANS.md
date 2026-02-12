# ExecPlan Format Specification

This document defines the **ExecPlan** format for the KWGT AI Toolchain repository.

## What is an ExecPlan?

An ExecPlan (Execution Plan) is a **living design document** that guides implementation of complex changes. Unlike traditional design docs that become stale, ExecPlans are updated throughout implementation to track progress, decisions, and discoveries.

## Why Use ExecPlans?

ExecPlans solve key problems in agent-assisted development:

- **Reduce ambiguity**: Plans are self-contained and explicit about what to build
- **Enable verification**: Clear acceptance criteria make changes testable
- **Track decisions**: Document why specific approaches were chosen
- **Improve reviews**: Reviewers can validate that implementation matches the plan
- **Support iteration**: Plans can be updated as new information emerges

## ExecPlan Format

Every ExecPlan must include these sections in order:

### 1. Title and Metadata

```markdown
# ExecPlan: [Brief Title]

**Status**: [Planning | In Progress | Under Review | Complete]  
**Created**: YYYY-MM-DD  
**Last Updated**: YYYY-MM-DD  
**Author**: [GitHub username or "Agent"]  
**Related Issues**: #123, #456
```

### 2. Purpose and Big Picture

**What**: A 2-3 sentence summary of what this plan accomplishes.

**Why**: The business/technical motivation. What problem does this solve?

**Success Criteria**: Observable outcomes that demonstrate completion. These must be specific and testable.

Example:
```markdown
## Purpose and Big Picture

**What**: Add a new `/export` endpoint to the Worker that returns KBM JSON formatted for external tools.

**Why**: Users need to export validated KBM in a format compatible with third-party KWGT editors.

**Success Criteria**:
- curl to `/export` returns 200 with valid JSON
- OpenAPI schema includes the new endpoint
- At least one integration test verifies export format
```

### 3. Context and Orientation

Explain the current state and what changes. Include:

- Relevant file paths and functions
- Related components (Worker, GPT, notebooks)
- Dependencies or prerequisites
- Links to related docs or issues

Example:
```markdown
## Context and Orientation

The Worker currently has three endpoints in `worker/src/index.ts`:
- GET / (service info)
- POST /validate (KBM validation)
- POST /build-kwgt (ZIP generation)

This plan adds a fourth endpoint POST /export that validates KBM and returns
it formatted for external consumption (no ZIP, just JSON).

Files to modify:
- `worker/src/index.ts` - add endpoint handler
- `gpt/openapi.yaml` - add schema definition
- `worker/tests/integration.test.ts` - add test coverage
```

### 4. Plan of Work (Milestones)

Break the work into discrete, verifiable milestones. Each milestone should:

- Be independently testable
- Have clear acceptance criteria
- Take no more than 1-2 hours to implement

Use checkboxes to track progress:

```markdown
## Plan of Work

### Milestone 1: Add endpoint handler
- [ ] Create `handleExport()` function in `worker/src/index.ts`
- [ ] Accept POST /export with KBM JSON body
- [ ] Validate KBM using existing `validateAndRepairKBM()`
- [ ] Return repaired KBM as JSON response
- [ ] Include `X-KWGT-Validated: true` header

**Validation**: curl POST with sample KBM returns 200 and valid JSON

### Milestone 2: Update OpenAPI schema
- [ ] Add `/export` path to `gpt/openapi.yaml`
- [ ] Define request body schema (KBM)
- [ ] Define response schema (validated KBM)
- [ ] Add example requests/responses

**Validation**: OpenAPI schema passes validation (lint with spectral or similar)

### Milestone 3: Add tests
- [ ] Add integration test for /export endpoint
- [ ] Test with valid KBM
- [ ] Test with invalid KBM (should repair and return)
- [ ] Test with malformed JSON (should return 400)

**Validation**: `npm test` passes with new tests
```

### 5. Validation and Acceptance

Document exactly how to verify the changes work:

```markdown
## Validation and Acceptance

### Manual Verification

1. Start local Worker:
   ```bash
   cd worker && npm run dev
   ```

2. Test export endpoint:
   ```bash
   curl -X POST http://localhost:8787/export \
     -H "Content-Type: application/json" \
     -d @examples/simple-clock.json
   ```

   **Expected**: 200 status, JSON response with validated KBM

3. Verify OpenAPI schema:
   ```bash
   npx @stoplight/spectral-cli lint gpt/openapi.yaml
   ```

### Automated Tests

Run test suite:
```bash
cd worker && npm test
```

All tests should pass, including new integration tests for /export.

### Acceptance Checklist

- [ ] curl to /export returns valid JSON
- [ ] Response includes X-KWGT-Validated header
- [ ] OpenAPI schema updated and valid
- [ ] Integration tests added and passing
- [ ] Documentation updated (README, ARCHITECTURE)
```

### 6. Progress (Living Document)

Track milestone completion and current status:

```markdown
## Progress

**Current Status**: In Progress (Milestone 2)

- [x] Milestone 1: Add endpoint handler (Completed 2026-02-11)
- [ ] Milestone 2: Update OpenAPI schema (In Progress)
- [ ] Milestone 3: Add tests (Not Started)

**Next Steps**: Complete OpenAPI schema updates, then move to testing.
```

### 7. Decision Log

Document key decisions made during implementation:

```markdown
## Decision Log

### Decision 1: Export validated KBM, not original
**Date**: 2026-02-11  
**Choice**: Return the repaired KBM from validateAndRepairKBM(), not the original input  
**Rationale**: Consistent with Worker's role as a validator. Clients get normalized output.  
**Alternatives Considered**: Return original with warnings (rejected: inconsistent with /validate behavior)

### Decision 2: No asset export in JSON
**Date**: 2026-02-11  
**Choice**: /export returns only KBM structure, not embedded assets  
**Rationale**: Assets are typically base64-encoded and large. JSON export is for schema/structure.  
**Alternatives Considered**: Include assets as base64 (rejected: payload size concerns)
```

### 8. Discoveries and Issues

Document unexpected issues or insights:

```markdown
## Discoveries and Issues

### Discovery 1: OpenAPI schema lacks KBM definition
**Date**: 2026-02-11  
**Issue**: The existing openapi.yaml doesn't define a reusable KBMJson schema  
**Impact**: Need to refactor schema to add $ref for KBM structure  
**Resolution**: Extract KBM schema as component, reuse in /validate and /export

### Issue 1: Type errors in TypeScript
**Date**: 2026-02-11  
**Issue**: `validateAndRepairKBM()` return type doesn't match expected format  
**Status**: Fixed by updating interface in `worker/src/index.ts`
```

### 9. Retrospective (After Completion)

Reflect on what worked and what didn't:

```markdown
## Retrospective

**What Went Well**:
- Clear milestones made progress easy to track
- Reusing existing validation logic reduced complexity
- OpenAPI refactoring improved overall schema quality

**What Could Be Improved**:
- Should have identified TypeScript type issues earlier
- Initial estimate of 1 hour per milestone was optimistic
- More test cases needed for edge cases

**Lessons Learned**:
- Always check type compatibility before claiming milestone complete
- Budget extra time for schema work (it ripples through multiple files)
- Consider adding more example KBM files to test against
```

## Repository-Specific Guidelines

### File Paths

Always use absolute paths from repo root:
- ✅ `worker/src/index.ts`
- ❌ `src/index.ts` or `./index.ts`

### Commands

Include full commands with context:
```bash
# Good: shows working directory
cd worker && npm test

# Less good: ambiguous location
npm test
```

### Validation

Every milestone must have a **Validation** section showing how to verify it works.

Prefer executable commands over descriptions:
- ✅ `curl -X POST http://localhost:8787/validate -d @test.json`
- ❌ "Test the validation endpoint"

## Template

Use this template for new ExecPlans (save in `.agent/plans/`):

```markdown
# ExecPlan: [Title]

**Status**: Planning  
**Created**: YYYY-MM-DD  
**Last Updated**: YYYY-MM-DD  
**Author**: [Name]  
**Related Issues**: 

## Purpose and Big Picture

**What**: 

**Why**: 

**Success Criteria**:
- 

## Context and Orientation

## Plan of Work

### Milestone 1: [Name]
- [ ] 

**Validation**: 

## Validation and Acceptance

### Manual Verification

### Automated Tests

### Acceptance Checklist

## Progress

**Current Status**: 

## Decision Log

## Discoveries and Issues

## Retrospective

```

## Examples

See `.agent/examples/` for complete example ExecPlans demonstrating this format.

## Related Documents

- `AGENTS.md` - When to use ExecPlans
- `CONTRIBUTING.md` - General contribution guidelines
- `docs/ARCHITECTURE.md` - System architecture
