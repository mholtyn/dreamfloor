# Dreamfloor - Design Specification

Source of truth = Figma reference screens in reference/.

## Overview
Dreamfloor is a clean, modern one-page web application for creating fictional techno lineup posters with live preview and multiple visual presets.

---

## Layout Structure

### Desktop Layout (≥1024px)
- **Two-column grid layout**
- Left column: Poster Preview (sticky)
- Right column: Controls (Preset Selector, Lineup Builder, Export Actions)
- Max width: 1280px centered
- Padding: 2rem (32px)
- Gap between columns: 2rem (32px)

### Mobile Layout (<1024px)
- **Single column stacked layout**
- Order: Controls first, then Preview
- Padding: 0.75rem (12px) on mobile, 1rem (16px) on tablet
- Gap between sections: 1rem - 1.5rem

### Component Cards
- Background: White (#FFFFFF)
- Border: 1px solid light gray (#E5E7EB)
- Border radius: 0.5rem (8px) mobile, 0.75rem (12px) desktop
- Shadow: Subtle (0 1px 2px rgba(0,0,0,0.05))
- Padding: 0.75rem mobile, 1rem tablet, 1.5rem desktop

---

## Top Bar

### Specifications
- Height: 64px
- Background: White with subtle border bottom
- Box shadow: 0 1px 3px rgba(0,0,0,0.1)
- Sticky positioning at top
- Z-index: 50

### Logo
- Text: "DREAMFLOOR"
- Font: Bold, uppercase
- Size: 1.125rem (18px)
- Letter spacing: 0.1em
- Color: #000000

### Info Button
- Icon: Info circle (16px)
- Variant: Ghost button
- Hover: Light gray background
- Size: 36px × 36px

---

## Poster Preview

### Container
- Aspect ratio: 3:4 (portrait)
- Max width: 280px mobile, 384px tablet, 448px desktop
- Border radius: 0.5rem (8px) mobile, 0.75rem (12px) desktop
- Box shadow: Large (0 25px 50px rgba(0,0,0,0.25))
- Padding: 1.5rem mobile, 2rem tablet, 2.5-3rem desktop

### Header Section
- "Fictional Event" label
  - Size: 0.6rem mobile, 0.75rem desktop
  - Letter spacing: 0.2-0.3em
  - Opacity: 80%
  - Uppercase

- "Dreamfloor" title
  - Size: 1.875rem mobile, 3rem desktop
  - Font weight: 900 (black)
  - Uppercase
  - Letter spacing: Tight (-0.025em)
  - Line height: 1

- "Techno Experience" subtitle
  - Size: 0.75rem mobile, 0.875rem desktop
  - Letter spacing: 0.1em
  - Uppercase

### Lineup Section
- Spacing between items: 0.5-0.75rem

#### Each Lineup Item
- Border bottom: 1px solid (text color at 12% opacity)
- Padding bottom: 0.375rem mobile, 0.5rem desktop

**First line (Artist):**
- Number: 
  - Size: 0.65rem mobile, 0.75rem desktop
  - Font weight: Bold
  - Color: Accent color
  - Format: "01", "02", etc.
- Name:
  - Size: 0.75rem mobile, 1rem desktop
  - Font weight: Bold
  - Uppercase
  - Letter spacing: 0.025em

**Second line (Time slot):**
- Padding left: 1.25rem mobile, 1.5rem desktop
- Size: 0.65rem mobile, 0.75rem desktop
- Font weight: 600
- Color: Secondary color
- Format: "23:00 - 01:00"

### Footer Section
- Divider: 1px line at 20% opacity
- Text: "Created with Dreamfloor"
- Size: 0.6rem mobile, 0.75rem desktop
- Letter spacing: 0.1em
- Uppercase
- Opacity: 60%

---

## Poster presets — moodboards & visual direction

Target lineup: **Industrial**, **Prime**, **Minimal**, **Sunset**, **Pulse**.  
Reference images live in the repo under **`reference-posters/<preset-id>/`** (local only; not shipped in the app bundle). Use them for **mood and token choices**, not pixel-perfect copies.

Implementation should stay **data-driven** (`PresetConfig` in `src/data/presets.ts`) with **one** shared `PosterPreview` layout unless a preset truly needs a different DOM structure.

---

### Preset: Industrial

**Intent:** Hard techno / warehouse — technical, cold, structured. Feels like a signal, a blueprint, or a terminal — not a beach party.

**Moodboard (from references):**

- Near-black or charcoal base; **one dominant cool accent** (steel blue, cyan, or icy blue) for blocks, rules, and key type.
- **Modular layout**: geometric shapes, strict alignment, optional subtle grid or “HUD” framing (corner brackets, thin rules).
- Typography: **bold condensed sans** for the title; **clean sans** for lineup; optional **monospace** for meta lines (dates, labels).
- High contrast; **matte** or lightly **noisy** finish acceptable; avoid pastel warmth.

**Implementation notes:**

- Favor `linear-gradient` or flat fills + **single accent family** over rainbow gradients.
- Optional: faint background grid (`background-image` linear repeats), `text-shadow` glow only if restrained (cyan on white title).
- Lineup rows: clear separators; numbers in accent color.

**Reference folder:** `reference-posters/industrial/`

---

### Preset: Prime

**Intent:** “Proper” club techno poster — high energy, headline-first, readable lineup. Should feel like a **real event flyer**, not a UI mock.

**Moodboard (from references):**

- Strong **visual hierarchy**: title dominates, then date/context, then lineup.
- Room for **texture** (grain, airbrush-like softness) or **bold color blocking** (saturated reds, blues, oranges) depending on final ref choice.
- Mix of **display energy** (custom/heavy title treatment) + **workhorse sans** for artist lines.
- Optional graphic tension: crop marks, UI-adjacent details, or illustrative focal point — keep **lineup legible** at export resolution.

**Open point:** If references skew **Halloween / neo-maximal**, add at least one **high-key** ref (light background, dark type) so “Prime” does not drift into Pulse or Industrial.

**Implementation notes:**

- Token set should separate **title treatment** from **body** (weight, tracking, optional outline).
- Test **html2canvas** early if using heavy filters, blend modes, or large images.

**Reference folder:** `reference-posters/prime/`

---

### Preset: Minimal

**Intent:** Swiss / brutalist club minimal — structure and type carry everything.

**Moodboard (from references):**

- **Monochrome** (black & white) or near-monochrome; thick rules and **grid cells**.
- No illustration required; optional **rhythmic patterns** (bars, repeated lines) as texture.
- Typography: **neutral grotesk**, caps, consistent tracking; lineup as disciplined blocks.
- Zero decorative gradients unless extremely subtle (off-white vs pure white).

**Implementation notes:**

- Borders and `gap` are part of the aesthetic; use explicit `border` weights.
- Extremely sensitive to alignment — poster padding and lineup indentation must match the grid logic.

**Reference folder:** `reference-posters/minimal/`

---

### Preset: Sunset

**Intent:** House / summer / open air — warmth, daylight optimism, leisure.

**Moodboard (from references):**

- **Warm spectrum**: sun yellow, coral, soft orange, sky blue, sea blues — flat or simple illustrated shapes (sunburst, waves, horizon).
- Playful but **legible**; lineup can sit on a solid band or high-contrast strip if the background is busy.
- Avoid the cold cyan-dominant palette of Industrial.

**Implementation notes:**

- Illustration-heavy looks may need **SVG** or CSS shapes first; photos are a later step.
- Prefer **large flat color fields** over dark muddy gradients for this preset.

**Reference folder:** `reference-posters/sunset/`

---

### Preset: Pulse

**Intent:** Neo-rave / current club-graphic energy — emotional, glossy, night-time, social-feed native.

**Moodboard (from references):**

- **Dark base** + **neon accents** (red, magenta, electric yellow, purple glow).
- **Film grain** or noise across the poster; **glow** on script or display lines (`text-shadow` / soft layers).
- Mix **heavy sans** (club name) with **script or soft display** (secondary line); optional sticker-like shapes or flares — use sparingly so export stays clean.
- Center-weight composition (hero figure or glow) + **left-aligned** or stacked lineup is acceptable.

**Implementation notes:**

- Grain: CSS noise overlay (pseudo-element + SVG filter or small repeating asset) — verify performance and **html2canvas** fidelity.
- Keep glow layers countable; too many shadows blur export.

**Reference folder:** `reference-posters/pulse/`

---

### Legacy poster presets (superseded)

The following existed in early builds and are **replaced conceptually** by the five presets above once implementation catches up: Neon, Dark Rave, Retro, Gradient (plus the old “Minimal” token set, which may differ from the new **Minimal** moodboard). Remove this subsection when the codebase no longer references legacy `presetId` values.

---

## Preset Selector

### Layout
- Grid: 3 columns mobile, 5 columns desktop
- Gap: 0.5rem mobile, 0.75rem desktop

### Each Preset Button
- Aspect ratio: 3:4
- Border radius: 0.375rem mobile, 0.5rem desktop
- Border: 2px solid
  - Default: #E5E7EB (light gray)
  - Hover: #D1D5DB (medium gray)
  - Selected: #9333EA (purple) + 2px ring with 2px offset
- Padding: 0.375rem mobile, 0.5rem desktop
- Hover effect: Scale 1.05
- Transition: All 200ms

### Preset Preview Content
- Name: 0.6rem mobile, 0.75rem desktop, bold
- Color dots: 3 circles
  - Size: 6px mobile, 8px desktop
  - Gap: 2-4px
  - Shows primary, secondary, accent colors

### Selected State
- Check icon (white) in purple circle
- Position: Top-right corner
- Size: 16px mobile, 20px desktop

---

## Lineup Builder

### Header
- Label: "Lineup" (0.875rem, semi-bold)
- Add button:
  - Icon: Plus (14-16px)
  - Text: "Add Artist"
  - Variant: Outline
  - Size: Small

### Empty State
- Border: 2px dashed gray
- Padding: 1.5-2rem
- Text: Centered, muted color
- Message: "No artists yet" + "Click Add Artist..."

### Lineup Slot Card
- Border: 1px solid gray
- Border radius: 0.5rem
- Padding: 0.75rem mobile, 1rem desktop
- Background: White
- Hover: Border darkens (#D1D5DB)
- Transition: 200ms

#### Slot Number Badge
- Position: Absolute, left -6-8px
- Size: 24px mobile, 32px desktop
- Background: #F3F4F6 (light gray)
- Border radius: Full circle
- Text: 0.65rem mobile, 0.75rem desktop, semi-bold
- Format: "1", "2", "3"...

#### Drag Handle (Desktop only)
- Icon: Grip vertical (16px)
- Color: #9CA3AF (gray)
- Hidden on mobile

#### Artist Input
- Label: "Artist Name" (0.75rem)
- Placeholder: "Enter artist name"
- Height: 40px
- Border radius: 0.375rem
- Autocomplete dropdown:
  - Background: White
  - Border: 1px solid gray
  - Border radius: 0.5rem
  - Shadow: Large
  - Max height: 192px (12rem)
  - Scrollable

#### Duration Selector
- Label: "Duration" (0.75rem)
- Options:
  - 60 min
  - 90 min
  - 2h (120 min)
  - 3h (180 min)
  - 4h (240 min)
  - 5h (300 min)
  - 6h (360 min)

#### Delete Button
- Icon: Trash (14-16px)
- Color: #DC2626 (red)
- Variant: Ghost
- Size: 32px × 32px
- Hover: Light red background (#FEF2F2)

---

## Export Actions

### Container
- Border top: 1px solid gray
- Padding top: 0.75rem mobile, 1rem desktop
- Spacing: 0.625rem mobile, 0.75rem desktop

### Export PNG Button
- Full width
- Size: Large (44px height)
- Variant: Primary (purple)
- Icon: Download (16px)
- Text: "Export PNG" / "Exporting..." / "Exported!"
- States:
  - Default: Purple background
  - Loading: Spinner animation
  - Success: Check icon (2 seconds)
  - Disabled: Grayed out (50% opacity)

### Share Button
- Full width
- Size: Large (44px height)
- Variant: Outline
- Icon: Share (16px)
- Text: "Share" / "Sharing..." / "Shared!"
- States: Same as Export button

### Validation Message
- Text: "Add at least one artist to enable export"
- Size: 0.75rem
- Alignment: Center
- Color: Muted gray
- Shows when invalid

---

## Info Modal

### Overlay
- Background: Black at 50% opacity (rgba(0,0,0,0.5))
- Backdrop blur: Slight

### Dialog
- Width: 90% mobile, max 500px desktop
- Background: White
- Border radius: 0.75rem
- Padding: 1.5rem
- Shadow: Extra large

### Header
- Title: "About Dreamfloor" (1.25rem, bold)
- Close button: X icon (24px), top-right

### Content
- Sections with headings (1rem, semi-bold)
- Body text: 0.875rem, line height 1.6
- Spacing: 1rem between sections

### Sections
1. **What is Dreamfloor?**
2. **How to Use**
   - Numbered steps
3. **Disclaimer**
   - Warning about fictional content
   - Note about trademark usage

### Close Button (footer)
- Full width
- Variant: Primary
- Text: "Got it!"

---

## Typography System

### Font Family
- System font stack (San Francisco on macOS, Segoe UI on Windows, etc.)
- Fallback: sans-serif

### Font Sizes
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)
- 5xl: 3rem (48px)
- 6xl: 3.75rem (60px)

### Font Weights
- normal: 400
- medium: 500
- semibold: 600
- bold: 700
- extrabold: 800
- black: 900

---

## Color Palette (UI Elements)

### Primary
- Purple: #9333EA
- Purple hover: #7E22CE

### Gray Scale
- 50: #F9FAFB
- 100: #F3F4F6
- 200: #E5E7EB
- 300: #D1D5DB
- 400: #9CA3AF
- 500: #6B7280
- 600: #4B5563
- 700: #374151
- 800: #1F2937
- 900: #111827

### Status Colors
- Success: #10B981 (green)
- Error: #EF4444 (red)
- Warning: #F59E0B (amber)

---

## Spacing Scale

- 0.5: 0.125rem (2px)
- 1: 0.25rem (4px)
- 1.5: 0.375rem (6px)
- 2: 0.5rem (8px)
- 2.5: 0.625rem (10px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 5: 1.25rem (20px)
- 6: 1.5rem (24px)
- 8: 2rem (32px)
- 10: 2.5rem (40px)
- 12: 3rem (48px)

---

## Interactions & Animations

### Hover States
- Buttons: Darken background, scale 1.02
- Cards: Lighten border, subtle lift
- Preset buttons: Scale 1.05

### Transitions
- Default: 200ms ease-in-out
- Quick: 150ms
- Slow: 300ms

### Loading States
- Spinner: Infinite rotation animation
- Button text changes
- Icons swap

### Success States
- Check icon appears
- Green color flash
- Resets after 2 seconds

---

## Responsive Breakpoints

```
Mobile: 0 - 639px
Tablet: 640px - 1023px
Desktop: 1024px+
```

### Key Responsive Changes
- **Layout**: Stacked → Side-by-side at 1024px
- **Poster**: Max 280px → 384px → 448px
- **Preset grid**: 3 cols → 5 cols at 768px
- **Spacing**: Increases at each breakpoint
- **Text sizes**: Grow at 640px and 1024px
- **Drag handle**: Hidden until 640px

---

## Technical Notes

### Time Calculation
- Default start time: 23:00
- Times cascade based on duration
- Format: 24-hour (HH:MM)
- Wraps after midnight (e.g., 23:00 → 02:00)

### Artist Autocomplete
- Filters on keystroke
- Max 6 suggestions shown
- Case-insensitive matching
- Closes 200ms after blur

### Export Functionality
- Uses html2canvas for PNG generation
- Targets #poster-preview element
- Scale: 2x for quality
- Background: Opaque white
- Downloads as "dreamfloor-poster.png"

### Share Functionality
- Uses Web Share API when available
- Falls back to clipboard copy
- Shares PNG blob with text
- Toast notifications for feedback

---

## Accessibility Considerations

- Semantic HTML structure
- Focus states on all interactive elements
- Keyboard navigation support
- ARIA labels where needed
- Sufficient color contrast (WCAG AA)
- Screen reader friendly labels

---

## Validation Rules

### Valid Lineup
- At least one artist with non-empty name
- Export buttons disabled until valid

### Artist Name
- No minimum length (any text allowed)
- TBA shown if empty on poster

### Duration
- Must be one of predefined values
- Defaults to 120 minutes (2h)

---

This specification provides all the visual and interaction details needed to recreate the Dreamfloor design in any tech stack.
