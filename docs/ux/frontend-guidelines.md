# Frontend Guidelines

## Design direction

The interface should feel dark, premium, precise, and fast.
It must stay readable on mobile and desktop, with subtle motion and controlled accents.

## Color tokens

- Background: `#0B1020`
- Surface 1: `#12182B`
- Surface 2: `#1A2238`
- Primary text: `#F5F7FB`
- Secondary text: `#A9B1C7`
- Primary accent: `#4DA3FF`
- Secondary accent: `#7C5CFF`
- Success: `#22C55E`
- Error: `#EF4444`
- Warning: `#F59E0B`
- Premium: `#E6C15A`

## Typography

- Default font: `Inter`
- H1: `28px` to `36px` on desktop, `24px` to `28px` on mobile
- H2: `20px` to `24px`
- H3: `16px` to `18px`
- Body: `14px` to `16px`
- Small text: `12px` to `13px`

## Spacing and layout

- Use a spacing scale based on `4`, `8`, `12`, `16`, `20`, `24`, and `32`
- Keep mobile layouts vertical and compact
- Use a `1200px` to `1280px` container on desktop
- Prefer clear section boundaries over decorative noise

## Components

### Buttons

- Primary: main CTA, validation, and key actions
- Secondary: alternative actions and supporting controls
- Ghost: subtle navigation and low-priority actions

Required states: normal, hover, pressed, disabled, loading.

### Cards

- Use for stats, lessons, recommendations, results, and premium blocks
- Keep corners soft, shadows light, and padding generous

### Inputs

- Labels must stay visible
- Errors must be explicit
- Focus states must be visible and accessible
- Do not rely on placeholder text as the only cue

### Progress bars

- Use for quiz progress, theme progress, overall progress, and premium goals
- Keep animations subtle and readable

## Navigation

- Mobile: bottom navigation with 5 items
- Desktop: left sidebar plus top bar
- Make the quiz entry point the most visible action

## Accessibility

- Maintain strong contrast
- Preserve keyboard focus visibility
- Never encode meaning by color alone
- Keep touch targets comfortable on mobile

## Implementation rules

- Reuse the same tokens, components, spacing, and navigation patterns everywhere
- Keep feedback immediate and predictable
- Prefer clarity over visual complexity
