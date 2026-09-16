# Typer

A browser-only typing practice application, built in small educational phases
with HTML, plain CSS, and (in later phases) vanilla JavaScript.

## Open the application

Open `index.html` directly in a browser. No installation, build step, or server is
required.

## Phase 1: static UI

The current page demonstrates the layout only:

- Duration selector: 15, 30, 60 (default), or 120 seconds.
- Sample passage, disabled typing area, and statistics placeholders.
- Disabled restart and new-passage buttons.
- Responsive layout with labeled controls and keyboard focus styling.

Changing the selector only changes its native selected value. Typing, countdown,
scoring, and button actions are intentionally deferred to later phases.

`index.html` defines the page content. `style.css` defines its appearance using
CSS variables, Flexbox, and a small media query. No JavaScript is needed yet.

## Planned phases

1. **Static UI** — complete.
2. **Basic typing** — input comparison and progress/error highlighting.
3. **Timing and results** — start on the first typed character, lock duration
   during a test, count down, stop input at expiry, and calculate WPM and accuracy.
   Supply enough text to continue for the selected duration.
4. **Repeat practice** — restart while retaining the duration and load new text.
5. **Polish** — refine responsiveness, accessibility, and edge cases.

Each phase is reviewed before proceeding to the next and can be committed
separately. Suggested first commit: `feat: add static typing practice interface`.

## Manual preview checks

- Open the page at desktop and narrow mobile widths; check for horizontal overflow.
- Tab to the duration selector and use the arrow keys to change its value.
- Confirm 60 seconds is selected on initial load.
- Confirm typing and action buttons are disabled and statistics show placeholders.
