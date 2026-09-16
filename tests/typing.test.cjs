// Run with node --test. A small DOM and clock stub keeps these tests dependency-free.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const passage = html.match(/<p id="sample-text"[^>]*>([^<]+)<\/p>/)[1];
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

function setup() {
  let now = 1000;
  let tick;
  const elements = {};
  for (const id of ['sample-text', 'typing-input', 'typing-progress', 'duration',
    'time-remaining', 'typing-speed', 'typing-accuracy']) {
    elements[id] = {
      textContent: '', value: '', disabled: false, readOnly: false,
      children: [], clientHeight: 220, events: {},
      addEventListener(event, callback) { this.events[event] = callback; },
      replaceChildren() { this.children = []; },
      append(child) { this.children.push(child); }
    };
  }
  elements['sample-text'].textContent = passage;
  elements.duration.value = '60';
  const documentEvents = {};
  vm.runInNewContext(script, {
    document: {
      querySelector: selector => elements[selector.slice(1)],
      createElement: () => ({ textContent: '', className: '', offsetTop: 0 }),
      addEventListener: (name, callback) => { documentEvents[name] = callback; }
    },
    Date: { now: () => now },
    setInterval: callback => { tick = callback; return 1; },
    clearInterval: () => { tick = undefined; }
  });
  return {
    elements,
    type(value) { elements['typing-input'].value = value; elements['typing-input'].events.input(); },
    select(value) { elements.duration.value = String(value); elements.duration.events.change(); },
    advance(ms, runTimer = true) { now += ms; if (runTimer && tick) tick(); },
    returnToTab() { documentEvents.visibilitychange(); },
    hasTimer: () => Boolean(tick)
  };
}

test('waits for input and starts a single countdown with the selected duration', () => {
  const app = setup();
  assert.equal(app.elements['time-remaining'].textContent, '60');
  for (const seconds of [15, 30, 60, 120]) {
    app.select(seconds);
    assert.equal(app.elements['time-remaining'].textContent, String(seconds));
  }
  app.select(15);
  app.type('');
  assert.equal(app.hasTimer(), false);
  app.advance(5000);
  app.type('S');
  assert.equal(app.elements.duration.disabled, true);
  app.advance(1000);
  assert.equal(app.elements['time-remaining'].textContent, '14');
  app.type('Small');
  app.advance(14000);
  assert.equal(app.elements['time-remaining'].textContent, '0');
  assert.equal(app.elements['typing-input'].readOnly, true);
  assert.equal(app.elements['typing-speed'].textContent, '4');
  assert.equal(app.elements['typing-accuracy'].textContent, '100');
  assert.equal(app.hasTimer(), false);
});

test('scores remaining text and updates corrections, spaces, and middle edits', () => {
  const app = setup();
  app.type('Sxall ');
  assert.equal(app.elements['sample-text'].children[1].className, 'character-incorrect');
  app.type('Small ');
  assert.equal(app.elements['sample-text'].children[1].className, 'character-correct');
  assert.equal(app.elements['sample-text'].children[5].className, 'character-correct');
  app.type('Smalx');
  app.advance(60000);
  assert.equal(app.elements['typing-accuracy'].textContent, '80');
  assert.equal(app.elements['typing-speed'].textContent, '1');
});

test('clearing input does not reset the timer and empty results are zero', () => {
  const app = setup();
  app.type('S');
  app.advance(30000);
  app.type('');
  app.advance(30000);
  assert.equal(app.elements['typing-speed'].textContent, '0');
  assert.equal(app.elements['typing-accuracy'].textContent, '0');
});

test('rejects input at the deadline before a delayed timer callback', () => {
  const app = setup();
  app.select(15);
  app.type('S');
  app.advance(15000, false);
  app.type('Small');
  assert.equal(app.elements['typing-input'].value, 'S');
  assert.equal(app.elements['typing-speed'].textContent, '1');
  app.type('Small steps');
  assert.equal(app.elements['typing-input'].value, 'S');
});

test('returning to a background tab uses the deadline, not callback count', () => {
  const app = setup();
  app.type('Small');
  app.advance(90000, false);
  app.returnToTab();
  assert.equal(app.elements['time-remaining'].textContent, '0');
  assert.equal(app.elements['typing-input'].readOnly, true);
  assert.equal(app.elements['typing-speed'].textContent, '1');
});

test('supplies more text without ending the test or losing earlier feedback', () => {
  const app = setup();
  const input = `${passage} ${passage} ${passage}`;
  app.type(input);
  const spans = app.elements['sample-text'].children;
  assert(spans.length >= input.length + passage.length);
  assert(spans.slice(0, input.length).every(span => span.className === 'character-correct'));
  assert.equal(spans[input.length].className, 'character-next');
  assert.equal(app.elements['typing-input'].readOnly, false);
  app.advance(60000);
  assert.equal(app.elements['typing-accuracy'].textContent, '100');
  assert.equal(app.elements['typing-speed'].textContent, String(Math.round(input.length / 5)));
  assert(!spans.some(span => span.className === 'character-next'));
});
