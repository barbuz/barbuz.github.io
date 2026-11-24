<script lang="ts">
  import Wordmark from '$lib/Wordmark.svelte';

  const TIP_URL = 'https://donate.stripe.com/9B6eVd1madcF8Dt8yp1gs00';
</script>

<svelte:head>
  <title>thanks — barbuz</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<!-- `face--barbuz` is the token scope, not a layout: it carries the palette
     variables and the atmosphere. The page is outside the flip shell, so it
     opts into the face's colours directly rather than duplicating them. -->
<div class="thanks face--barbuz">
  <header class="thanks__nav">
    <Wordmark height={24} />
  </header>

  <main class="thanks__main">
    <span class="eyebrow">// no further action</span>
    <h1>thanks</h1>
    <p>
      That one's appreciated. No account, no subscription, nothing to cancel — that's the whole
      point.
    </p>
    <p>
      If you didn't just pay, no harm — <a href={TIP_URL}>the tip jar is still open</a>.
    </p>
    <div class="thanks__cta">
      <a class="btn btn--solid" href="/#apps">the apps</a>
      <a class="btn" href="https://github.com/barbuz" target="_blank" rel="noopener">GitHub ↗</a>
    </div>
  </main>

  <footer class="foot thanks__foot">
    <span>barbuz</span>
    <span
      ><a href="https://github.com/barbuz" target="_blank" rel="noopener">github.com/barbuz</a
      ></span
    >
    <span>© 2026</span>
  </footer>
</div>

<style>
  /* A dead end, not a scroll: the page is one screen and the content sits in
     the middle of it. `dvh` tracks the mobile browser's collapsing chrome,
     which `vh` does not. */
  .thanks {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    background-color: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    padding: 0 4vw;
  }

  .thanks__nav {
    width: min(1080px, 100%);
    margin: 0 auto;
    padding-top: 1.6rem;
  }

  .thanks__main {
    width: min(1080px, 100%);
    margin: auto;
    padding: 3rem 0;
  }

  .thanks__main h1 {
    font-family: var(--font-display);
    font-weight: var(--font-display-weight);
    font-size: clamp(3.2rem, 11vw, 7rem);
    line-height: 0.94;
    letter-spacing: -0.04em;
    margin: 0.5rem 0 0;
  }

  .thanks__main p {
    max-width: 46ch;
    color: var(--muted);
    font-size: clamp(1rem, 1.5vw, 1.15rem);
    line-height: 1.6;
    margin: 1.2rem 0 0;
  }

  /* Matches `.prose a` on the landing page: the same destination should not
     look like two different things on two pages of one site. The accent clears
     3:1 against the night ground (5.03:1), so the underline carries meaning
     safely; `--line` at 1.38:1 would not. */
  .thanks__main p a {
    color: var(--accent);
    text-underline-offset: 3px;
    transition: color 0.2s ease;
  }

  .thanks__main p a:hover {
    color: var(--text);
  }

  .thanks__cta {
    display: flex;
    gap: 0.8rem;
    flex-wrap: wrap;
    margin-top: 2.2rem;
  }

  .thanks__foot {
    width: min(1080px, 100%);
    margin: 0 auto;
    padding-bottom: 2.4rem;
  }
</style>
