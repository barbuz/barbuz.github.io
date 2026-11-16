<script lang="ts">
  import { lockupSvg, color } from '../../brand/mark.mjs';

  interface Props {
    /**
     * Rendered height in px. The width follows the lockup's own aspect.
     *
     * 28px clears the node device's legibility floor. The word's stroke is
     * thinner than the mark's, so its knockouts (0.84 x stroke, i.e. 0.068 x
     * this height) are what set the floor: they fall below the ~1.7px the 16px
     * favicon opts out at under ~25px, and only the mark's would read. At 28px
     * the word's are ~1.9px. Below that, either drop `nodes` or expect only the
     * mark's nodes to resolve.
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
