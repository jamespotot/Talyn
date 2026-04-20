# Talyn Design System

## Visual Design Philosophy

Talyn is a premium academic learning platform that prioritizes **clarity, focus, and trust**. The design system creates a calm, distraction-free environment where users can confidently study knowing their content remains unmodified.

**Design Intent:**
- Modern study tool (Notion + Obsidian + premium edtech)
- Clean, minimal, structured
- Academic professionalism without being sterile
- Subtle interactions that enhance without distracting

---

## Color System

### Base Colors
```
Background:     #F8F8F6  (Soft warm gray)
Surface:        #FFFFFF  (Pure white)
Surface Alt:    #FAFAFA  (Very light gray for inputs)
```

### Text Colors
```
Primary Text:   #1A1A1A  (Near black)
Secondary Text: #6C6C6C  (Muted gray)
Tertiary Text:  #9CA3AF  (Light gray for labels)
```

### Accent Colors
```
Primary Accent: #4F7CFF  (Calm indigo blue)
Hover State:    #3D6AE8  (Darker blue)
Focus Ring:     rgba(79, 124, 255, 0.1)
```

### Semantic Colors
```
Success:        #16A34A  (Modern green)
Success Light:  #F0FDF4
Error:          #DC2626  (Modern red)
Error Light:    #FEF2F2
Warning:        #F59E0B  (Amber)
```

### Borders & Dividers
```
Border:         #E6E6E6  (Very light gray)
Border Hover:   #4F7CFF  (Accent on interaction)
```

### Puro Mode Colors
```
Background:     #EEF5FF  (Soft blue tint)
Text:           #4F7CFF  (Primary accent)
Border:         #D6E4FF  (Light blue)
```

---

## Typography System

### Font Families
```css
Primary:   'Karla', sans-serif
Secondary: 'Inconsolata', monospace
```

**Usage:**
- **Karla**: All UI elements (headings, buttons, labels, navigation)
- **Inconsolata**: Document content, extracted text, code-like displays

### Type Scale
```
H1: 32px / 600 weight / -0.3px letter-spacing
H2: 24px / 600 weight / -0.3px letter-spacing
H3: 20px / 600 weight / -0.2px letter-spacing
Body: 16px / 500 weight
Small: 14px / 500 weight
Tiny: 13px / 600 weight (labels, badges)
```

### Line Height
```
Headings: 1.3
Body Text: 1.6
Reading Content: 1.7-1.8
```

### Font Weights
```
Regular: 400
Medium:  500
Semibold: 600
Bold:    700 (use sparingly)
```

---

## Spacing System

**Base Unit: 8px**

```
4px   (0.5 unit)  - Tight spacing
8px   (1 unit)    - Minimal gap
12px  (1.5 units) - Small gap
16px  (2 units)   - Standard gap
20px  (2.5 units) - Medium gap
24px  (3 units)   - Large gap
32px  (4 units)   - Section spacing
48px  (6 units)   - Major section spacing
56px  (7 units)   - Page top spacing
```

---

## Component Design System

### Buttons

**Primary Button**
```css
Background: #4F7CFF
Color: white
Padding: 14px 32px
Border Radius: 10px
Font: 16px / 600 weight
Shadow: 0 2px 8px rgba(79, 124, 255, 0.2)
Hover: #3D6AE8 + translateY(-1px)
```

**Secondary Button**
```css
Background: white
Border: 1px solid #E6E6E6
Color: #1A1A1A
Padding: 12px 36px
Border Radius: 10px
Font: 16px / 500 weight
Hover: border-color #4F7CFF + translateY(-1px)
```

**Navigation Button**
```css
Background: white
Border: 1px solid #E6E6E6
Padding: 10px 24px
Border Radius: 10px
Font: 15px / 500 weight
Hover: border-color #4F7CFF + slight lift
```

**Active Navigation**
```css
Background: #4F7CFF
Color: white
Shadow: 0 2px 8px rgba(79, 124, 255, 0.2)
Font: 15px / 600 weight
```

### Cards

**Standard Card**
```css
Background: white
Border: 1px solid #E6E6E6
Border Radius: 12px
Padding: 40-56px
Shadow: 0 1px 3px rgba(0, 0, 0, 0.04)
Hover: 0 8px 20px rgba(0, 0, 0, 0.08) + translateY(-3px)
```

**Flashcard**
```css
Min Height: 320px
Padding: 56px
Cursor: pointer
Transition: 0.25s ease
```

**Quiz Card**
```css
Padding: 48px
No hover effect (static)
```

### Input Fields

**Text Input**
```css
Background: #FAFAFA
Border: 1px solid #E6E6E6
Border Radius: 10px
Padding: 16px 18px
Font: 16px
Focus: border #4F7CFF + shadow 0 0 0 3px rgba(79, 124, 255, 0.1)
```

**Textarea**
```css
Background: #FAFAFA
Min Height: 220px
Padding: 18px
Font: 'Inconsolata' 15px
Line Height: 1.7
Focus: Same as text input
```

