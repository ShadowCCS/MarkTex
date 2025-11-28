# Background Color Feature for Headings

## Overview
You can now add background colors to text elements like headings in your markdown documents using a simple syntax.

## Syntax
Add `{bg:color}` at the end of any heading to apply a background color:

```markdown
# Heading 1 {bg:#e0f2fe}
## Heading 2 {bg:lightblue}
### Heading 3 {bg:rgb(224, 242, 254)}
```

## Supported Color Formats
- **Hex colors**: `{bg:#e0f2fe}`, `{bg:#ff0000}`
- **Named colors**: `{bg:lightblue}`, `{bg:yellow}`, `{bg:coral}`
- **RGB**: `{bg:rgb(224, 242, 254)}`
- **RGBA**: `{bg:rgba(224, 242, 254, 0.5)}`

## Examples

### Light Blue Background
```markdown
# Physics Report {bg:#e0f2fe}
```

### Yellow Highlight
```markdown
### Important Note {bg:#fef3c7}
```

### Green Background
```markdown
## Conclusion {bg:#dcfce7}
```

## Features
- Automatically adds padding around the text
- Displays as inline-block with rounded corners
- Works with all heading levels (h1-h6)
- The background color is preserved in PDF exports

## Notes
- The `{bg:color}` syntax must be at the end of the heading text
- The syntax will be removed from the displayed text
- Only the heading text will have the background, not the full width
