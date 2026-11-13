<script lang="ts">
  import { onMount } from 'svelte';
  import { persona, initPersona, togglePersona, personaLabel } from '$lib/persona.svelte';
  import PersonaFlip from '$lib/PersonaFlip.svelte';
  import PersonaToggle from '$lib/PersonaToggle.svelte';
  import BarbuzFace from '$lib/BarbuzFace.svelte';
  import LeoFace from '$lib/LeoFace.svelte';

  onMount(() => {
    initPersona();

    const onKeydown = (e: KeyboardEvent) => {
      if ((e.key === 'f' || e.key === 'F') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const t = e.target as HTMLElement | null;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
        e.preventDefault();
        togglePersona();
      }
    };
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  });
</script>

<svelte:head>
  <title>{persona.current === 'leo' ? 'Leo Ghignone' : 'barbuz'}</title>
</svelte:head>

<div class="grain"></div>

<div aria-live="polite" class="sr-only">{personaLabel()}</div>

<PersonaToggle />

<PersonaFlip>
  {#snippet barbuz()}
    <BarbuzFace />
  {/snippet}
  {#snippet leo()}
    <LeoFace />
  {/snippet}
</PersonaFlip>