**File Input**
```css
Background: #FAFAFA
Padding: 14px 16px
Border Radius: 10px
Hover: border #4F7CFF + background white
```

### Badges & Labels

**Puro Mode Badge**
```css
Background: #EEF5FF
Color: #4F7CFF
Border: 1px solid #D6E4FF
Padding: 6px 14px
Border Radius: 8px
Font: 13px / 600 weight
```

**Label (Uppercase)**
```css
Font: 11px / 600 weight
Letter Spacing: 1.2px
Color: #6C6C6C
Text Transform: uppercase
```

### Quiz Options

**Default Option**
```css
Background: #FAFAFA
Border: 1px solid #E6E6E6
Padding: 18px 20px
Border Radius: 10px
Hover: border #4F7CFF + translateX(4px)
```

**Selected Option**
```css
Background: #EEF5FF
Border: 1px solid #4F7CFF
Font Weight: 500
```

**Correct Option**
```css
Background: #F0FDF4
Border: 1px solid #16A34A
Color: #16A34A
```

**Incorrect Option**
```css
Background: #FEF2F2
Border: 1px solid #DC2626
Color: #DC2626
```

---

## Layout Structure

### Grid System
- 12-column grid
- Max content width: 700-800px
- Centered layout for focus

### Header
```
Height: Auto
Padding: 20px 48px
Background: white
Border Bottom: 1px solid #E6E6E6
```

### Navigation Bar
```
Background: #FAFAFA
Padding: 20px 48px
Border Bottom: 1px solid #E6E6E6
Centered button group
```

### Main Content
```
Max Width: 700-800px
Margin: 56px auto
Padding: 0 24px
```

---

## Animation & Transitions

### Timing
```
Fast: 0.2s ease
Standard: 0.25s ease
Slow: 0.3s ease
```

### Effects
```
Button Hover: translateY(-1px)
Card Hover: translateY(-3px)
Option Hover: translateX(4px)
```

### Principles
- Minimal animations only
- Smooth, subtle feedback
- No bouncing or playful effects
- Focus on clarity over entertainment

---

## Responsive Breakpoints

```
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px
```

### Mobile Adjustments
- Header: Vertical stack, reduced padding
- Navigation: Wrap buttons, smaller font
- Cards: Reduced padding (32-40px)
- Logo: Smaller size (36px)

---

## Accessibility

### Focus States
- Visible focus ring using accent color
- 3px shadow with 10% opacity
- Never remove focus indicators

### Color Contrast
- Text on background: WCAG AA compliant
- Interactive elements: Clear hover states
- Success/Error states: Sufficient contrast

### Typography
- Minimum 14px font size
- Line height 1.6+ for readability
- Clear hierarchy with size and weight

---

## Special UI Elements

### Logo Integration
```
Size: 40px (desktop) / 36px (mobile)
Position: Header left, next to title
Format: PNG with transparency
```

### Document Display
```
Font: 'Inconsolata' monospace
Preserve spacing and structure
Subtle highlighting for extracted content
Background: #FAFAFA
```

---

## Design Improvements vs Previous Version

### Color System
- ✅ Updated from #F7F7F5 to #F8F8F6 (warmer tone)
- ✅ Changed accent from #5B7FDB to #4F7CFF (more modern)
- ✅ Improved semantic colors (green/red)

### Typography
- ✅ Increased line heights (1.6-1.8)
- ✅ Better letter spacing on headings
- ✅ Clearer hierarchy with consistent weights

### Components
- ✅ Larger border radius (10-12px vs 6-8px)
- ✅ Better shadows (subtle depth)
- ✅ Improved hover states with transforms
- ✅ Focus rings with colored shadows

### Spacing
- ✅ More generous padding throughout
- ✅ Consistent 8px base scale
- ✅ Better vertical rhythm

### Interactions
- ✅ Smoother transitions (0.25s vs 0.2s)
- ✅ Subtle lift effects on hover
- ✅ Better feedback for user actions

---

## Implementation Notes

### CSS Variables (Future Enhancement)
Consider adding CSS custom properties for easier theming:
```css
:root {
  --color-primary: #4F7CFF;
  --color-text: #1A1A1A;
  --radius-md: 10px;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
}
```

### Dark Mode (Future)
- Maintain same structure
- Invert background/text colors
- Adjust accent brightness
- Preserve readability focus

---

## Design Philosophy Summary

**Talyn's UI must feel:**
- ✅ Calm and focused (not distracting)
- ✅ Academic and structured (not playful)
- ✅ Modern and premium (not basic)
- ✅ Trustworthy and precise (Puro Mode integrity)

**Talyn's UI must NOT feel:**
- ❌ Gamified or entertainment-focused
- ❌ Over-animated or flashy
- ❌ Social media styled
- ❌ Cluttered or busy

The design serves the learning experience—every element supports focus, clarity, and trust in the content preservation principle.
