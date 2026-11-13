<script lang="ts">
  import type { Snippet } from 'svelte';
  import { persona } from '$lib/persona.svelte';

  let { barbuz, leo }: { barbuz: Snippet; leo: Snippet } = $props();

  const isLeo = $derived(persona.current === 'leo');
</script>

<div class="stage">
  <div class="flipper">
    <section
      class="face face--barbuz"
      aria-label="barbuz"
      aria-hidden={isLeo}
      inert={isLeo || undefined}
    >
      {@render barbuz()}
    </section>
    <section
      class="face face--leo"
      aria-label="Leo Ghignone"
      aria-hidden={!isLeo}
      inert={!isLeo || undefined}
    >
      {@render leo()}
    </section>
  </div>
</div>
