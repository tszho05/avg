import type { StoryChoice, StoryLine } from '../data/story';

const root = document.querySelector<HTMLDivElement>('#ui-root');

export function clearHud() {
  if (root) root.innerHTML = '';
}

export function setStatus(items: string[]) {
  if (!root) return;
  root.querySelector('.status')?.remove();
  const status = document.createElement('div');
  status.className = 'status';
  status.innerHTML = items.map((item) => `<span>${item}</span>`).join('');
  root.append(status);
}

export function showDialogue(line: StoryLine & { choices?: StoryChoice[] }, onChoice: (choice?: StoryChoice) => void) {
  if (!root) return;
  clearHud();
  const hud = document.createElement('div');
  hud.className = 'hud';
  const choiceCount = line.choices?.length ?? 0;
  const choices = line.choices?.length
    ? line.choices.map((choice, index) => `<button data-choice="${index}">${choice.label}</button>`).join('')
    : '<button data-next="true">繼續</button>';

  hud.innerHTML = `
    <section class="dialogue">
      <div class="speaker">${line.speaker}</div>
      <div class="line">${line.text.replace(/\n/g, '<br />')}</div>
      <div class="choices choices-${choiceCount || 1}">${choices}</div>
    </section>
  `;
  root.append(hud);
  hud.querySelectorAll('button').forEach((button) => {
    const hint = line.choices?.[Number(button.getAttribute('data-choice'))]?.hint;
    if (hint) button.title = hint;
    button.addEventListener('pointerup', () => {
      const choiceIndex = button.getAttribute('data-choice');
      onChoice(choiceIndex === null ? undefined : line.choices?.[Number(choiceIndex)]);
    });
  });
}
