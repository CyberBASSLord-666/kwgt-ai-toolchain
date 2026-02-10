# KBM (Kustom Binary Module) Specification

## Overview

KBM is the JSON format used by KWGT (Kustom Widget Maker) to define widget structures. A KBM file contains the complete definition of a widget including layout, styling, formulas, and global variables.

## Structure

### Root Object

```json
{
  "root_layer": { ... },
  "globals": [ ... ],
  "items": [ ... ]
}
```

### Root Layer

The `root_layer` is the top-level container that defines the widget's base properties.

**Required Fields:**
- `internal_type`: Must be `"LayerModule"` for root layer
- `layer_width`: Widget width in pixels (default: 1080)
- `layer_height`: Widget height in pixels (default: 1920)

**Common Optional Fields:**
- `layer_name`: Display name for the module
- `layer_background_color`: Background color (#AARRGGBB format)
- `layer_locked`: Boolean, whether layer is locked
- `layer_visible`: Boolean, whether layer is visible

**Example:**
```json
{
  "internal_type": "LayerModule",
  "layer_width": 1080,
  "layer_height": 500,
  "layer_name": "My Widget",
  "layer_background_color": "#00FFFFFF"
}
```

### Globals Array

Global variables that can be referenced throughout the widget using formulas.

**Structure:**
```json
{
  "globals": [
    {
      "internal_type": "GlobalVariable",
      "gv_name": "variable_name",
      "gv_value": "value or formula"
    }
  ]
}
```

**Example:**
```json
{
  "globals": [
    {
      "internal_type": "GlobalVariable",
      "gv_name": "accent_color",
      "gv_value": "#FF4CAF50"
    },
    {
      "internal_type": "GlobalVariable",
      "gv_name": "battery_level",
      "gv_value": "$bi(level)$"
    }
  ]
}
```

### Items Array

Array of layer items (child layers) within the root module.

**Common Layer Types:**

#### TextModule
Displays text content.

```json
{
  "internal_type": "TextModule",
  "layer_name": "Time Display",
  "position_anchor": "CENTER",
  "position_x": 540,
  "position_y": 960,
  "text_text": "$df(HH:mm)$",
  "text_size": 72,
  "text_color": "#FFFFFFFF",
  "text_font": "default"
}
```

**Key Fields:**
- `text_text`: Text content or formula
- `text_size`: Font size in sp
- `text_color`: Text color (#AARRGGBB)
- `text_font`: Font name or "default"
- `text_typeface`: Font style (NORMAL, BOLD, ITALIC, BOLD_ITALIC)

#### ShapeModule
Draws geometric shapes.

```json
{
  "internal_type": "ShapeModule",
  "layer_name": "Background",
  "position_anchor": "CENTER",
  "position_x": 540,
  "position_y": 960,
  "shape_width": 400,
  "shape_height": 200,
  "shape_type": "RECTANGLE",
  "shape_fill_color": "#FF2196F3",
  "shape_stroke_width": 0,
  "shape_corner_radius": 20
}
```

**Shape Types:**
- `RECTANGLE`: Rectangle or rounded rectangle
- `CIRCLE`: Circle or oval
- `ARC`: Arc or pie slice
- `LINE`: Straight line
- `POLYGON`: Custom polygon

#### BitmapModule
Displays images.

```json
{
  "internal_type": "BitmapModule",
  "layer_name": "Icon",
  "position_anchor": "CENTER",
  "position_x": 540,
  "position_y": 500,
  "bitmap_width": 100,
  "bitmap_height": 100,
  "bitmap_path": "image.png",
  "bitmap_tint": "#FFFFFFFF"
}
```

#### OverlapModule
Groups multiple layers together.

```json
{
  "internal_type": "OverlapModule",
  "layer_name": "Widget Group",
  "position_anchor": "TOP_LEFT",
  "position_x": 0,
  "position_y": 0,
  "items": [
    { "internal_type": "ShapeModule", ... },
    { "internal_type": "TextModule", ... }
  ]
}
```

#### ProgressModule
Shows progress bars.

```json
{
  "internal_type": "ProgressModule",
  "layer_name": "Battery",
  "position_anchor": "CENTER",
  "position_x": 540,
  "position_y": 960,
  "progress_width": 300,
  "progress_height": 20,
  "progress_value": "$bi(level)$",
  "progress_max": 100,
  "progress_color": "#FF4CAF50",
  "progress_background_color": "#33FFFFFF"
}
```

## Common Properties

### Position Anchors
- `TOP_LEFT`, `TOP_CENTER`, `TOP_RIGHT`
- `CENTER_LEFT`, `CENTER`, `CENTER_RIGHT`
- `BOTTOM_LEFT`, `BOTTOM_CENTER`, `BOTTOM_RIGHT`

### Position
- `position_x`: X coordinate in pixels
- `position_y`: Y coordinate in pixels
- `position_anchor`: Reference point for positioning

### Size
- `layer_width`, `layer_height`: Layer dimensions
- `shape_width`, `shape_height`: Shape dimensions
- `bitmap_width`, `bitmap_height`: Image dimensions
- `text_size`: Font size

### Visibility & Interaction
- `layer_visible`: Boolean (true/false)
- `layer_locked`: Boolean
- `layer_opacity`: 0-100
- `animation`: Animation definitions

## Color Format

Colors use 8-digit hexadecimal format: `#AARRGGBB`
- `AA`: Alpha (transparency) - 00=transparent, FF=opaque
- `RR`: Red (00-FF)
- `GG`: Green (00-FF)
- `BB`: Blue (00-FF)

**Examples:**
- `#FFFFFFFF`: Opaque white
- `#FF000000`: Opaque black
- `#80FF0000`: 50% transparent red
- `#00FFFFFF`: Fully transparent white

## Formulas

Formulas are wrapped in `$` delimiters and can contain:

### Date/Time Functions
- `$df(pattern)$`: Date format
  - `df(HH:mm)`: 24-hour time (14:30)
  - `df(hh:mm a)`: 12-hour time (02:30 PM)
  - `df(EEEE)`: Day name (Monday)
  - `df(MMMM dd)`: Month and day (January 15)

### System Functions
- `$bi(field)$`: Battery info
  - `bi(level)`: Battery percentage (0-100)
  - `bi(charging)`: Charging state (0 or 1)
- `$si(field)$`: System info
  - `si(wifi)`: WiFi enabled (0 or 1)
  - `si(bluetooth)`: Bluetooth enabled (0 or 1)
- `$mi(field)$`: Music info
  - `mi(title)`: Current track title
  - `mi(artist)`: Current artist
  - `mi(state)`: Playing state

### Weather Functions
- `$wg(index, field)$`: Weather info
  - `wg(0, temperature)`: Current temperature
  - `wg(0, condition)`: Current condition
  - `wg(1, temperature)`: Tomorrow's temperature

### Conditional Functions
- `$if(condition, true_value, false_value)$`
- Example: `$if(df(H)>=18, "Evening", "Day")$`

### Math Functions
- `$tc(min, max, value)$`: Clamp value between min and max
- `$tc(abs, value)$`: Absolute value
- `$tc(sin, value)$`: Sine function
- `$tc(cos, value)$`: Cosine function

### Global Variables
- `$gv(variable_name)$`: Reference global variable

### Text Functions
- `$tu(upper, text)$`: Uppercase
- `$tu(lower, text)$`: Lowercase
- `$tu(len, text)$`: String length

## Best Practices

### 1. Structure
- Always include `root_layer`, `globals`, and `items`
- Set `root_layer.internal_type` to "LayerModule"
- Use meaningful `layer_name` values

### 2. Colors
- Always use 8-digit format (#AARRGGBB)
- Consider alpha channel for transparency
- Store common colors as globals

### 3. Formulas
- Wrap all formulas with $ delimiters
- Test formulas for edge cases
- Use globals for complex calculations

### 4. Performance
- Minimize nested OverlapModules
- Avoid excessive formula complexity
- Reuse globals instead of duplicating formulas

### 5. Organization
- Group related layers in OverlapModules
- Use consistent naming conventions
- Lock background layers to prevent accidental edits

## Validation Rules

The KWGT AI Worker validates and repairs KBM according to these rules:

1. **Root Layer**: Must have `internal_type: "LayerModule"`
2. **Colors**: Converts #RRGGBB to #FFRRGGBB
3. **Arrays**: Ensures `globals` and `items` are arrays
4. **Formulas**: Wraps unwrapped formulas with $ delimiters
5. **Structure**: Ensures required fields exist

## File Structure

A .kwgt file is a ZIP archive containing:
```
widget.kwgt
├── preset.json    (the KBM JSON)
├── fonts/         (optional font files)
│   └── custom.ttf
└── bitmaps/       (optional image files)
    └── icon.png
```

## References

- KWGT Official Website: https://kustom.rocks
- KWGT Documentation: https://help.kustom.rocks
- Formula Documentation: https://help.kustom.rocks/i402-formula
