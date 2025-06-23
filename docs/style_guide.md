# IFC Annotation Web App - Style Guide

## 1. Design System

### 1.1 Color Palette

| Usage | Color | Hex | Opacity |
|-------|-------|------|----------|
| Main Background | Dark Blue-Green | `#0A1F2F` | 70% |
| Component Backgrounds | Darker Teal | `#102c34` | 100% |
| Interactive Elements | Mint Green | `#34D399` | 100% |
| Borders | Mint Green | `#34D399` | 20% |
| Form/Panel Background | Dark Blue-Green | `#0A1F2F` | 100% |
| Text | White | `#FFFFFF` | 100% |

### 1.2 Typography

| Element | Font Family | Size | Weight | Line Height |
|---------|-------------|------|---------|-------------|
| H1 | Inter | 2.5rem | 700 | 1.2 |
| H2 | Inter | 2rem | 600 | 1.25 |
| H3 | Inter | 1.75rem | 600 | 1.3 |
| H4 | Inter | 1.5rem | 600 | 1.35 |
| Body Text | System Font | 1rem | 400 | 1.5 |
| Small Text | System Font | 0.875rem | 400 | 1.5 |
| Code/Monospace | Roboto Mono | 0.9em | 400 | 1.5 |

## 2. UI Components

### 2.1 Buttons

```html
<!-- Primary Button -->
<button class="bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
  Button Text
</button>

<!-- Secondary Button -->
<button class="bg-transparent border border-accent/20 text-white hover:bg-accent/10 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
  Button Text
</button>
```

### 2.2 Forms

```html
<div class="space-y-4">
  <div>
    <label for="username" class="block text-sm font-medium text-white mb-1">
      Username
    </label>
    <input type="text" id="username" class="w-full bg-form-bg border border-accent/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-accent focus:border-transparent" />
  </div>
</div>
```

### 2.3 Cards

```html
<div class="bg-component-bg rounded-xl border border-accent/20 p-6 backdrop-blur-sm">
  <h3 class="text-xl font-semibold text-white mb-2">Card Title</h3>
  <p class="text-gray-300">Card content goes here.</p>
</div>
```

## 3. Layout

### 3.1 Grid System

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Grid Items -->
</div>
```

### 3.2 Spacing

- Base unit: `0.25rem` (4px)
- Use Tailwind's spacing scale (p-4, m-2, etc.)
- Common spacing:
  - Section padding: `py-12 lg:py-16`
  - Component padding: `p-6`
  - Element spacing: `space-y-4` or `gap-4`

## 4. Animations & Transitions

### 4.1 Hover Effects

```css
/* Example of a subtle hover effect */
.hover-effect {
  @apply transition-all duration-200 ease-in-out hover:scale-[1.02];
}
```

### 4.2 Page Transitions

```javascript
// Example of a page transition
function fadeIn(element) {
  element.style.opacity = '0';
  element.style.transition = 'opacity 300ms ease-in';
  setTimeout(() => element.style.opacity = '1', 10);
}
```

## 5. Accessibility

### 5.1 Focus States

```css
/* Custom focus ring that matches our design system */
.focus-ring:focus {
  @apply outline-none ring-2 ring-accent ring-offset-2 ring-offset-bg-dark;
}
```

### 5.2 ARIA Attributes

- Use appropriate ARIA roles and attributes
- Ensure all interactive elements are keyboard navigable
- Include proper labels for screen readers

## 6. IFC Viewer Specific

### 6.1 3D Viewport

```html
<div class="relative w-full h-[600px] bg-bg-dark rounded-lg overflow-hidden">
  <div id="viewer-container" class="absolute inset-0">
    <!-- ThatOpen Engine viewer will be mounted here -->
  </div>
  <!-- Loading overlay -->
  <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
    <div class="text-white">Loading model...</div>
  </div>
</div>
```

### 6.2 Annotation Markers

```css
.annotation-marker {
  @apply w-3 h-3 rounded-full bg-accent border-2 border-white transform -translate-x-1/2 -translate-y-1/2;
  box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.5);
}
```

## 7. Responsive Design

### 7.1 Breakpoints

| Name | Min-width | Usage |
|------|-----------|--------|
| sm | 640px | Mobile |
| md | 768px | Tablet |
| lg | 1024px | Laptop |
| xl | 1280px | Desktop |
| 2xl | 1536px | Large Desktop |

### 7.2 Mobile Navigation

```html
<nav class="fixed bottom-0 left-0 right-0 bg-component-bg border-t border-accent/20 md:hidden">
  <div class="flex justify-around">
    <!-- Navigation items -->
  </div>
</nav>
```

## 8. Dark Mode

Dark mode is the default and only theme for this application. The color palette has been specifically designed for optimal visibility and reduced eye strain during extended use.

## 9. Icons

- Use [Lucide Icons](https://lucide.dev/) for consistent iconography
- Standard size: `w-5 h-5` for inline icons
- Button icons: `w-4 h-4`

## 10. Shadows

```css
/* Example shadow for floating elements */
.shadow-elevation {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
```

## 11. Glass Effect

```css
.glass-effect {
  @apply bg-bg-dark/70 backdrop-blur-md border border-accent/20;
}
```

## 12. Code Style

### 12.1 HTML
- Use semantic HTML5 elements
- Self-close void elements (e.g., `<img />`, `<input />`)
- Use kebab-case for IDs and classes

### 12.2 CSS/Tailwind
- Use Tailwind's utility classes first
- For custom styles, use `@apply` in your CSS
- Organize custom CSS using BEM methodology

### 12.3 JavaScript/TypeScript
- Use ES6+ features
- Prefer const/let over var
- Use arrow functions for callbacks
- Use template literals for string interpolation

## 13. Performance Considerations

- Optimize images and assets
- Lazy load non-critical resources
- Minimize reflows and repaints
- Use `will-change` for elements that will be animated

## 14. Browser Support

- Latest 2 versions of modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile Safari (latest)
- Chrome for Android (latest)

## 15. Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [ThatOpen Engine Docs](https://thatopen.com/)
- [Inter Font](https://rsms.me/inter/)
- [Lucide Icons](https://lucide.dev/)
