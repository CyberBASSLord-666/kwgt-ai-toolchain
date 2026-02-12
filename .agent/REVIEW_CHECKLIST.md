# Pull Request Review Checklist

This document provides a standardized checklist for reviewing pull requests in the KWGT AI Toolchain repository.

## General Review Criteria

### Code Quality
- [ ] Code follows repository style guidelines
- [ ] Functions have appropriate JSDoc comments
- [ ] Variable and function names are clear and meaningful
- [ ] No unnecessary code duplication
- [ ] Error handling is appropriate and comprehensive
- [ ] TypeScript types are properly defined (minimal use of `any`)

### Functionality
- [ ] Changes accomplish the stated objective
- [ ] Edge cases are handled appropriately
- [ ] No obvious bugs or logic errors
- [ ] Performance implications are reasonable

### Testing
- [ ] Appropriate tests are included (if test infrastructure exists)
- [ ] Manual testing has been performed
- [ ] Test coverage is adequate for changes
- [ ] All tests pass (`npm test`)

### Documentation
- [ ] README.md updated if user-facing changes
- [ ] Relevant docs/ files updated
- [ ] JSDoc comments added for new functions
- [ ] Breaking changes are documented

## ExecPlan Review (if applicable)

If the PR includes an ExecPlan (see `AGENTS.md` for when this is required):

### Plan Quality
- [ ] ExecPlan is present in `.agent/plans/` directory
- [ ] Plan follows format from `.agent/PLANS.md`
- [ ] Purpose and success criteria are clear
- [ ] Milestones are independently verifiable
- [ ] Validation steps are executable (not just descriptions)

### Implementation vs. Plan
- [ ] Diff matches plan milestones
- [ ] All acceptance criteria are satisfied
- [ ] Progress section reflects actual completion state
- [ ] Decision log documents key choices
- [ ] Discoveries section captures unexpected issues

### Living Document
- [ ] Plan was updated during implementation (not just at start)
- [ ] Decisions include rationale and alternatives considered
- [ ] Retrospective is complete (if PR is ready to merge)

## Component-Specific Criteria

### Worker Changes (`worker/src/index.ts`)

- [ ] Endpoints behave as documented
  - [ ] `GET /` returns service metadata
  - [ ] `POST /validate` returns structured validation result
  - [ ] `POST /build-kwgt` returns valid ZIP with `preset.json`
- [ ] HTTP status codes are appropriate
- [ ] Required headers are present (X-KWGT-SHA256, X-KWGT-Warnings, etc.)
- [ ] CORS headers are included
- [ ] Authentication guard works correctly (if X_API_KEY is set)
- [ ] Type-check passes: `npm run type-check`
- [ ] Build succeeds: `npm run build`

### Security Checks

- [ ] Input validation is thorough
- [ ] Filename sanitization prevents header injection
- [ ] Asset name sanitization prevents path traversal
- [ ] No secrets or sensitive data in code
- [ ] Error messages don't leak sensitive information
- [ ] Asset size limits are enforced
- [ ] Request payload size limits are enforced

### OpenAPI Schema (`gpt/openapi.yaml`)

- [ ] Schema is valid OpenAPI 3.0
- [ ] New endpoints are documented
- [ ] Request/response schemas are accurate
- [ ] Examples are included
- [ ] Schema matches Worker implementation
- [ ] Security definitions are appropriate

### GPT Instructions (`gpt/CUSTOM_GPT_INSTRUCTIONS.md`)

- [ ] Instructions reflect Worker capabilities
- [ ] Behavior guidelines are clear
- [ ] Examples are accurate
- [ ] Changes are consistent with OpenAPI schema

### KBM Specification (`gpt/KBM_SPEC.md`)

- [ ] Specifications are accurate
- [ ] New fields are documented
- [ ] Examples are valid
- [ ] Format requirements are clear

### Notebooks (`notebooks/*.ipynb`)

- [ ] Code cells execute without errors
- [ ] External dependencies are documented
- [ ] Rate limit considerations are noted
- [ ] Output examples are included
- [ ] Markdown explanations are clear

### Documentation (`docs/`)

- [ ] Architecture reflects current system design
- [ ] Security guidance is up-to-date
- [ ] Troubleshooting covers new issues
- [ ] Examples are accurate and tested

## CI/CD Verification

### GitHub Actions

- [ ] Workflow file syntax is valid
- [ ] Required secrets are documented
- [ ] Build steps succeed
- [ ] Type-check passes
- [ ] Deployment succeeds (if applicable)
- [ ] Explicit permissions are set

### Manual Deployment Test

- [ ] Worker deploys successfully
- [ ] Endpoints respond as expected
- [ ] No runtime errors in production
- [ ] Performance is acceptable

## Breaking Changes

If this PR introduces breaking changes:

- [ ] Breaking changes are clearly documented
- [ ] Migration guide is provided
- [ ] Deprecation notices added (if appropriate)
- [ ] Version number will be bumped appropriately
- [ ] Users are notified via appropriate channels

## Final Checks

- [ ] Commit messages are clear and descriptive
- [ ] No merge conflicts
- [ ] Branch is up-to-date with target branch
- [ ] PR description is complete and accurate
- [ ] Related issues are linked
- [ ] All review comments are addressed

## Approval Criteria

**Approve** if:
- All required checklist items are satisfied
- Code quality meets repository standards
- Changes are well-tested and documented
- No security concerns
- ExecPlan (if present) is complete and accurate

**Request Changes** if:
- Required checklist items are not satisfied
- Security vulnerabilities are present
- Tests are missing or inadequate
- Documentation is incomplete
- ExecPlan and implementation don't match

**Comment** if:
- Minor improvements are suggested but not blocking
- Questions about design decisions
- Non-critical feedback

## Post-Merge Follow-up

After merging:

- [ ] Close related issues
- [ ] Update project board (if applicable)
- [ ] Monitor for deployment issues
- [ ] Verify changes in production
- [ ] Update release notes (if applicable)

## Special Review Scenarios

### Security-Sensitive Changes

For changes involving:
- Authentication/authorization
- Input validation/sanitization
- Cryptographic operations
- Secret management

Additional requirements:
- [ ] Security team review (if available)
- [ ] Penetration testing (if major changes)
- [ ] Security audit trail is documented
- [ ] CVE database checked for relevant vulnerabilities

### Performance-Critical Changes

For changes affecting:
- Request handling speed
- Memory usage
- Asset processing

Additional requirements:
- [ ] Performance benchmarks included
- [ ] Before/after comparison provided
- [ ] Load testing performed (if applicable)
- [ ] Monitoring plan in place

### Database/Schema Changes

For changes to:
- KBM structure
- OpenAPI schema
- Data formats

Additional requirements:
- [ ] Backward compatibility maintained
- [ ] Migration path documented
- [ ] Versioning strategy clear
- [ ] Rollback plan exists

## Resources

- `AGENTS.md` - When to use ExecPlans
- `.agent/PLANS.md` - ExecPlan format specification
- `CONTRIBUTING.md` - General contribution guidelines
- `docs/SECURITY.md` - Security guidelines
- `docs/ARCHITECTURE.md` - System architecture

## Reviewer Notes

Use this space to document review-specific context:

```markdown
## Review Notes

**Reviewer**: [Your GitHub username]
**Date**: YYYY-MM-DD
**PR**: #[number]

### Summary
[Brief summary of changes]

### Key Concerns
- [List any concerns]

### Suggestions
- [List suggestions]

### Approval Conditions
- [List conditions for approval]
```
