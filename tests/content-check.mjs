import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(
  new URL('../sections/01-preview.html', import.meta.url),
  'utf8',
);

const requiredCopy = [
  'A basic chatbot mainly answers. An agent can take actions to complete a task.',
  'You describe the goal and what &ldquo;done&rdquo; looks like.',
  'It works step by step, checking progress as it goes.',
  'It stops when the task is done, blocked, or needs your input.',
  'Think of an agent as three parts.',
  'Understands the situation and chooses the next step.',
  'Let it get information and take action.',
  'Keeps context, returns results, and repeats or stops.',
  'The model decides. Tools act. The loop connects them.',
  'Reason, act, observe. Repeat as needed.',
  'Model, tools, and loop work together.',
];

for (const text of requiredCopy) {
  assert.ok(source.includes(text), `Missing approved teaching copy: ${text}`);
}

const rejectedCopy = [
  'An agent does the work for you.',
  'Not the steps.',
  'until the goal is met.',
  'An agent has two parts.',
  'That is all it can do.',
  'Repeat until done.',
  'Chatbots give answers. Agents give results.',
];

for (const text of rejectedCopy) {
  assert.ok(!source.includes(text), `Over-absolute teaching copy remains: ${text}`);
}

assert.equal(
  (source.match(/class="[^"]*\bagent-part\b[^"]*"/g) ?? []).length,
  3,
  'The What’s inside diagram should contain exactly three agent parts.',
);

console.log('Agent teaching copy is accurate and concise.');
