# Mobile-First & Responsive Optimization Rule

## Principle
All UI components, layouts, pages, and media assets in this project must be strictly optimized for mobile environments first.

## Guidelines
1. **Responsive Viewport & Layout:**
   - Always test and ensure layouts fit seamlessly on mobile screen widths (320px ~ 430px) up to tablet and desktop screens.
   - Prevent any unwanted horizontal scrolling (`overflow-x: hidden` / flex-wrap / grid scaling).
2. **Aspect Ratio & Media:**
   - All images, cards, and hero sections must use fluid aspect ratios (`aspect-video`, `aspect-square`, `object-cover`, or dynamic flex/grid sizing) to prevent stretched or distorted media on mobile devices.
3. **Touch Targets & Typography:**
   - Interactive elements (buttons, links, inputs) must maintain comfortable touch targets (at least 40px~48px height) on mobile.
   - Text sizes must scale legibly using relative units (`text-sm`, `text-base`, `text-xs`, `clamp(...)`).
