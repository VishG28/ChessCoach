# Coordinate Contrast Report

Validated by `scripts/contrast-check.mjs` (wcag-contrast package, WCAG 2.1 AA threshold 4.5:1).

All ratios computed using the `hex()` function from `wcag-contrast`.

## Final Passing Values

| Theme | Light sq | onLight | Ratio | Dark sq | onDark | Ratio | Result |
|---|---|---|---|---|---|---|---|
| classic | #EDE3C8 | #3D2A18 | 10.64:1 | #B8975F | #1A1008 | 6.80:1 | PASS |
| green | #EEEED2 | #12200A | 14.39:1 | #769656 | #12200A | 5.07:1 | PASS |
| marble | #F5F0E1 | #2E2A20 | 12.56:1 | #5C6B58 | #F0EEE0 | 4.87:1 | PASS |
| wood | #D9B989 | #3A2410 | 7.81:1 | #6B4423 | #F5E6D1 | 6.91:1 | PASS |
| bubblegum | #D4A8B5 | #3A1A26 | 7.43:1 | #3D5A75 | #F0E6EC | 5.91:1 | PASS |
| midnight | #4A5870 | #E6ECF5 | 6.05:1 | #1F2B3D | #D6DCE5 | 10.35:1 | PASS |

## Implementation Notes

### CSS Selector Discovery

The plan assumed `cg-board coords coord` but chessground actually renders
`<coords>` as children of `<cg-container>` (a sibling of `<cg-board>`, not a
child). The final selectors use `cg-container coords coord:nth-child(odd/even)`.

### Parity

With white on bottom, chessground's `nth-child(1)` coord element for both
ranks and files corresponds to the dark-square corner (a1 is dark). Therefore:

- `nth-child(odd)` -> dark squares -> use `onDark` color
- `nth-child(even)` -> light squares -> use `onLight` color

This was confirmed by inspecting computed styles via Playwright:
- ranks child 1 = "1" -> rgb(26, 16, 8) (#1A1008 = onDark) confirmed
- ranks child 2 = "2" -> rgb(61, 42, 24) (#3D2A18 = onLight) confirmed

**No odd/even swaps were required** -- parity was correct on first attempt.
Verified by screenshots in both white-on-bottom and black-on-bottom orientations
(12 screenshots total in docs/screenshots/coords/).

### Special Cases

**green**: The dark square (#769656) is a mid-tone sage green. Dark text
(#12200A) achieves 5.07:1 on it and 14.39:1 on the light square. The same
color is used for both odd and even coords, which is intentional and correct.

**marble**: Uses a procedural SVG (8-color palette) rather than a fixed
two-color checkerboard. Light reference is palette[0] = #F5F0E1 and dark
reference is palette[7] = #5C6B58. Coord colors: #2E2A20 on light (12.56:1)
and #F0EEE0 on dark (4.87:1, just above threshold). A text-shadow fallback is
applied to both marble and wood themes to guard against palette/grain variance.

**classic dark square** (#B8975F): This is a mid-tan, not a true dark.
The initial plan's #FFF5E6 (near-white) gave only 2.55:1. Switched to
#1A1008 (very dark brown) which gives 6.80:1.

### Iteration History

| Theme | Initial onDark | Initial ratio | Final onDark | Final ratio |
|---|---|---|---|---|
| classic | #FFF5E6 | 2.55 (FAIL) | #1A1008 | 6.80 (PASS) |
| green | #F0F5E8 | 3.02 (FAIL) | #12200A | 5.07 (PASS) |
| marble | #F0EEE0 | 4.87 (PASS) | unchanged | 4.87 |
| wood | #F5E6D1 | 6.91 (PASS) | unchanged | 6.91 |
| bubblegum | #F0E6EC | 5.91 (PASS) | unchanged | 5.91 |
| midnight | #D6DCE5 | 10.35 (PASS) | unchanged | 10.35 |

Classic and green required one iteration. All others passed on the first run.
