const sampleText = document.querySelector('#sample-text');
const typingInput = document.querySelector('#typing-input');
const typingProgress = document.querySelector('#typing-progress');
const testStatus = document.querySelector('#test-status');
const durationSelect = document.querySelector('#duration');
const timeRemaining = document.querySelector('#time-remaining');
const typingSpeed = document.querySelector('#typing-speed');
const typingAccuracy = document.querySelector('#typing-accuracy');
const restartButton = document.querySelector('#restart-test');
const newPassageButton = document.querySelector('#new-passage');
const passages = [
  sampleText.textContent,
  'The morning light falls across the kitchen table. A cup of tea waits beside an open book, and the street outside is quiet. Before the day becomes busy, take a moment to notice the small things around you.',
  'A path through the woods leads to a peaceful lake. Birds call from the branches as the wind moves through the leaves. Near the water, a wooden bench offers a place to rest and watch the clouds drift by.',
  'Learning something new begins with a question. Try a simple idea, observe what happens, and make a small change. Each attempt teaches you a little more, and every useful mistake helps you decide what to try next.'
];
let passageIndex = 0;
let passage = passages[passageIndex];

const characters = [];
let state = 'ready';
let durationSeconds = Number(durationSelect.value);
let deadline = 0;
let timerId;
let acceptedInput = '';

// Repeat the passage as needed so reaching its end never ends a timed test.
function appendPassage() {
  const text = characters.length === 0 ? passage : ` ${passage}`;
  for (const character of text) {
    const span = document.createElement('span');
    span.textContent = character;
    characters.push(span);
    sampleText.append(span);
  }
}

function updateTypingFeedback() {
  const typedCharacters = Array.from(acceptedInput);
  // Keep at least one full passage ahead of the user's position.
  while (characters.length < typedCharacters.length + passage.length) {
    appendPassage();
  }
  let correctCount = 0;

  characters.forEach((span, index) => {
    span.className = '';

    if (index < typedCharacters.length) {
      if (typedCharacters[index] === span.textContent) {
        span.className = 'character-correct';
        correctCount += 1;
      } else {
        span.className = 'character-incorrect';
      }
    } else if (index === typedCharacters.length && state !== 'finished') {
      span.className = 'character-next';
    }
  });

  const mistakeCount = typedCharacters.length - correctCount;
  const summary = `${correctCount} characters correct · ${mistakeCount} mistakes`;
  if (state === 'finished') {
    // Standard WPM uses five characters per word, including spaces.
    const wpm = Math.round((correctCount / 5) / (durationSeconds / 60));
    const accuracy = typedCharacters.length === 0
      ? 0
      : Math.round((correctCount / typedCharacters.length) * 100);
    typingSpeed.textContent = String(wpm);
    typingAccuracy.textContent = String(accuracy);
    typingProgress.textContent = `Time is up! ${wpm} WPM · ${accuracy}% accuracy · ${summary}. Restart or choose a new passage to practice again.`;
  } else {
    typingProgress.textContent = state === 'ready'
      ? 'Ready when you are. Type the first character to start.'
      : summary;
    // Scroll only the passage panel to keep the next character visible.
    const nextCharacter = characters[typedCharacters.length];
    sampleText.scrollTop = Math.max(0, nextCharacter.offsetTop - sampleText.clientHeight / 2);
  }
}

function finishTest() {
  state = 'finished';
  clearInterval(timerId);
  timeRemaining.textContent = '0';
  typingInput.readOnly = true;
  // Discard any uncommitted text from an input method at the deadline.
  typingInput.value = acceptedInput;
  updateTypingFeedback();
  testStatus.textContent = typingProgress.textContent;
}

function updateTimer() {
  if (state !== 'running') return;
  // An absolute deadline prevents delayed callbacks from extending the test.
  const millisecondsLeft = deadline - Date.now();
  if (millisecondsLeft <= 0) {
    finishTest();
  } else {
    timeRemaining.textContent = String(Math.ceil(millisecondsLeft / 1000));
  }
}

function handleInput(event) {
  // Reject late input even if the next timer callback has not run yet.
  if (state === 'finished' || (state === 'running' && Date.now() >= deadline)) {
    typingInput.value = acceptedInput;
    if (state === 'running') finishTest();
    return;
  }

  if (state === 'ready' && typingInput.value.length > 0) {
    state = 'running';
    durationSeconds = Number(durationSelect.value);
    deadline = Date.now() + durationSeconds * 1000;
    durationSelect.disabled = true;
    testStatus.textContent = `Test started. ${durationSeconds} seconds. Results will be announced when time runs out.`;
    timerId = setInterval(updateTimer, 100);
    updateTimer();
  }
  // Composition text is provisional until the input method commits it.
  if (event && event.isComposing) return;
  acceptedInput = typingInput.value;
  updateTypingFeedback();
}

// Both practice actions return to ready without changing the chosen duration.
function resetTest() {
  clearInterval(timerId);
  timerId = undefined;
  state = 'ready';
  deadline = 0;
  acceptedInput = '';
  durationSeconds = Number(durationSelect.value);
  durationSelect.disabled = false;
  typingInput.value = '';
  typingInput.readOnly = false;
  typingInput.scrollTop = 0;
  timeRemaining.textContent = String(durationSeconds);
  typingSpeed.textContent = '—';
  typingAccuracy.textContent = '—';
  characters.length = 0;
  sampleText.replaceChildren();
  appendPassage();
  sampleText.scrollTop = 0;
  updateTypingFeedback();
  testStatus.textContent = `Passage ${passageIndex + 1} of ${passages.length}. Ready for a ${durationSeconds}-second test. Type to start.`;
}

restartButton.addEventListener('click', () => {
  resetTest();
  typingInput.focus();
});

newPassageButton.addEventListener('click', () => {
  // Cycle in order: every click gives a different passage, with no randomness.
  passageIndex = (passageIndex + 1) % passages.length;
  passage = passages[passageIndex];
  resetTest();
  typingInput.focus();
});

durationSelect.addEventListener('change', () => {
  if (state === 'ready') {
    durationSeconds = Number(durationSelect.value);
    timeRemaining.textContent = String(durationSeconds);
  }
});

// Input handles typing, deletion, pasted text, and edits in the middle.
typingInput.addEventListener('input', handleInput);
typingInput.addEventListener('compositionend', handleInput);
document.addEventListener('visibilitychange', () => {
  if (state === 'running') updateTimer();
});

resetTest();
typingInput.disabled = false;
restartButton.disabled = false;
newPassageButton.disabled = false;
