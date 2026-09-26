# Front Brief brand exploration

The selected direction is **Fieldnote**: a light, soothing palette of warm paper, pine ink, and sage accents, paired with spacious editorial typography. Dark backgrounds are out of scope.

## UI tokens

The source of truth is `app/globals.css`. Use these Tailwind tokens rather than copying hex values into components:

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#F7F5EF` | Page background |
| `surface` | `#FFFFFF` | Forms and raised surfaces |
| `pine` | `#293B36` | Primary text, icons, and restrained controls |
| `muted` | `#65766C` | Secondary text |
| `sage` | `#78927B` | Small decorative accents |
| `moss` | `#DCE4D8` | Soft panels and selected states |
| `clay` | `#B2794B` | Rare human emphasis |
| `line` | `#D5DDD6` | Borders and dividers |

Clinical statuses must stay explicit and separate from the brand palette. Do not use brand color to imply acuity or urgency.

Cards use a 20 px radius; controls use 12 px. Prefer the existing Tailwind spacing scale and Inter type utilities.

## Logo finalists

Two icon directions are being kept: **Voice to brief** and **Clear handoff**. Both share the Fieldnote wordmark and palette. The voice direction moves an irregular input line into ordered strokes; the handoff direction shows two source lines moving into one reviewed brief.

Finalist exports and usage notes are in [selected-logo](selected-logo/README.md), including editable SVG lockups and icon-only files.

## Exploration boards

- [Fieldnote reference overview](fieldnote-reference-overview.png)
- [Two logo finalists](selected-logo/front-brief-logo-finalists.png)

The exported vectors are editable. The logo wordmark remains live text set to Inter with an Arial fallback.
