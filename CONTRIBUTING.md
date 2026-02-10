# Contributing to KWGT AI Toolchain

Thank you for your interest in contributing to the KWGT AI Toolchain! This document provides guidelines and instructions for contributing.

## Ways to Contribute

- 🐛 Report bugs and issues
- 💡 Suggest new features or improvements
- 📝 Improve documentation
- 🔧 Submit bug fixes
- ✨ Add new features
- 🧪 Write tests
- 📊 Add example widgets

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/kwgt-ai-toolchain.git
   cd kwgt-ai-toolchain
   ```
3. Set up the development environment:
   ```bash
   cd worker
   npm install
   npm run dev
   ```

## Development Workflow

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards

3. Test your changes:
   ```bash
   cd worker
   npm run type-check
   npm run build
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request on GitHub

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for Worker code
- Follow existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and single-purpose

### Documentation

- Update README.md if adding user-facing features
- Add JSDoc comments for functions
- Update relevant docs/ files
- Include examples where helpful

### Commit Messages

- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Keep first line under 72 characters
- Add details in the body if needed

Examples:
- ✅ `Add support for custom font validation`
- ✅ `Fix color normalization for edge cases`
- ❌ `updates` (too vague)
- ❌ `Fixed bug` (not specific enough)

## Pull Request Guidelines

### Before Submitting

- [ ] Code builds without errors
- [ ] TypeScript type-check passes
- [ ] Changes are tested
- [ ] Documentation is updated
- [ ] Commit messages are clear

### PR Description

Include:
- Summary of changes
- Motivation/context
- Related issues (if any)
- Testing performed
- Breaking changes (if any)

### Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, a maintainer will merge

## Reporting Bugs

### Before Reporting

- Check if the issue already exists
- Verify it's reproducible
- Collect relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Actual behavior**
What actually happened.

**Environment**
- Worker URL: [e.g., https://kwgt-ai-worker.workers.dev]
- Browser: [e.g., Chrome 120]
- KBM structure: [paste minimal example]

**Additional context**
Error messages, logs, screenshots, etc.
```

## Suggesting Features

### Feature Request Template

```markdown
**Feature description**
Clear description of the proposed feature.

**Use case**
Why is this feature needed? What problem does it solve?

**Proposed solution**
How you envision this working.

**Alternatives considered**
Other approaches you've thought about.

**Additional context**
Examples, mockups, related features, etc.
```

## Adding Examples

New example widgets are always welcome!

1. Create a new JSON file in `examples/`
2. Follow the KBM specification
3. Test with the validation script
4. Add description to `examples/README.md`
5. Ensure it's a good learning example

## Documentation

### Updating Docs

- Keep documentation in sync with code
- Use clear, simple language
- Include code examples
- Add diagrams where helpful

### Documentation Files

- `README.md`: Overview and quick start
- `docs/ARCHITECTURE.md`: System design
- `docs/SECURITY.md`: Security guidelines
- `docs/TROUBLESHOOTING.md`: Common issues
- `gpt/KBM_SPEC.md`: KBM specification
- Component READMEs: Specific documentation

## Testing

### Manual Testing

1. Test Worker endpoints with curl:
   ```bash
   curl https://your-worker.workers.dev/
   ```

2. Validate example KBM files:
   ```bash
   node scripts/validate.js examples/simple-clock.json
   ```

3. Test notebooks in Colab

### Future: Automated Tests

We plan to add automated testing. Contributions welcome!

## Code Review

All contributions go through code review. Reviewers will:

- Check code quality and style
- Verify functionality
- Ensure documentation is adequate
- Suggest improvements
- Approve or request changes

## Community Guidelines

- Be respectful and constructive
- Help others when you can
- Give credit where due
- Follow the Code of Conduct
- Ask questions if unclear

## Security Issues

**Do not** report security vulnerabilities publicly.

Instead:
1. Email the security contact (see SECURITY.md)
2. Provide detailed description
3. Allow time for fix before disclosure

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- Open a [GitHub Discussion](https://github.com/CyberBASSLord-666/kwgt-ai-toolchain/discussions)
- Check existing [Issues](https://github.com/CyberBASSLord-666/kwgt-ai-toolchain/issues)
- Read the [Documentation](docs/)

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes (for significant contributions)
- Project documentation (where appropriate)

Thank you for contributing to KWGT AI Toolchain! 🎉
