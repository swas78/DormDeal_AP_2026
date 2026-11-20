# Design System: Brave Leo AI Page

Extracted from the computed CSS of the page (`.site-main.layout` and its child elements). Only values present in the CSS are listed here. The pasted source was truncated, so sections further down the page are not covered.

---

## 1. Color

| Token | Value | Usage |
|---|---|---|
| `text-default` | `#1c1c1d` | All body and heading text (`color`) |
| `border-default` | `#1c1c1d` | Border color declared on layout, header and text blocks |
| `background-default` | `rgba(0, 0, 0, 0)` | Transparent, page background shows through on every element |
| `icon-default` | `#464649` | Inline icon fill (`.bg-icon-default`, via `--tw-color-icon-default`) |

Icon color is driven by a Tailwind variable:

```css
background-color: rgba(var(--tw-color-icon-default), var(--tw-bg-opacity, 1));
```

---

## 2. Typography

### Font families

| Role | Stack |
|---|---|
| Body / UI | `Poppins, "Inter Variable", Helvetica, ui-sans-serif, system-ui, sans-serif, "apple color emoji", "segoe ui emoji", "segoe ui symbol", "noto color emoji"` |
| Display (H1) | `FlechaM` |

### Type scale

| Style | Class | Font | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|---|---|
| Body (base) | `.site-main` | Poppins | 16px | 400 | 24px | normal |
| Display hero (H1) | `.text-display-hero` | FlechaM | 120px | 500 | 103px | -2.4px |
| Heading 4 (lead) | `.text-h4` | Poppins | 30px | 600 | 40px | -1.2px |
| Heading 5 (sub-lead) | `.text-desktop-h5` / `.text-mobile-h4` | Poppins | 24px | 600 | 30px | -0.96px |

### Typography rules

- Headings use tight negative tracking: about -2% of font size on the H1 (-2.4px at 120px), and about -4% on H4 and H5.
- Text alignment is `start` everywhere.
- The H1 line height (103px) is smaller than its font size (120px), so the display type is set tight.
- Inline spans inside the sub-lead paragraph inherit its size, weight and tracking.

```css
.text-display-hero {
  font-family: FlechaM;
  font-size: 120px;
  font-weight: 500;
  line-height: 103px;
  letter-spacing: -2.4px;
}

.text-h4 {
  font-family: Poppins;
  font-size: 30px;
  font-weight: 600;
  line-height: 40px;
  letter-spacing: -1.2px;
}

.text-desktop-h5 {
  font-family: Poppins;
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  letter-spacing: -0.96px;
}
```

---

## 3. Layout

### Page grid (`.site-main.layout`)

| Property | Value |
|---|---|
| `display` | `grid` |
| Width (at the captured viewport) | `1472px` |
| Column gap | `32px` |
| Columns | `64px [main-content-start] 242.102px [article-start] 731.797px [article-end] 242.102px [main-content-end] 64px` |
| Rows | `1056.44px 612px 881.75px 1181.78px 1895.38px 1116px` |
| `overflow` | `visible` |

Named grid lines:

- `main-content-start` and `main-content-end` wrap the 3 central columns.
- `article-start` and `article-end` wrap the central content column (`731.797px`).
- The outer `64px` columns are page gutters.

```css
.site-main.layout {
  display: grid;
  gap: normal 32px;
  grid-template-columns:
    64px
    [main-content-start] 242.102px
    [article-start] 731.797px
    [article-end] 242.102px
    [main-content-end] 64px;
}
```

### Hero section (`header.hero`)

| Property | Value |
|---|---|
| `display` | `grid` |
| Width | `1280px` |
| Height | `1056.44px` |
| Padding | `152px 0 0` |
| Columns | `600px 680px` (Tailwind: `lg:grid-cols-[minmax(0,600px),1fr]`) |
| Rows | `123px 144px 84px 553.438px` |
| Transition | `padding-top 0.3s ease-out` |

Hero grid placement at `lg`:

| Element | `grid-area` |
|---|---|
| H1 | `1/1/2/2` |
| Lead paragraph (H4) | `2/1/3/2` |
| Sub-lead paragraph (H5) | flows into the left column, below the lead |
| Icon card | `1/2/3/3`, `justify-self: end` |
| Illustration wrapper | `col-span-2`, `max-width: 987px`, centered |

---

## 4. Spacing

