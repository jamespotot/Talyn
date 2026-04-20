# Talyn Design System - Quick Reference

## 🎨 Color Palette

| Purpose | Hex Code | Usage |
|---------|----------|-------|
| Background | `#F8F8F6` | Page background |
| Surface | `#FFFFFF` | Cards, modals |
| Surface Alt | `#FAFAFA` | Input backgrounds |
| Primary Text | `#1A1A1A` | Main content |
| Secondary Text | `#6C6C6C` | Labels, descriptions |
| Primary Accent | `#4F7CFF` | Buttons, links, focus |
| Accent Hover | `#3D6AE8` | Button hover states |
| Border | `#E6E6E6` | Dividers, card borders |
| Success | `#16A34A` | Correct answers |
| Error | `#DC2626` | Incorrect answers |

---

## 📝 Typography

```css
/* Headings */
h1 { font-size: 32px; font-weight: 600; }
h2 { font-size: 24px; font-weight: 600; }
h3 { font-size: 20px; font-weight: 600; }

/* Body */
body { font-size: 16px; line-height: 1.6; }

/* Fonts */
font-family: 'Karla', sans-serif;           /* UI elements */
font-family: 'Inconsolata', monospace;      /* Content display */
```

---

## 📏 Spacing Scale

```
4px   8px   12px   16px   20px   24px   32px   48px   56px
```

---

## 🔘 Button Styles

### Primary Button
```css
background: #4F7CFF;
color: white;
padding: 14px 32px;
border-radius: 10px;
font-weight: 600;
box-shadow: 0 2px 8px rgba(79, 124, 255, 0.2);
```

### Secondary Button
```css
background: white;
border: 1px solid #E6E6E6;
padding: 12px 36px;
border-radius: 10px;
font-weight: 500;
```

---

## 📦 Card Styles

```css
background: white;
border: 1px solid #E6E6E6;
border-radius: 12px;
padding: 48px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
```

**Hover Effect:**
```css
transform: translateY(-3px);
box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
```

---

## 🎯 Input Fields

```css
background: #FAFAFA;
border: 1px solid #E6E6E6;
border-radius: 10px;
padding: 16px 18px;
```

**Focus State:**
```css
border-color: #4F7CFF;
background: white;
box-shadow: 0 0 0 3px rgba(79, 124, 255, 0.1);
```

---

## ⚡ Transitions

```css
transition: all 0.25s ease;
```

**Common Transforms:**
- Buttons: `translateY(-1px)`
- Cards: `translateY(-3px)`
- Options: `translateX(4px)`

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

---

## 🎭 Component Patterns

### Puro Mode Badge
```css
background: #EEF5FF;
color: #4F7CFF;
border: 1px solid #D6E4FF;
padding: 6px 14px;
border-radius: 8px;
font-size: 13px;
font-weight: 600;
```

### Quiz Option States
```css
/* Default */
background: #FAFAFA;
border: 1px solid #E6E6E6;

/* Selected */
background: #EEF5FF;
border-color: #4F7CFF;

/* Correct */
background: #F0FDF4;
border-color: #16A34A;

/* Incorrect */
background: #FEF2F2;
border-color: #DC2626;
```

---

## ✅ Design Checklist

When creating new components:

- [ ] Use Karla font for UI elements
- [ ] Use Inconsolata for content display
- [ ] Apply 10-12px border radius
- [ ] Add subtle shadows (0 1px 3px rgba(0,0,0,0.04))
- [ ] Include hover states with transforms
- [ ] Add focus states with colored shadow
- [ ] Use 0.25s ease transitions
- [ ] Maintain 8px spacing scale
- [ ] Ensure WCAG AA contrast
- [ ] Test on mobile (< 768px)

---

## 🚀 Quick Start

1. Import fonts in `globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;500;600;700&family=Inconsolata:wght@400;500;600&display=swap');
```

2. Set base styles:
```css
body {
  font-family: 'Karla', sans-serif;
  background-color: #F8F8F6;
  color: #1A1A1A;
  line-height: 1.6;
}
```

3. Use CSS Modules for components
4. Follow spacing scale (8px base)
5. Apply consistent border radius (10-12px)

---

## 📚 Full Documentation

See `DESIGN_SYSTEM.md` for complete specifications, philosophy, and implementation guidelines.
