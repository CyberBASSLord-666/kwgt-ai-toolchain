# KWGT AI Toolchain Examples

This directory contains example KBM JSON files that can be used with the Worker API.

## Files

### simple-clock.json
A basic clock widget showing time and date.

**Features:**
- Large time display (HH:mm format)
- Date display below time
- Global variable for accent color
- Dark background

**Usage:**

```bash
# Validate
curl -X POST https://your-worker.workers.dev/validate \
  -H "Content-Type: application/json" \
  -d @simple-clock.json

# Build
curl -X POST https://your-worker.workers.dev/build-kwgt \
  -H "Content-Type: application/json" \
  -d '{"kbm":'"$(cat simple-clock.json)"',"filename":"simple-clock.kwgt"}' \
  --output simple-clock.kwgt
```

Or using the validation script:

```bash
node ../scripts/validate.js simple-clock.json
```

## Creating Your Own Examples

1. Follow the KBM specification in `../gpt/KBM_SPEC.md`
2. Use proper structure with root_layer, globals, and items
3. Ensure colors are in #AARRGGBB format
4. Wrap formulas with $ delimiters
5. Test with the Worker API or validation script

## More Examples

For more examples and templates, check out:
- KWGT official community: https://kustom.rocks
- Reddit: r/kustom
- XDA Forums: KWGT section
