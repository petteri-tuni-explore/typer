const sampleText = document.querySelector('#sample-text');
const typingInput = document.querySelector('#typing-input');
const typingProgress = document.querySelector('#typing-progress');
const passage = sampleText.textContent;

// Create one span per character so each can have its own feedback style.
const characters = Array.from(passage, (character) => {
  const span = document.createElement('span');
  span.textContent = character;
  return span;
});
sampleText.replaceChildren(...characters);

function updateTypingFeedback() {
  const typedCharacters = Array.from(typingInput.value);
  let correctCount = 0;
  // Characters typed beyond the passage also count as mistakes.
  let mistakeCount = Math.max(0, typedCharacters.length - characters.length);

  characters.forEach((span, index) => {
    span.className = '';

    if (index < typedCharacters.length) {
      if (typedCharacters[index] === span.textContent) {
        span.className = 'character-correct';
        correctCount += 1;
      } else {
        span.className = 'character-incorrect';
        mistakeCount += 1;
      }
    } else if (index === typedCharacters.length) {
      span.className = 'character-next';
    }
  });

  const summary = `${correctCount} / ${characters.length} characters correct · ${mistakeCount} mistakes`;
  if (typedCharacters.length >= characters.length) {
    typingProgress.textContent = mistakeCount === 0
      ? `${summary} · Passage complete! Clear the typing area to practice again.`
      : `${summary} · End of passage reached. Correct your mistakes to finish.`;
  } else {
    typingProgress.textContent = summary;
  }
}

// The input event also handles deletion, pasted text, and edits in the middle.
typingInput.addEventListener('input', updateTypingFeedback);
updateTypingFeedback();
