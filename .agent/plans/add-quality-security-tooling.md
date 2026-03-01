# ExecPlan: Add Free Quality and Security Tooling

**Status**: Complete  
**Created**: 2026-02-13  
**Last Updated**: 2026-02-13  
**Author**: Agent  
**Related Issues**: N/A

## Purpose and Big Picture

**What**: Add a minimal, production-grade linting and security scanning toolchain using ESLint and GitHub CodeQL.

**Why**: The repository currently validates TypeScript compilation only. Adding linting and static security scanning improves code quality and catches issues earlier in pull requests.

**Success Criteria**:
- `npm run lint` exists and passes for Worker TypeScript code
- CI runs lint + type-check + build on pushes/PRs
- CodeQL workflow scans JavaScript/TypeScript code on pushes/PRs

## Context and Orientation

Current automation exists only in `.github/workflows/deploy-worker.yml` and runs type-check/build before deploy. Worker tooling is defined in `worker/package.json`, with no lint script or ESLint configuration.

Files expected to change:
- `worker/package.json`
- `worker/package-lock.json`
- `worker/eslint.config.js` (new)
- `.github/workflows/ci.yml` (new)
- `.github/workflows/codeql.yml` (new)
- `README.md` (commands section)

## Plan of Work

### Milestone 1: Add ESLint tooling
- [x] Add ESLint dependencies for TypeScript Worker code
- [x] Add flat ESLint config and lint script
- [x] Verify `npm run lint` succeeds

**Validation**: `cd worker && npm run lint`

### Milestone 2: Add CI quality workflow
- [x] Create workflow for PR/push quality checks
- [x] Run lint, type-check, and build in CI

**Validation**: Workflow YAML is valid and references existing scripts

### Milestone 3: Add CodeQL workflow
- [x] Create GitHub CodeQL workflow for JS/TS analysis
- [x] Ensure it runs on PRs and pushes

**Validation**: Workflow YAML follows GitHub CodeQL recommended structure

### Milestone 4: Update docs
- [x] Document lint command and new CI/security automation in README

**Validation**: README reflects actual commands

## Progress

**Current Status**: Complete

- [x] Milestone 1: Add ESLint tooling
- [x] Milestone 2: Add CI quality workflow
- [x] Milestone 3: Add CodeQL workflow
- [x] Milestone 4: Update docs

## Decision Log

### Decision 1: Keep tooling scoped to Worker package
**Date**: 2026-02-13  
**Choice**: Configure ESLint in `worker/` only  
**Rationale**: This is the only active TypeScript runtime component; minimizes project churn  
**Alternatives Considered**: Root-level multi-package lint setup (rejected as unnecessary complexity)

## Discoveries and Issues

### Discovery 1: ESLint 10 is currently incompatible with typescript-eslint v8
**Date**: 2026-02-13  
**Issue**: npm resolved `eslint@10`, which conflicts with `typescript-eslint@8` peer requirements  
**Impact**: Installation fails with dependency resolution errors  
**Resolution**: Pin to compatible major (`eslint@^9`, `@eslint/js@^9`)

## Retrospective

Minimal focused changes worked well: tooling is now in place without requiring source refactors. Disabling `no-explicit-any` preserved current code patterns while still enabling lint checks for other issues.
