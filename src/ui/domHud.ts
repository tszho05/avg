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

export function showTouchPad(onDirection: (x: number, y: number) => void) {
  if (!root) return;
  root.querySelector('.touch-pad')?.remove();
  const pad = document.createElement('div');
  pad.className = 'touch-pad';
  pad.innerHTML = `
    <button class="touch-key touch-up" data-x="0" data-y="-1" aria-label="向上">▲</button>
    <button class="touch-key touch-left" data-x="-1" data-y="0" aria-label="向左">◀</button>
    <button class="touch-key touch-right" data-x="1" data-y="0" aria-label="向右">▶</button>
    <button class="touch-key touch-down" data-x="0" data-y="1" aria-label="向下">▼</button>
  `;
  root.append(pad);

  pad.querySelectorAll<HTMLButtonElement>('.touch-key').forEach((button) => {
    const x = Number(button.dataset.x ?? 0);
    const y = Number(button.dataset.y ?? 0);
    const start = (event: PointerEvent) => {
      event.preventDefault();
      button.setPointerCapture?.(event.pointerId);
      onDirection(x, y);
    };
    const stop = (event: PointerEvent) => {
      event.preventDefault();
      onDirection(0, 0);
    };
    button.addEventListener('pointerdown', start);
    button.addEventListener('pointerup', stop);
    button.addEventListener('pointercancel', stop);
    button.addEventListener('lostpointercapture', () => onDirection(0, 0));
  });
}

export function clearTouchPad() {
  root?.querySelector('.touch-pad')?.remove();
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
