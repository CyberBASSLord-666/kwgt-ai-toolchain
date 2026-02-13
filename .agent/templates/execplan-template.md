# ExecPlan: [Brief Descriptive Title]

**Status**: Planning  
**Created**: YYYY-MM-DD  
**Last Updated**: YYYY-MM-DD  
**Author**: [Your Name or "Agent"]  
**Related Issues**: #XXX

---

## Purpose and Big Picture

**What**: [2-3 sentence summary of what this accomplishes]

**Why**: [Business/technical motivation - what problem does this solve?]

**Success Criteria**:
- [ ] [Observable outcome 1 - must be testable]
- [ ] [Observable outcome 2 - must be testable]
- [ ] [Observable outcome 3 - must be testable]

---

## Context and Orientation

[Explain current state and what will change]

**Current State**:
- [Relevant files and their current behavior]
- [Related components that interact with this change]

**Proposed Changes**:
- [High-level overview of modifications]
- [Dependencies or prerequisites]

**Files to Modify**:
- `path/to/file1.ts` - [what changes]
- `path/to/file2.yaml` - [what changes]
- `path/to/file3.md` - [what changes]

---

## Plan of Work

### Milestone 1: [First Major Step]
- [ ] [Specific task 1]
- [ ] [Specific task 2]
- [ ] [Specific task 3]

**Validation**: [How to verify this milestone works - executable command preferred]
```bash
# Example command to test
curl -X GET http://localhost:8787/endpoint
```

**Expected Output**: [What should happen]

---

### Milestone 2: [Second Major Step]
- [ ] [Specific task 1]
- [ ] [Specific task 2]

**Validation**: [How to verify this milestone works]
```bash
# Example command
npm test
```

**Expected Output**: [What should happen]

---

### Milestone 3: [Third Major Step]
- [ ] [Specific task 1]
- [ ] [Specific task 2]

**Validation**: [How to verify this milestone works]

**Expected Output**: [What should happen]

---

## Validation and Acceptance

### Manual Verification

**Step 1**: [First verification step]
```bash
# Command to run
cd worker && npm run dev
```

**Step 2**: [Second verification step]
```bash
# Command to test endpoint
curl -X POST http://localhost:8787/validate -d @test.json
```
**Expected**: [What should happen]

**Step 3**: [Third verification step]

---

### Automated Tests

```bash
# Run test suite
cd worker && npm test
```

**Expected**: All tests pass, including new tests for this change

---

### Acceptance Checklist

- [ ] All milestones completed
- [ ] Manual verification successful
- [ ] Automated tests passing
- [ ] Code reviewed (if applicable)
- [ ] Documentation updated
- [ ] OpenAPI schema updated (if API changes)
- [ ] No regressions in existing functionality

---

## Progress

**Current Status**: Planning

**Milestones**:
- [ ] Milestone 1: [Name] (Not Started)
- [ ] Milestone 2: [Name] (Not Started)
- [ ] Milestone 3: [Name] (Not Started)

**Next Steps**: [What to do next]

**Blockers**: [Any issues preventing progress]

---

## Decision Log

### Decision 1: [Decision Title]
**Date**: YYYY-MM-DD  
**Choice**: [What was decided]  
**Rationale**: [Why this choice was made]  
**Alternatives Considered**: [Other options and why they were rejected]  
**Impact**: [How this affects the implementation]

---

### Decision 2: [Decision Title]
**Date**: YYYY-MM-DD  
**Choice**: [What was decided]  
**Rationale**: [Why this choice was made]  
**Alternatives Considered**: [Other options]  
**Impact**: [Effects on implementation]

---

## Discoveries and Issues

### Discovery 1: [What was discovered]
**Date**: YYYY-MM-DD  
**Description**: [What was found - unexpected behavior, missing documentation, etc.]  
**Impact**: [How this affects the plan]  
**Resolution**: [How it was handled - plan updated, workaround found, etc.]

---

### Issue 1: [Problem encountered]
**Date**: YYYY-MM-DD  
**Description**: [What went wrong]  
**Status**: [Fixed | Workaround | Blocked | Investigating]  
**Resolution**: [How it was resolved or current status]

---

## Retrospective

*Fill this out after completion*

**What Went Well**:
- [Positive aspect 1]
- [Positive aspect 2]

**What Could Be Improved**:
- [Area for improvement 1]
- [Area for improvement 2]

**Lessons Learned**:
- [Lesson 1]
- [Lesson 2]

**Time Estimate vs Actual**:
- Estimated: [X hours]
- Actual: [Y hours]
- Variance: [Explanation if significant difference]

---

## Related Resources

- [Link to relevant documentation]
- [Link to related issues/PRs]
- [Link to external references]
