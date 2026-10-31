# From Skills to Sound

An interactive presentation about Omani vocational colleges, Shinas Vocational College, and a 5-tone electronic piano built on the 555 timer.

**Live:** https://0ceanmind.github.io/rehab/

## Presenting
| Action | Keys |
| --- | --- |
| Next / previous slide | `→` `←` · `Space` · `PageDown` / `PageUp` (works with presenter clickers) |
| Full screen | `F` |
| Play piano notes (Circuit, Oscillation and Live Demo slides) | `1` – `5` |
| Jump to a slide | add `#n` to the URL, e.g. `#10` |

Hover any card, pin, component or chart bar for more detail.

## Contents
- 3D models built in Three.js (555 IC, resistors, capacitors, push button, speaker, 9 V battery)
- An interactive Oman map with all 8 vocational colleges
- An interactive schematic with animated current flow
- A live view of the 555's internals synced to the capacitor-voltage chart
- A frequency chart where you can change C1
- A playable piano that synthesises each key's real frequency and duty cycle

Fonts and libraries are bundled in `assets/`, so the deck also works offline. To run it locally, serve the folder with any static server, e.g. `python3 -m http.server`.
