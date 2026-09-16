# Typer

A browser-only typing practice application, built in small educational phases
with HTML, plain CSS, and vanilla JavaScript.

## Open the application

Open `index.html` directly in a browser. No installation, build step, or server is
required.

## Phase 5: polished typing practice

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
- Restart clears the current attempt while retaining the passage and duration.
- New passage cycles through four built-in texts and clears the current attempt
  while retaining the duration.
- Responsive layout with labeled controls and keyboard focus styling.
- Keyboard-scrollable passage panel and full-width action buttons on narrow
  screens. Text input retains the normal text cursor.
- A separate screen-reader status announces readiness, test start, and results;
  per-character feedback stays available visually without live announcements.
- Composing text with an input method starts the clock but only committed text
  is scored. Uncommitted composition is discarded at expiry.
- A JavaScript-disabled message explains why typing and action buttons are
  unavailable when scripting is turned off.

Both buttons work before, during, and after a test. They stop any active timer,
clear input, feedback, and results, unlock duration selection, and focus the
typing area. The next countdown starts only when typing begins again.
The duration selector stays locked after completion until either button is used.

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
4. **Repeat practice** — complete: restart while retaining the duration and load new text.
5. **Polish** — complete: responsive controls, keyboard passage scrolling,
   milestone announcements, composition handling, and browser checks.

Each phase is reviewed before proceeding to the next and can be committed
separately. Suggested phase 5 commit: `feat: polish responsive layout and accessibility`.

## Manual preview checks

- Open the page at desktop and narrow mobile widths; check for horizontal overflow.
- Tab to the duration selector and use the arrow keys to change its value.
- Confirm 60 seconds is selected on initial load.
- Type `Small`: the first five characters should turn green and the following
  space should have a dark underline.
- Type an incorrect character: the matching passage position should be red and
  underlined, and the mistake count should increase. Delete or correct it and
  confirm the feedback updates, including edits in the middle of the input.
- Restart, then select 15 seconds. Confirm selecting or focusing alone does not
  start the test.
- Begin typing: duration selection should lock and the countdown should start.
- Clear the input and confirm the first character is marked as next again while
  the countdown keeps running.
- Reach the end of the original passage: more text should be available and the
  countdown should continue.
- At expiry, confirm the input becomes read-only, remaining time is zero, and
  final WPM and accuracy appear. Restart to try another duration.
- Start a test, switch tabs until its duration has elapsed, and return; the test
  should show results without granting extra typing time.
- Restart during a test and after completion. Confirm input and results clear,
  the same passage and duration remain, and the timer waits for typing.
- Choose a new passage during a test and after completion. Confirm the passage
  changes, the attempt clears, and duration stays selected. Cycle through all
  four passages, then confirm restarting retains the current passage.
- Activate both buttons with the keyboard and confirm focus returns to typing.
- Tab to the passage and use arrow keys to scroll. Confirm focus outlines are
  visible on the passage, duration selector, typing area, and buttons.
- With a screen reader, check readiness, start, and result announcements. The
  live region should not announce each character's progress or each timer tick.
- Disable JavaScript and reload: instructions should explain how to enable the
  test, and typing/action controls should remain disabled.

## Automated checks

With Node.js installed, run `node --test tests/typing.test.cjs`. These tests use
small DOM and clock stubs to check timing, corrections, scoring, empty input,
late input, background delays, passage extension, restarting, and passage
cycling, milestone announcements, text composition, and literal/Unicode input
without real-time waits.
They do not replace visual or browser interaction checks. Node.js is needed
only for these checks; the application itself still runs directly in a browser.

### Browser validation

Phase 5 was checked in headless Chromium at viewport widths of 320, 375, 768,
and 1280 pixels, including a scrollbar-aware horizontal overflow check. Mobile
and desktop screenshots were visually reviewed. Browser interaction checks
covered keyboard tab order, real text insertion, duration locking, expiry,
results, restart focus, and passage switching. Expiry was simulated by advancing
the page clock. No JavaScript exceptions were observed.

Other browser engines, physical mobile keyboards, and actual screen-reader
speech output have not been tested; the manual checks above cover those follow-ups.
