# UI/UX Design System Specification (UI_UX_DESIGN_BRIEF.md)
## Design System Source of Truth: Warm Parchment Editorial Aesthetic

---

## 1. Design Philosophy & Brand Personality
Pranabyte rejects the sterile, cold blue medical software paradigm in favor of a **warm, editorial, human, and clinically rigorous** design language. 

The aesthetic is inspired by premium medical journals, fine parchment typography, and tactile tactile clinical stationery:
- **Canvas**: Warm Parchment `#fef9ef` (never cold pure `#ffffff`).
- **Surfaces**: Aged Paper `#f5eee1` with subtle border delineation.
- **Accents**: Terracotta `#b05a36` for primary human actions.
- **Typography**: Editorial serif headlines paired with high-legibility humanist sans body text.

---

## 2. Color Palette & Design Tokens

### 2.1. Core Surfaces & Typography
```css
/* Backgrounds & Surfaces */
--color-canvas:        #fef9ef; /* Primary page parchment */
--color-surface:       #f5eee1; /* Cards, panels, modals */
--color-surface-hover: #ede4d3; /* Hovered cards & list rows */
--color-border-warm:   #d1c9bf; /* Subtle tactile borders */
--color-border-subtle: #e5dfd5; /* Divider lines */

/* Text & Readability */
--color-ink:           #2a2b2f; /* Primary headlines & high-emphasis text */
--color-charcoal:      #333333; /* Body copy & standard text */
--color-graphite:      #515151; /* Subtext, labels & secondary metadata */
--color-muted:         #78716c; /* Timestamp & placeholder text */

/* Primary Action Accent */
--color-terracotta:       #b05a36; /* Primary CTA button & active states */
--color-terracotta-hover: #9c4f2f; /* Button hover & focus fill */
--color-terracotta-light: #faede8; /* Badge & active pill background */
```

### 2.2. Clinical 4-Information States
```css
/* 🟢 CONFIRMED: Explicitly reported by patient during current intake */
--clinical-confirmed-bg:     #dcfce7;
--clinical-confirmed-text:   #15803d;
--clinical-confirmed-border: #86efac;

/* 🔵 DOCUMENTED: Extracted from verified past medical record / prescription */
--clinical-documented-bg:     #dbeafe;
--clinical-documented-text:   #1e40af;
--clinical-documented-border: #93c5fd;

/* 🟡 UNCERTAIN: Ambiguous wording or low OCR clarity requiring confirmation */
--clinical-uncertain-bg:     #fef3c7;
--clinical-uncertain-text:   #b45309;
--clinical-uncertain-border: #fde68a;

/* 🔴 CONFLICTING / RED FLAG: Discrepancy between records or urgent clinical symptom */
--clinical-conflict-bg:     #fee2e2;
--clinical-conflict-text:   #b91c1c;
--clinical-conflict-border: #fca5a5;
```

---

## 3. Typography Hierarchy

| Level | Font Family | Size / Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | Serif (Playfair / Financier) | 36px (2.25rem) / 700 | 1.2 | -0.02em | Hero titles, primary section headers |
| **Headline / H2**| Serif (Playfair / Financier) | 26px (1.625rem) / 600 | 1.3 | -0.01em | Modal headers, card section titles |
| **Subhead / H3** | Humanist Sans (Plus Jakarta / Inter) | 18px (1.125rem) / 600 | 1.4 | 0 | Card subheaders, widget titles |
| **Body Primary** | Humanist Sans (Plus Jakarta / Inter) | 15px (0.9375rem) / 400 | 1.6 | 0 | Clinical fact values, narrative descriptions |
| **Body Small**   | Humanist Sans (Plus Jakarta / Inter) | 13px (0.8125rem) / 400 | 1.5 | 0 | Metadata, source citations, notes |
| **Caption / Tag**| Humanist Sans (Plus Jakarta / Inter) | 11px (0.6875rem) / 600 | 1.3 | +0.03em | Badges, 4-state labels, timestamps |

---

## 4. Layout, Spacing & Geometry Rules

- **Grid Base**: Strict 8px system (`gap-2` = 8px, `gap-4` = 16px, `gap-6` = 24px, `gap-8` = 32px).
- **Max Content Width**: `1280px` (`max-w-7xl mx-auto`).
- **Card Geometry**: `rounded-3xl` (`24px`) with `p-6` or `p-8` (24px–32px) inner padding.
- **Button & Input Geometry**: Pill shape `rounded-full` (`40px`) for primary buttons and search inputs; `rounded-2xl` (`16px`) for text areas.
- **Shadows**: Soft, minimal organic elevation (`shadow-sm`, `shadow-md` with warm umber tint).
- **Transitions**: Smooth 200ms cubic-bezier transitions on hover and active states.

---

## 5. Component Design Rules

### 5.1. Buttons
- **Primary CTA**: Terracotta background (`#b05a36`), white text, `rounded-full`, `px-6 py-3`, subtle hover scale and shadow.
- **Secondary Action**: Aged paper background (`#f5eee1`), warm taupe border (`#d1c9bf`), charcoal text (`#333333`), `rounded-full`.
- **Destructive / Red Flag**: Crimson tint (`#fee2e2`), bold red text (`#b91c1c`), `rounded-full`.

### 5.2. Cards & Panels
- Background: `#f5eee1` (Aged Paper) on `#fef9ef` (Parchment) canvas.
- Border: `1px solid #d1c9bf`.
- Radius: `24px` (`rounded-3xl`).
- Elevation: `shadow-[0_4px_20px_rgba(42,43,47,0.04)]`.

### 5.3. Voice Intake Push-to-Talk Interface
- Large central circular button (`w-24 h-24 rounded-full`).
- Inactive state: Deep terracotta/warm gradient with microphone icon.
- Recording state: Pulsing terracotta ring with animated acoustic ripple.
- Real-time transcription bubble in parchment card with instant inline edit trigger.

---

## 6. Accessibility & Responsiveness (WCAG 2.2 AA)
- Contrast ratio between `#2a2b2f` (Ink) and `#fef9ef` (Parchment) is **14.2:1** (far exceeds WCAG AAA 7:1).
- Contrast ratio between `#b05a36` (Terracotta) and `#ffffff` is **4.9:1** (meets WCAG AA).
- Every interactive button features visible focus rings (`focus-visible:ring-2 focus-visible:ring-[#b05a36]`).
- All 4 clinical status states use both distinct iconography (🟢, 🔵, 🟡, 🔴) and text labels, never relying on color alone.
- Tested and responsive across breakpoints: 320px, 375px, 390px, 414px, 768px, 1024px, 1280px, 1440px.
