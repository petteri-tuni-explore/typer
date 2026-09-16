const sampleText = document.querySelector('#sample-text');
const typingInput = document.querySelector('#typing-input');
const typingProgress = document.querySelector('#typing-progress');
const durationSelect = document.querySelector('#duration');
const timeRemaining = document.querySelector('#time-remaining');
const typingSpeed = document.querySelector('#typing-speed');
const typingAccuracy = document.querySelector('#typing-accuracy');
const passage = sampleText.textContent;

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
    typingProgress.textContent = `Time is up! ${wpm} WPM · ${accuracy}% accuracy · ${summary}. Reload to practice again.`;
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
  updateTypingFeedback();
}

function updateTimer() {
  // An absolute deadline prevents delayed callbacks from extending the test.
  const millisecondsLeft = deadline - Date.now();
  if (millisecondsLeft <= 0) {
    finishTest();
  } else {
    timeRemaining.textContent = String(Math.ceil(millisecondsLeft / 1000));
  }
}

function handleInput() {
  // Reject late input even if the next timer callback has not run yet.
  if (state === 'finished' || (state === 'running' && Date.now() >= deadline)) {
    typingInput.value = acceptedInput;
    if (state === 'running') finishTest();
    return;
  }

  acceptedInput = typingInput.value;
  if (state === 'ready' && acceptedInput.length > 0) {
    state = 'running';
    durationSeconds = Number(durationSelect.value);
    deadline = Date.now() + durationSeconds * 1000;
    durationSelect.disabled = true;
    timerId = setInterval(updateTimer, 100);
    updateTimer();
  }
  updateTypingFeedback();
}

durationSelect.addEventListener('change', () => {
  if (state === 'ready') {
    durationSeconds = Number(durationSelect.value);
    timeRemaining.textContent = String(durationSeconds);
  }
});

// Input handles typing, deletion, pasted text, and edits in the middle.
typingInput.addEventListener('input', handleInput);
document.addEventListener('visibilitychange', () => {
  if (state === 'running') updateTimer();
});

sampleText.replaceChildren();
appendPassage();
timeRemaining.textContent = String(durationSeconds);
updateTypingFeedback();
