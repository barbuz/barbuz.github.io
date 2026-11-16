<script lang="ts">
  import { lockupSvg, color } from '../../brand/mark.mjs';

  interface Props {
    /** Rendered height in px. The width follows the lockup's own aspect. */
    height?: number;
    /**
     * The node device (knockout + ring). Off by default: at nav size the
     * word's holes fall under the legibility floor, as with the 16px favicon.
     */
    nodes?: boolean;
    label?: string;
  }

  let { height = 22, nodes = false, label = 'barbuz' }: Props = $props();

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
