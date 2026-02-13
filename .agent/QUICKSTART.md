# ExecPlan Quick Start Guide

Get started with ExecPlans in under 5 minutes.

## Do I Need an ExecPlan?

Use this decision tree:

```
Is your change...

├─ A typo fix or simple doc update? 
│  └─ NO EXECPLAN NEEDED ✓
│
├─ A single-function bug fix with clear cause?
│  └─ NO EXECPLAN NEEDED ✓
│
├─ Adding/changing a Worker endpoint?
│  └─ YES, USE EXECPLAN 📋
│
├─ Modifying gpt/openapi.yaml?
│  └─ YES, USE EXECPLAN 📋
│
├─ Changes spanning 3+ directories?
│  └─ YES, USE EXECPLAN 📋
│
├─ Adding tests or test infrastructure?
│  └─ YES, USE EXECPLAN 📋
│
├─ Security or performance work?
│  └─ YES, USE EXECPLAN 📋
│
└─ Refactoring existing code?
   └─ YES, USE EXECPLAN 📋
```

## Quick Start (3 Steps)

### Step 1: Copy Template (30 seconds)

```bash
# From repository root
cp .agent/templates/execplan-template.md .agent/plans/my-change.md
```

### Step 2: Fill Key Sections (3 minutes)

Open `.agent/plans/my-change.md` and fill in:

1. **Title and Metadata** (at the top)
   - Change status to "Planning"
   - Add today's date
   - Add issue number if applicable

2. **Purpose** (2-3 sentences)
   - What: One sentence describing the change
   - Why: One sentence explaining the motivation
   - Success Criteria: 3-5 bullet points of observable outcomes

3. **Plan of Work** (outline milestones)
   - Break work into 2-4 milestones
   - Each milestone should take 1-2 hours max
   - Add validation command for each

### Step 3: Start Coding (with plan as guide)

- Work through milestones in order
- Check off tasks as you complete them
- Update Progress section
- Add decisions and discoveries as they happen

## Minimal ExecPlan Example

Here's the absolute minimum needed:

```markdown
# ExecPlan: Add Health Check Endpoint

**Status**: Planning  
**Created**: 2026-02-13  
**Author**: Agent

## Purpose and Big Picture

**What**: Add GET /health endpoint for monitoring.

**Why**: Operations needs a reliable health check for uptime monitoring.

**Success Criteria**:
- [ ] curl to /health returns 200
- [ ] Response includes timestamp and status

## Plan of Work

### Milestone 1: Add Endpoint
- [ ] Add GET /health handler to worker/src/index.ts
- [ ] Return JSON with status and timestamp

**Validation**: `curl http://localhost:8787/health`

### Milestone 2: Update Docs
- [ ] Add endpoint to README.md
- [ ] Update gpt/openapi.yaml

**Validation**: Schema validates with no errors

## Progress

- [ ] Milestone 1 (Not Started)
- [ ] Milestone 2 (Not Started)
```

That's it! You can expand sections as you work.

## Tips for Success

### ✅ Do This

- **Start simple**: Fill minimum sections, expand as needed
- **Be specific**: "curl returns 200" not "endpoint works"
- **Update live**: Mark tasks done as you complete them
- **Track decisions**: Note why you chose specific approaches
- **Add validation**: Every milestone needs a "how to test it" command

### ❌ Avoid This

- **Over-planning**: Don't write a novel before coding
- **Vague outcomes**: "Better performance" isn't testable
- **Skipping validation**: Every milestone needs verification
- **Abandoning plan**: Keep it updated or it becomes useless
- **Perfectionism**: Plan can evolve; don't wait for perfect plan

## Common Patterns

### Adding a Worker Endpoint

Milestones:
1. Implement handler in `worker/src/index.ts`
2. Update `gpt/openapi.yaml` schema
3. Add tests (if test infrastructure exists)
4. Update documentation

### Changing KBM Schema

Milestones:
1. Update validation logic in `validateAndRepairKBM()`
2. Update `gpt/KBM_SPEC.md` documentation
3. Add examples to `examples/`
4. Test with existing .kwgt files

### Adding Security Control

Milestones:
1. Implement security check function
2. Add to request processing pipeline
3. Add tests for attack vectors
4. Update `docs/SECURITY.md`

## Need Help?

- **Full format**: See `.agent/PLANS.md`
- **Complete example**: See `.agent/examples/add-worker-endpoint.md`
- **Questions**: Check `AGENTS.md` for when to use ExecPlans

## After Completion

Don't forget to:
1. Fill out Retrospective section
2. Mark status as "Complete"
3. Link ExecPlan in PR description
4. Keep plan in `.agent/plans/` for reference
