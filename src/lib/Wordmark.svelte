<script lang="ts">
  import { lockupSvg, color } from '../../brand/mark.mjs';

  interface Props {
    /**
     * Rendered height in px. The width follows the lockup's own aspect.
     *
     * This is a sizing default, not a device threshold — the node device is on
     * at every height. 28px is chosen so the word's knockouts (0.84 x stroke,
     * i.e. 0.068 x this height) stay near 1.9px: the word's stroke is thinner
     * than the mark's, so its knockouts are the smallest thing the lockup draws
     * and the first to turn to texture as it shrinks.
     */
    height?: number;
    /**
     * The node device (knockout + ring). On by default: the device ships with
     * the mark, and the lockup is the same device the icon set carries.
     */
    nodes?: boolean;
    label?: string;
  }

  let { height = 28, nodes = true, label = 'barbuz' }: Props = $props();

  // The mark stands in for the first `b`, so the word beside it is `arbuz`.
  // The id keeps the node masks from colliding if two lockups share a page.
  const id = $props.id();
  const svg = $derived(
    lockupSvg({
      name: label,
      ink: color.barbuz.text,
      accent: color.barbuz.accent,
      nodes,
      id
    })
  );
</script>

<span class="wordmark" role="img" aria-label={label} style="--wm-height: {height}px">
  {@html svg}
</span>

<style>
  .wordmark {
    display: inline-flex;
    align-items: center;
  }

  .wordmark :global(svg) {
    display: block;
    height: var(--wm-height);
    width: auto;
  }
</style>
