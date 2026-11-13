import { browser } from '$app/environment';

export type Persona = 'barbuz' | 'leo';

const THEME_COLOR: Record<Persona, string> = {
  barbuz: '#0A0E17',
  leo: '#FAF8F3'
};

const TITLE: Record<Persona, string> = {
  barbuz: 'barbuz',
  leo: 'Leo Ghignone'
};

class PersonaState {
  current = $state<Persona>('barbuz');
  hasFlipped = $state(false);
}

export const persona = new PersonaState();

function apply(p: Persona) {
  if (!browser) return;
  document.documentElement.dataset.persona = p;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[p]);
  document.title = TITLE[p];
}

/** Read the persona chosen by the pre-paint script in app.html, then arm animations. */
export function initPersona() {
  if (!browser) return;
  persona.current = document.documentElement.dataset.persona === 'leo' ? 'leo' : 'barbuz';
  apply(persona.current);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.documentElement.classList.remove('no-anim'));
  });
}

export function setPersona(next: Persona, updateUrl = true) {
  persona.current = next;
  if (updateUrl && browser) {
    const url = new URL(location.href);
    // barbuz is the default, so it needs no parameter at all: clean "/".
    history.replaceState(null, '', url.pathname + (next === 'leo' ? '?leo' : '') + url.hash);
  }
  apply(next);
  persona.hasFlipped = true;
}

export function togglePersona() {
  setPersona(persona.current === 'leo' ? 'barbuz' : 'leo');
}

export function personaLabel(): string {
  return persona.current === 'leo' ? 'Leo Ghignone' : 'barbuz';
}
