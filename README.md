# Typer

A browser-only typing practice application, built in small educational phases
with HTML, plain CSS, and vanilla JavaScript.

## Open the application

Open `index.html` directly in a browser. No installation, build step, or server is
required.

## Phase 2: basic typing

The current page supports untimed typing practice:

- Duration selector: 15, 30, 60 (default), or 120 seconds.
- Sample passage and typing area with immediate character-by-character feedback.
- Green shading for correct characters, red shading and wavy underlines for
  mistakes, and a dark underline for the next character.
- Text feedback showing correct characters and current mistakes, including any
  extra characters beyond the passage. Spaces, punctuation, and case must match.
- Corrections, deletion, and edits in the middle update the feedback immediately.
- Completion feedback when the whole passage matches. Clear the input to retry.
- Statistics placeholders.
- Disabled restart and new-passage buttons.
- Responsive layout with labeled controls and keyboard focus styling.

Changing the selector only changes its native selected value. Countdown,
scoring, and button actions are deferred to later phases. The current mistake
count reflects the text currently in the input, not a history of corrected errors.

`index.html` defines the page content. `style.css` defines its appearance using
CSS variables, Flexbox, and a small media query. `script.js` creates a span for
each passage character and compares it with the input on every input event.

## Planned phases

1. **Static UI** — complete.
2. **Basic typing** — complete: input comparison and progress/error highlighting.
3. **Timing and results** — start on the first typed character, lock duration
   during a test, count down, stop input at expiry, and calculate WPM and accuracy.
   Supply enough text to continue for the selected duration.
4. **Repeat practice** — restart while retaining the duration and load new text.
5. **Polish** — refine responsiveness, accessibility, and edge cases.

Each phase is reviewed before proceeding to the next and can be committed
separately. Suggested phase 2 commit: `feat: add typing progress and error feedback`.

## Manual preview checks

- Open the page at desktop and narrow mobile widths; check for horizontal overflow.
- Tab to the duration selector and use the arrow keys to change its value.
- Confirm 60 seconds is selected on initial load.
- Type `Small`: the first five characters should turn green and the following
  space should have a dark underline.
- Type an incorrect character: the matching passage position should be red and
  underlined, and the mistake count should increase. Delete or correct it and
  confirm the feedback updates, including edits in the middle of the input.
- Copy the full passage into the input to verify completion; append an extra
  character to verify it counts as a mistake and completion is removed.
- Clear the input and confirm the first character is marked as next again.
- Confirm action buttons remain disabled and statistics show placeholders.
