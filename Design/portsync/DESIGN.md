---
name: PortSync
colors:
  surface: '#f7f9fc'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#44474c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#74777d'
  outline-variant: '#c4c6cd'
  surface-tint: '#4e6077'
  primary: '#00050e'
  on-primary: '#ffffff'
  primary-container: '#0b1f33'
  on-primary-container: '#7587a0'
  inverse-primary: '#b5c8e3'
  secondary: '#0040df'
  on-secondary: '#ffffff'
  secondary-container: '#2d5bff'
  on-secondary-container: '#efefff'
  tertiary: '#000602'
  on-tertiary: '#ffffff'
  tertiary-container: '#00240e'
  on-tertiary-container: '#009a50'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#b5c8e3'
  on-primary-fixed: '#081d30'
  on-primary-fixed-variant: '#36485e'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b8c3ff'
  on-secondary-fixed: '#001355'
  on-secondary-fixed-variant: '#0035bd'
  tertiary-fixed: '#7efba4'
  tertiary-fixed-dim: '#61de8a'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#005228'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  data-tabular:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system is engineered for high-stakes enterprise resource planning and logistics management. It prioritizes operational clarity, data density, and a sense of absolute reliability. The brand personality is authoritative yet frictionless, positioning the interface as a high-performance command center rather than a marketing platform.

The design style is **Corporate / Modern** with a focus on functional precision. It utilizes a refined layer-based architecture where information is organized through clear containment and subtle depth. By balancing high-density data tables with generous white space in navigation and headers, the system ensures that users can manage complex workflows without cognitive overload. The aesthetic is clinical, polished, and focused entirely on utility and trust.

## Colors
The palette is anchored by **Deep Navy (#0B1F33)**, providing a solid, institutional foundation for navigation and headers. **Port Blue (#2D5BFF)** serves as the primary action color, directing focus toward interactive elements and primary call-to-actions. 

Operational status is communicated through a disciplined semantic set: **Success Green (#27AE60)**, **Warning Orange (#F5A623)**, and **Danger Red (#E74C3C)**. The background uses a cool-toned **Neutral Grey (#F7F9FC)** to reduce eye strain during long working sessions, while pure white is reserved strictly for content cards and data surfaces to create a clear "layer 1" for work.

## Typography
This design system utilizes **Inter** for its exceptional legibility in data-heavy environments. The scale is optimized for high-density information display, favoring smaller base sizes with generous line heights to maintain scanability.

A specific **Data Tabular** style is defined for spreadsheets and analytics, utilizing tabular figures to ensure numerical alignment across rows. Headlines are tight and bold to provide immediate structural hierarchy. For mobile views, display sizes scale down by 15% to maintain proportions, while body text remains at 16px to ensure accessibility.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure on desktop. To support complex ERP workflows, the system utilizes a "Side-Rail Navigation" layout, where the primary navigation is docked to the left, maximizing vertical space for long data tables and dashboards.

- **Desktop (1440px+):** 12 columns, 20px gutters, 32px outer margins.
- **Tablet (768px - 1439px):** 8 columns, 16px gutters, 24px outer margins.
- **Mobile (Up to 767px):** 4 columns, 12px gutters, 16px outer margins. Navigation collapses into a bottom bar or hamburger menu.

Spacing follows a 4px base unit. Internal card padding should be 24px (lg) for general content and 16px (md) for high-density data modules.

## Elevation & Depth
Depth is used as a functional tool to separate global navigation from the workspace. This design system employs **Tonal Layers** combined with **Ambient Shadows**.

- **Level 0 (Background):** Neutral Grey (#F7F9FC).
- **Level 1 (Cards/Work Area):** Pure White (#FFFFFF) with a 1px border (#E2E8F0) and a soft, diffused shadow (0px 4px 12px rgba(0,0,0,0.05)).
- **Level 2 (Modals/Popovers):** Pure White with a deeper shadow (0px 12px 24px rgba(0,0,0,0.1)) to indicate focus and temporary interaction.

Hover states on interactive cards should subtly lift the element by increasing shadow spread and shifting the border color to the Secondary Blue.

## Shapes
The shape language is professional and modern, using a consistent **12px (0.75rem)** corner radius for all primary containers and cards. This softens the industrial nature of the data without appearing overly consumer-oriented.

Small interactive components like buttons and input fields utilize an **8px** radius for a crisper, more precise appearance within the larger 12px containers. Status indicators (badges) use a fully rounded "pill" shape to distinguish them from actionable buttons.

## Components
- **Buttons:** Primary buttons use a solid #2D5BFF fill with white text. Secondary buttons use a #0B1F33 outline. All buttons have an 8px radius and a subtle 1px bottom-border shadow for a "tactile" feel.
- **Input Fields:** 1px #CBD5E1 border, 8px radius. On focus, the border transitions to #2D5BFF with a 3px soft blue glow. Labels are positioned above the field in **Label-MD** style.
- **Data Tables:** The core of the ERP. Rows have a 48px minimum height. Zebra striping is used for long tables. Headers are sticky with a #F1F5F9 background.
- **Status Chips:** Small, pill-shaped indicators. Use a 10% opacity background of the semantic color (e.g., 10% Green) with 100% opacity text for high legibility.
- **Cards:** Used to group related data. Must include a 1px #E2E8F0 border and 12px rounded corners.
- **Navigation Rail:** 72px width (collapsed) or 240px (expanded). Background #0B1F33 with active states highlighted by a 4px vertical blue line on the left edge.