# FESTUM STYLES ARCHITECTURE

## 📁 Folder Structure

```
src/
├── styles.scss                    # Main entry point (imports all partials)
└── styles/
    ├── _variables.scss            # Design tokens (colors, spacing, typography)
    ├── _mixins.scss               # Reusable SCSS mixins
    ├── _reset.scss                # CSS reset and base styles
    ├── _typography.scss           # Typography system and text utilities
    ├── _utilities.scss            # Single-purpose utility classes
    ├── _layout.scss               # Page layout and responsive helpers
    ├── _components.scss           # Shared component patterns
    ├── _animations.scss           # CSS animations and keyframes
    └── _material-overrides.scss   # Angular Material customizations
```

## 🎨 Design System

### Variables (_variables.scss)
Contains all design tokens organized by category:
- **Colors**: Primary, secondary, semantic (success, error, warning, info)
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent spacing scale (xs to 3xl)
- **Shadows**: Shadow utilities (sm, md, lg, xl)
- **Border Radius**: Consistent border radius values
- **Transitions**: Timing functions and durations
- **Z-index Scale**: Layering system for overlays, modals, tooltips

### Mixins (_mixins.scss)
Reusable SCSS mixins for:
- Responsive breakpoints (mobile, tablet, desktop)
- Flexbox utilities (center, between, column-center)
- Text truncation and line clamping
- Positioning helpers (absolute-center, absolute-full)
- Custom scrollbar styling
- Button and card patterns
- Overlay patterns

### Reset (_reset.scss)
Modern CSS reset including:
- Box-sizing normalization
- HTML/Body defaults
- Heading, paragraph, and list resets
- Link styling
- Button and input normalization
- Image responsive defaults
- Custom scrollbar styling

### Typography (_typography.scss)
Comprehensive typography system:
- **Heading styles**: h1-h6 with semantic classes
- **Body text**: Responsive rem-based sizing
- **Utility classes**:
  - Titles (xl, lg, md, sm)
  - Subtitles (lg, md, sm)
  - Body text (lg, md, sm)
  - Caption and label
- **Font weight utilities**: normal, medium, semibold, bold
- **Text alignment**: left, center, right
- **Text colors**: primary, secondary, muted, white

### Utilities (_utilities.scss)
Single-purpose classes for rapid development:
- **Spacing**: Margin and padding (mt-1 to mt-4, mb-1 to mb-4, etc.)
- **Display**: flex, inline-flex, block, none
- **Flexbox**: direction, wrap, align, justify, gap
- **Sizing**: w-100, h-100, full-width
- **Borders**: rounded variants
- **Shadows**: shadow-sm, shadow-md, shadow-lg

### Layout (_layout.scss)
Page structure and responsive patterns:
- **Page Container**: Main page wrapper with consistent padding
- **Page Header**: Title sections with icons and action buttons
- **Form Layout**: Section headers, rows, and action footers
- **Responsive**: Mobile-first breakpoints (480px, 768px)

### Components (_components.scss)
Reusable component patterns following BEM methodology:
- **Buttons**: Primary, secondary, outlined, icon variants
- **Cards**: Base card with elevated and bordered modifiers
- **Badges & Chips**: ID badges, status chips with color variants
- **Tables**: Toolbar, container, data table with responsive design
- **Loading States**: Fixed and absolute overlays
- **Empty States**: Centered message with icon
- **Icon-Text Patterns**: Flex combinations with consistent spacing
- **Dividers**: Horizontal rules with variants

### Animations (_animations.scss)
CSS animations and keyframes:
- **Keyframes**: fadeIn, slideInUp, slideInDialog, spin, pulse
- **Utility classes**: animate-fade-in, animate-slide-up, animate-spin, etc.

### Material Overrides (_material-overrides.scss)
Angular Material component customizations:
- Buttons (hover effects, transforms)
- Cards (border radius, shadows)
- Form fields (focus colors)
- Chips (color variants)
- Tabs (typography)
- Paginator (colors, hover states)
- Tables (colors, hover effects)
- Dialogs (border radius)
- Snackbars (semantic color variants)
- Drawer (overflow fixes)

## 🚀 Usage

### Importing in Components

For component-specific styles, you can import individual partials:

```scss
// In your component.scss
@import 'styles/variables';
@import 'styles/mixins';

.my-component {
  color: var(--color-primary);
  padding: var(--spacing-xl);

  @include flex-center;

  @include tablet {
    padding: var(--spacing-md);
  }
}
```

### Using Utility Classes

Apply utility classes directly in templates:

```html
<div class="d-flex align-center gap-3 mb-3">
  <button class="btn-primary">Save</button>
  <button class="btn-outlined">Cancel</button>
</div>

<h2 class="text-title-lg font-weight-bold text-primary">Title</h2>
<p class="text-body-md text-secondary">Description text</p>
```

### Using CSS Variables

Access design tokens anywhere:

```scss
.custom-element {
  background: var(--bg-surface);
  color: var(--text-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}
```

## 🎯 Best Practices

1. **Use CSS variables** for colors, spacing, and other design tokens
2. **Prefer utility classes** for simple styling needs
3. **Use mixins** for complex, reusable patterns
4. **Follow BEM methodology** for component classes
5. **Use rem units** for typography and spacing when possible
6. **Mobile-first approach** - use min-width media queries
7. **Keep partials focused** - each file should have a single responsibility
8. **Avoid nesting** beyond 3 levels in SCSS
9. **Use semantic class names** that describe purpose, not appearance

## 🔧 Maintenance

### Adding New Variables
Edit `_variables.scss` and add to the appropriate section. Use consistent naming:
- Colors: `--color-{name}` or `--color-{semantic}-{variant}`
- Spacing: `--spacing-{size}`
- Typography: `--font-{property}-{value}`

### Creating New Mixins
Add to `_mixins.scss` with clear documentation:
```scss
// Description of what the mixin does
@mixin mixin-name($param: default) {
  // Implementation
}
```

### Adding Component Patterns
Add to `_components.scss` following BEM:
```scss
.component-name {
  // Base styles

  &__element {
    // Element styles
  }

  &--modifier {
    // Modifier styles
  }
}
```

## 📊 Benefits of This Architecture

1. **Modularity**: Each file has a single responsibility
2. **Maintainability**: Easy to find and update specific styles
3. **Scalability**: Simple to add new patterns and utilities
4. **Performance**: Import only what you need in components
5. **Consistency**: Design tokens ensure visual consistency
6. **DX**: Clear naming and organization improves developer experience
7. **Reusability**: Mixins and utilities reduce code duplication
8. **Accessibility**: Rem-based typography respects user preferences

## 🔄 Migration Notes

The original monolithic `styles.scss` has been split into this modular structure. A backup is available at `styles.scss.backup`.

All existing styles have been preserved and reorganized. No visual changes should occur - this is purely an architectural improvement.

## 📚 Further Reading

- [BEM Methodology](http://getbem.com/)
- [SCSS/Sass Documentation](https://sass-lang.com/documentation)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Angular Material Theming](https://material.angular.io/guide/theming)
