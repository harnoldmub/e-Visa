# e-Visa Platform Design Guidelines

## Design Approach
**Governmental Digital Service Design** - Drawing inspiration from modern government platforms like GOV.UK and Estonia's e-Residency while maintaining professional authority and accessibility. Focus on clarity, trust, and efficiency over visual flair.

## Core Design Principles
1. **Trust & Authority**: Professional, secure appearance befitting official government service
2. **Clarity First**: Remove ambiguity at every step of visa application process
3. **Progressive Disclosure**: Show only what's needed at each step
4. **Accessibility**: WCAG 2.1 AA compliance for all users

---

## Typography Hierarchy

**Headings:**
- H1: Inter Bold, 2.5rem (40px) - Page titles, hero statements
- H2: Inter SemiBold, 2rem (32px) - Section headers
- H3: Inter SemiBold, 1.5rem (24px) - Card titles, subsections
- H4: Inter Medium, 1.25rem (20px) - Form section titles

**Body Text:**
- Large: Inter Regular, 1.125rem (18px) - Important instructions, CTAs
- Base: Inter Regular, 1rem (16px) - Standard content, form labels
- Small: Inter Regular, 0.875rem (14px) - Helper text, captions
- Micro: Inter Regular, 0.75rem (12px) - Footnotes, legal text

**Line Heights:** 1.5 for body text, 1.2 for headings

---

## Layout & Spacing System

**Tailwind Units:** Consistently use `2, 4, 6, 8, 12, 16, 20, 24` for spacing
- `p-4, p-6`: Compact elements (cards, buttons)
- `p-8, p-12`: Standard sections, containers
- `p-16, p-20, p-24`: Major page sections

**Container Widths:**
- Forms/Applications: `max-w-3xl` (centered)
- Dashboard lists: `max-w-7xl`
- Content pages: `max-w-4xl`

**Grid:** 8px base grid for all measurements

---

## Component Library

### Navigation
**Header:** Fixed top navigation with logo (left), language toggle, user menu (right). Height: `h-16`. Background: white with subtle shadow.

**Admin Sidebar:** Fixed left sidebar (280px) with sections: Dashboard, Applications, Verifications, Reports, Settings. Collapsible on mobile.

### Forms
**Multi-Step Form:** 
- Progress indicator at top showing steps (1. Type → 2. Personal → 3. Travel → 4. Documents → 5. Payment)
- Step numbers in circles with connecting lines
- Active step: Primary blue, completed: success green, upcoming: light gray
- Form fields: Full-width labels above inputs, `h-12` input height, `rounded-lg` corners
- Required fields: Red asterisk, inline validation on blur
- Helper text: Below field in text-gray with info icon

**Input States:**
- Default: Border `border-gray-300`
- Focus: Border primary blue, subtle glow shadow
- Error: Border error red, error message below
- Success: Border success green with checkmark icon
- Disabled: Background light gray, reduced opacity

### Buttons
**Primary CTA:** Background primary blue, white text, `px-8 py-3`, `rounded-lg`, prominent shadow. Example: "Submit Application", "Proceed to Payment"

**Secondary:** Border primary blue, blue text, same sizing

**Danger:** Background error red for destructive actions

**Text Buttons:** No background, underline on hover, for tertiary actions

### Cards
**Application Card:** White background, `rounded-lg`, `p-6`, subtle shadow. Contains: Status badge (top-right), application number, applicant name, dates, action buttons (bottom-right).

**Document Preview Card:** Border, icon/thumbnail, filename, file size, download/remove actions

**Status Badge:** `rounded-full px-4 py-1` with status-specific colors - Under Review (blue), Approved (green), Rejected (red), Pending Payment (yellow)

### Tables
**Admin Dashboard:** Clean table with hover states, alternating row backgrounds (`bg-gray-50` on even rows), sortable headers with arrow icons, pagination at bottom

### Modals/Overlays
**Document Viewer:** Full-screen overlay, dark background, centered document preview, close button (top-right), download action (bottom)

**Confirmation Dialogs:** Centered modal, max-width 500px, title, description, action buttons aligned right

---

## Page Layouts

### Public Landing Page
- **Hero Section (80vh):** Large background image (blurred government building/flag), centered content with page title, subtitle, "Start Application" CTA. Semi-transparent overlay for text readability.
- **Three-Column Features:** Icon + title + description for key benefits (Fast Processing, Secure Platform, Track Status)
- **How It Works:** 4-step process with numbered icons
- **CTA Section:** Background light gray, centered CTA
- **Footer:** Multi-column with Quick Links, Contact, Social Media, Legal links

### Application Form
- Centered single column (`max-w-3xl`)
- Progress indicator always visible at top
- One section per step, generous vertical spacing
- Sticky footer with Previous/Next navigation
- Document upload: Drag-and-drop zone with preview thumbnails

### Dashboard (Applicant)
- Summary cards row: Applications (count), Pending, Approved, Rejected
- Application list with search and filter
- Tabbed interface for status categories

### Admin Back-Office
- Left sidebar navigation
- Application list with advanced filters panel (left), main content (center), detail panel (right - appears on selection)
- Action toolbar above list: Bulk actions, export, search

---

## Visual Elements

### Icons
**Heroicons (outline style)** for consistency:
- Navigation: home, document-text, shield-check, chart-bar, cog
- Actions: eye, download, trash, pencil, check, x-mark
- Status: clock, check-circle, x-circle, exclamation-triangle

### Imagery
**Hero Image:** Professional photo of Kinshasa skyline or government building with RDC flag, with blue overlay gradient

**Document Icons:** Use document preview thumbnails where possible, fallback to file-type icons

### e-Visa PDF Design
**Layout:** Official government document template
- Header: RDC coat of arms (left), "e-Visa" title (center), document number (right)
- Body: Two-column layout - applicant photo (left), details (right)
- QR code: Bottom-right corner, 150x150px
- Footer: Signature line, official stamp placeholder, generation date

---

## Interactions & Animations

**Minimal animations only:**
- Form field focus: Subtle border transition (150ms)
- Button hover: Slight lift with shadow (200ms)
- Status badge pulse: Gentle pulse for "Under Review" status
- Page transitions: Simple fade (300ms)

**No** complex scroll animations, parallax, or heavy effects per requirements

---

## Responsive Breakpoints

- Mobile: < 768px (single column, stacked navigation)
- Tablet: 768px - 1024px (two-column forms where appropriate)
- Desktop: > 1024px (full layout with sidebar)

Mobile-first approach: Forms stack vertically, tables convert to cards, admin sidebar becomes bottom navigation

---

## Accessibility Requirements

- Keyboard navigation for all interactive elements
- Focus indicators clearly visible (2px blue outline)
- Color contrast ratio ≥ 4.5:1 for text
- ARIA labels for icon buttons
- Form error announcements for screen readers
- Skip navigation link