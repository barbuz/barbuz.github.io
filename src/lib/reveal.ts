import { browser } from '$app/environment';

/**
 * Reveal `.reveal` elements as they come into view, instead of all at once on
 * load. Elements already in view animate immediately, with their stagger delay.
 *
 * The hidden state is gated on `html.js`, set pre-paint in `app.html`, so the
 * content is never hidden without the JS that reveals it.
 */
export function initReveal() {
  if (!browser) return;

  let pending = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
  if (pending.length === 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (const el of pending) el.classList.add('reveal--in');
    return;
  }

  let ticking = false;

  const detach = () => {
    document.removeEventListener('scroll', onScroll, true);
    window.removeEventListener('resize', onScroll);
  };

  const check = () => {
    ticking = false;
    const vh = window.innerHeight;
    const still: HTMLElement[] = [];

    for (const el of pending) {
      const r = el.getBoundingClientRect();
      // Reveal once the element starts to enter from below, or once it has been
      // scrolled past. The second case is why this is not an IntersectionObserver:
      // jumping to an anchor moves an element from below the viewport to above it
      // without its intersection ratio ever changing, so the observer never fires
      // and the element would stay invisible for good.
      if (r.top < vh || r.bottom <= 0) el.classList.add('reveal--in');
      else still.push(el);
    }

    pending = still;
    if (pending.length === 0) detach();
  };

  // `scroll` does not bubble, but it can be captured at the document, which
  // catches both the window and the `.face` scroll containers.
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(check);
  };

  document.addEventListener('scroll', onScroll, { capture: true, passive: true });
  window.addEventListener('resize', onScroll);
  check();
}
