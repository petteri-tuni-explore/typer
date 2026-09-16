# Typer

A browser-only typing practice application, built in small educational phases
with HTML, plain CSS, and vanilla JavaScript.

## Open the application

Open `index.html` directly in a browser. No installation, build step, or server is
required.

## Phase 3: timing and results

The current page supports fixed-duration typing tests:

- Duration selector: 15, 30, 60 (default), or 120 seconds.
- Sample passage and typing area with immediate character-by-character feedback.
- Green shading for correct characters, red shading and wavy underlines for
  mistakes, and a dark underline for the next character.
- Text feedback showing correct characters and current mistakes.
  Spaces, punctuation, and case must match.
- Corrections, deletion, and edits in the middle update the feedback immediately.
- Countdown starts on the first nonempty input and locks the selected duration.
  Clearing the input does not restart or pause the countdown.
- The passage repeats automatically, with a separating space, to keep text
  available until time runs out. The passage panel follows typing progress.
- Input becomes read-only at expiry and final WPM and accuracy are displayed.
- Disabled restart and new-passage buttons.
- Responsive layout with labeled controls and keyboard focus styling.

Reload the page to try again. Restart and new-passage buttons arrive in phase 4.
The duration selector stays locked after completion until the page is reloaded.

### Scoring

- WPM = (correct characters / 5) / selected duration in minutes.
- Accuracy = correct characters / characters remaining in the input × 100.
- Both results round to the nearest whole number. Empty input scores zero for
  both. Spaces and punctuation count as characters.
- Corrected mistakes do not reduce accuracy; only the final text is scored.
  Untyped characters do not count as mistakes.
- Paste is currently accepted and scored like other input; this is a practice
  tool, not a verified competitive score.

The timer compares the current time against an absolute deadline. Delayed
callbacks (for example, in a background tab) do not extend the test, and input
received at or after the deadline is rejected.

`index.html` defines the page content. `style.css` defines its appearance using
CSS variables, Flexbox, and a small media query. `script.js` creates a span for
each passage character and compares it with the input on every input event.
It tracks three states (`ready`, `running`, `finished`) and uses a browser timer
to check the deadline. There are no dependencies or build tools.

## Planned phases

1. **Static UI** — complete.
2. **Basic typing** — complete: input comparison and progress/error highlighting.
3. **Timing and results** — complete: start on the first typed character, lock duration
   during a test, count down, stop input at expiry, and calculate WPM and accuracy.
   Supply enough text to continue for the selected duration.
4. **Repeat practice** — restart while retaining the duration and load new text.
5. **Polish** — refine responsiveness, accessibility, and edge cases.

Each phase is reviewed before proceeding to the next and can be committed
separately. Suggested phase 3 commit: `feat: add timed tests and typing results`.

## Manual preview checks

- Open the page at desktop and narrow mobile widths; check for horizontal overflow.
- Tab to the duration selector and use the arrow keys to change its value.
- Confirm 60 seconds is selected on initial load.
- Type `Small`: the first five characters should turn green and the following
  space should have a dark underline.
- Type an incorrect character: the matching passage position should be red and
  underlined, and the mistake count should increase. Delete or correct it and
  confirm the feedback updates, including edits in the middle of the input.
- Select 15 seconds. Confirm selecting or focusing alone does not start the test.
- Begin typing: duration selection should lock and the countdown should start.
- Clear the input and confirm the first character is marked as next again while
  the countdown keeps running.
- Reach the end of the original passage: more text should be available and the
  countdown should continue.
- At expiry, confirm the input becomes read-only, remaining time is zero, and
  final WPM and accuracy appear. Reload to try another duration.
- Start a test, switch tabs until its duration has elapsed, and return; the test
  should show results without granting extra typing time.
- Confirm action buttons remain disabled.

## Automated checks

With Node.js installed, run `node --test tests/typing.test.cjs`. These tests use
small DOM and clock stubs to check timing, corrections, scoring, empty input,
late input, background delays, and passage extension without real-time waits.
They do not replace visual or browser interaction checks. Node.js is needed
only for these checks; the application itself still runs directly in a browser.