| Element | Margin | Padding |
|---|---|---|
| H1 | `0 0 20px` (`mb-5` at `lg`, `mb-3` below) | none |
| Lead paragraph (H4) | `0 0 24px` (`lg:mb-6`) | `0 20px 0 0` (`lg:pr-5`) |
| Sub-lead paragraph (H5) | `0 0 24px` (`lg:mb-6`) | `0 20px 0 0` (`lg:pr-5`) |
| Inline icon | `0 0 -4px` (`-mb-1`) | none |

Spacing runs on a 4px base: 4, 20, 24 and 32 are all multiples of 4.

---

## 5. Components

### Inline icon

Used in the sub-lead sentence ("... click the Leo AI icon in the toolbar").

```css
.icon {
  display: inline-block;
  width: var(--icon-size, 24px);
  height: var(--icon-size, 24px);
  margin: 0 0 -4px;
  background-color: rgba(var(--tw-color-icon-default), var(--tw-bg-opacity, 1)); /* #464649 */
  --icon-url: url('/leo-icons/product-brave-leo.svg');
}
```

Notes:

- The glyph is applied as a mask from the `--icon-url` custom property. The element background provides the fill color.
- The icon sits on the text baseline through the `-4px` bottom margin.
- Icon height matches the paragraph line height closely (24px icon, 30px line).

### Icon card (hero, top right)

Built from utility classes in the markup (not computed CSS), listed here for completeness.

| Property | Mobile | `sm` and up |
|---|---|---|
| Size | `80px x 80px` | `128px x 128px` |
| `--card-padding` | `14px` | `21px` |
| `--card-contents-border-width` | `2px` | `2px` |
| Bottom margin | `20px` (`mb-5`) | `20px`, `0` at `lg` |
| Alignment | flex, centered | flex, centered, `justify-self: end` at `lg` |

Inner badge: `rounded-full`, filled with the `icons-active` color token, `25%` padding, white icon at `100%` size.

---

## 6. Interaction and Motion

| Property | Value |
|---|---|
| Default `transition` | `all 0s ease` (no animation) |
| Hero `transition` | `padding-top 0.3s ease-out` |
| `animation-duration` | `0s` on every element |
| `cursor` | `crosshair` (captured on all elements) |
| H1 `z-index` | `10` |

`cursor: crosshair` appears on every element in the capture and is likely an artifact of the inspection tool rather than a design decision. Treat it as optional.

---

## 7. Responsive Behavior

Breakpoints used by the classes in the markup:

| Prefix | Meaning |
|---|---|
| (none) | Mobile first |
| `sm:` | Small screens and up: larger card (128px), larger bottom margins, `mt-0` on the sub-lead |
| `lg:` | Desktop: two-column hero grid, explicit `grid-area` placement, 24px margins, `pr-5` padding |

Mobile type tokens exist: the sub-lead uses `text-mobile-h4` below `sm` and `text-desktop-h5` from `sm` up.

---

## 8. Quick Reference (CSS custom properties)

```css
:root {
  /* Color */
  --color-text: #1c1c1d;
  --color-icon-default: #464649;
  --color-transparent: rgba(0, 0, 0, 0);

  /* Type */
  --font-body: Poppins, "Inter Variable", Helvetica, ui-sans-serif, system-ui, sans-serif;
  --font-display: FlechaM;
  --text-body: 16px / 24px;
  --text-h5: 24px / 30px;
  --text-h4: 30px / 40px;
  --text-display: 120px / 103px;

  /* Spacing */
  --space-1: 4px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --page-gutter: 64px;
  --hero-padding-top: 152px;

  /* Layout */
  --hero-width: 1280px;
  --hero-col-left: 600px;
  --hero-col-right: 680px;
  --article-max-width: 987px;

  /* Motion */
  --transition-hero: padding-top 0.3s ease-out;
}
```

---

## 9. Scope Notes

- Source: computed styles for `.site-main.layout`, `header.hero`, the H1, the two lead paragraphs, the platform-specific spans and the inline icon.
- Not covered: the rest of the page (feature sections, footer), hover/focus/active states and the SVG illustration colors. The pasted source was truncated before those parts, so they cannot be derived reliably.
- Values such as pixel widths and heights (for example `1472px` and `6743.35px`) are measurements from one viewport. Use the grid and padding rules above, not the measured sizes, when rebuilding the layout.