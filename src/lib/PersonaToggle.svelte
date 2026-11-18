<script lang="ts">
  import { persona, togglePersona } from '$lib/persona.svelte';

  const isLeo = $derived(persona.current === 'leo');
</script>

<!-- Lives inside the face's own nav, so it turns with the page instead of
     floating above it. The barbuz face puts it on the left, the Leo face on
     the right, so a flip mirrors the two across the bar.

     Before the first flip it is icon-only, an Easter egg: the glyphs hint that
     the site has two faces without explaining the trick, and `press F to flip`
     is the discoverable path. Once flipped, the words barbuz / Leo come in
     (`.flipped`), so a visitor who has crossed over can see which face they
     are on and which one they came from. The barbuz switch is mirrored, which
     is why the labels are counter-mirrored to stay upright. -->
<div class="toggle" class:flipped={persona.hasFlipped}>
  <button
    class="switch"
    type="button"
    role="switch"
    aria-checked={isLeo}
    aria-label={isLeo ? 'Switch to barbuz' : 'Switch to Leo'}
    onclick={togglePersona}
  >
    <span class="switch__thumb" aria-hidden="true"></span>
    <span class="switch__opt" data-opt="barbuz">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <span class="switch__label" aria-hidden="true">barbuz</span>
    </span>
    <span class="switch__opt" data-opt="leo">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
      </svg>
      <span class="switch__label" aria-hidden="true">Leo</span>
    </span>
  </button>
  <div class="hint" hidden={persona.hasFlipped}>press F to flip</div>
</div>