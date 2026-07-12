---
name: Maritime Enterprise Excellence
colors:
  surface: '#f7f9ff'
  surface-dim: '#d3dbe5'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf4ff'
  surface-container: '#e7eff9'
  surface-container-high: '#e1e9f4'
  surface-container-highest: '#dbe3ee'
  on-surface: '#141c24'
  on-surface-variant: '#44474e'
  inverse-surface: '#293139'
  inverse-on-surface: '#eaf1fc'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f88'
  primary: '#000a1e'
  on-primary: '#ffffff'
  primary-container: '#002147'
  on-primary-container: '#708ab5'
  inverse-primary: '#aec7f6'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#000d0d'
  on-tertiary: '#ffffff'
  tertiary-container: '#002626'
  on-tertiary-container: '#2f9696'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f6'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#93f2f2'
  tertiary-fixed-dim: '#76d6d5'
  on-tertiary-fixed: '#002020'
  on-tertiary-fixed-variant: '#004f4f'
  background: '#f7f9ff'
  on-background: '#141c24'
  surface-variant: '#dbe3ee'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style

The design system is engineered for the Vadhavan Port Development Management System, prioritizing **authority, precision, and institutional trust**. The brand personality is rooted in large-scale infrastructure and maritime engineering, requiring a UI that feels stable and dependable.

The aesthetic follows a **refined Corporate Modern** approach. It rejects transient design trends in favor of high information density, structural clarity, and functional efficiency. The interface utilizes a rigorous grid, subtle tonal layering, and purposeful whitespace to ensure that complex engineering data remains legible and actionable for government stakeholders and project managers.

## Colors

The palette is anchored by **Deep Navy Blue**, evoking the heritage and stability of maritime institutions. **Maritime Teal** is used sparingly as an accent for primary actions and interactive states to provide a modern, engineering-focused contrast.

The system relies heavily on a structured scale of greys to manage information hierarchy:
- **Primary Navy:** Used for headers, primary navigation, and core branding elements.
- **Maritime Teal:** Reserved for calls to action, active selection states, and progress indicators.
- **Surface Palette:** A clean white canvas supported by light grey backgrounds to differentiate between content modules and the global workspace.
- **Status Colors:** Standardized semantic colors for high-visibility alerts, safety indicators, and project health status.

## Typography

This design system utilizes **Public Sans**, a typeface designed for government and institutional clarity. Its neutral, robust proportions ensure excellent readability in data-heavy environments, such as project schedules and logistics tables.

- **Headlines:** Use Bold and Semi-Bold weights in Deep Navy Blue to establish a clear structural hierarchy.
- **Body Text:** Primarily set in 14px (md) for high density, with 16px (lg) reserved for long-form reports or documentation.
- **Data Labels:** Small, all-caps labels with increased letter-spacing are used for table headers and metadata categories to distinguish them from dynamic content.
- **Numerical Data:** Tabular figures should be enabled where possible to ensure alignment in financial and engineering data tables.

## Layout & Spacing

The layout is built on a **12-column fixed-width grid** for desktop, centering the content at 1440px to maintain focus. A 4px baseline shift ensures all components—from input fields to data rows—are vertically aligned for a disciplined, industrial appearance.

- **Desktop:** 24px margins and 24px gutters.
- **Tablet:** 8-column fluid grid with 16px gutters.
- **Mobile:** 4-column fluid grid with 16px margins.
- **Density:** The system supports a "Compact" mode for data-intensive views (e.g., procurement lists) where vertical padding is reduced from `md` (16px) to `sm` (8px).

## Elevation & Depth

To maintain a professional and "flat" institutional aesthetic, depth is conveyed through **Low-contrast outlines** and **Tonal layering** rather than heavy shadows.

- **Base Level:** Background Canvas (#F5F7FA).
- **Surface Level:** Content cards and containers use a Pure White (#FFFFFF) background with a 1px solid border (#E4E7EB).
- **Raised Level:** Used for active dropdowns or modals. These utilize a very soft, subtle ambient shadow (0px 4px 12px, 5% opacity Navy) to provide separation without breaking the clean, industrial feel.
- **Interactive States:** Hover states on cards use a slightly darker border (#9AA2AC) rather than a shadow lift.

## Shapes

The shape language is **Soft (0.25rem)**, providing a subtle professional touch that prevents the UI from feeling overly aggressive or dated. This slight rounding maintains the "structural" feel appropriate for an engineering firm while ensuring the software feels modern.

- **Standard Buttons & Inputs:** 4px radius.
- **Content Cards:** 8px radius (`rounded-lg`) for clear containment.
- **Status Badges:** Fully rounded (pill) for immediate visual distinction from square data cells.

## Components

### Buttons
- **Primary:** Deep Navy Blue background with White text. High-contrast, no gradient.
- **Secondary:** White background with 1px Navy border and Navy text.
- **Accent/Action:** Maritime Teal background for specific "Success" actions like "Approve" or "Submit".

### Data Tables
Tables are the heart of this system. They must use `body-sm` for content and `label-md` for headers. Headers use a light grey background (#F5F7FA) and a bottom border of 2px Navy to anchor the data. Zebra striping is permitted for extremely wide datasets.

### Cards
Cards are used to group project metrics. They feature a 1px border (#E4E7EB), no shadow, and a 24px internal padding. Card titles should always be in `title-lg`.

### Input Fields
Fields use a 1px border (#E4E7EB) that transitions to Maritime Teal on focus. Labels must be persistent (not floating) and set in `label-md` for clarity in complex forms.

### Chips & Badges
Small, low-profile badges with light background tints of the status colors (e.g., Light Green background with Dark Green text) are used for "Project Phase" or "Priority" indicators.

### Icons
Use stroke-based industrial icons (2px weight) that match the Deep Navy color. Avoid playful or rounded icon sets; prefer sharp, technical iconography.