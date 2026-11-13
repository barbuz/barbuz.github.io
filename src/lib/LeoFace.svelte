<script lang="ts">
  import { onMount } from 'svelte';
  import { setPersona } from '$lib/persona.svelte';

  let journey: any = $state(null);
  let journeyHost: HTMLDivElement;
  let mapReady = $state(false);

  // MapLibre touches `window` at import time, so it is loaded in the browser only.
  onMount(async () => {
    const mod = await import('$lib/JourneyMap.svelte');
    const { mount } = await import('svelte');
    journey = mount(mod.default, { target: journeyHost });
    mapReady = true;
  });

  const focus = (place: 'italy' | 'australia') => journey?.goToLocation(place);
  const showFill = (place: 'italy' | 'australia') => journey?.showCountryFill(place);
  const hideFill = () => journey?.hideAllFills();
</script>

<div class="wrap">
  <nav class="leo-nav">
    <div class="leo-name">Leo Ghignone</div>
    <div class="leo-links">
      <a href="#about-leo">About</a>
      <a href="#expertise">Expertise</a>
      <a href="#journey">Journey</a>
      <a href="#contact">Contact</a>
    </div>
  </nav>

  <header class="leo-hero">
    <div class="eyebrow reveal" style="animation-delay: 0.05s">Software Engineer</div>
    <h1 class="reveal" style="animation-delay: 0.12s">
      Turning hard data into <em>useful things</em>.
    </h1>
    <p class="reveal" style="animation-delay: 0.2s">
      Full-stack engineer with a PhD in Machine Learning. I work across geospatial data,
      reinforcement learning, and practical LLM systems.
    </p>
    <div class="leo-cta reveal" style="animation-delay: 0.28s">
      <a class="btn btn--leo btn--leo-solid" href="mailto:leo.ghignone@gmail.com">Get in touch</a>
      <a
        class="btn btn--leo"
        href="https://unsworks.unsw.edu.au/bitstreams/29367c76-5c06-475f-823a-68abe57dd763/download"
        target="_blank"
        rel="noopener">Read the thesis ↗</a
      >
    </div>
  </header>

  <section class="section" id="about-leo">
    <div class="section__head">
      <h2>About</h2>
    </div>
    <div class="prose">
      <p>
        I'm a passionate software engineer with a PhD in Machine Learning, where my research focused
        on efficient Reinforcement Learning for Swarm systems. My interdisciplinary skills let me
        move from complex data problems to shipped applications.
      </p>
      <p>
        As a full-stack developer and open-source advocate, I build robust, scalable solutions —
        geospatial analysis with cloud-optimized formats like GeoParquet and Zarr, advanced ML, and
        practical LLM deployment with local models.
      </p>
    </div>
  </section>

  <section class="section" id="expertise">
    <div class="section__head">
      <h2>Core Expertise</h2>
      <span class="eyebrow">03</span>
    </div>
    <div class="leo-grid">
      <div class="leo-card reveal" style="animation-delay: 0.08s">
        <div class="leo-card__k">Geospatial</div>
        <h3>Geospatial Data</h3>
        <p>Cloud-optimized formats (GeoParquet, Zarr), spatial analysis, and GIS for insight at scale.</p>
      </div>
      <div class="leo-card reveal" style="animation-delay: 0.16s">
        <div class="leo-card__k">Machine Learning</div>
        <h3>Reinforcement Learning</h3>
        <p>PhD-level work in RL for swarm systems, predictive modelling, and applied ML.</p>
      </div>
      <div class="leo-card reveal" style="animation-delay: 0.24s">
        <div class="leo-card__k">LLM &amp; Open Source</div>
        <h3>Local LLMs</h3>
        <p>Deployment with Ollama, prompt engineering, and full-stack open-source systems.</p>
      </div>
    </div>
  </section>

  <section class="section" id="journey">
    <div class="section__head">
      <h2>My Journey</h2>
    </div>
    <p class="journey__note">
      From my roots in
      <button
        type="button"
        class="journey__link"
        onclick={() => focus('italy')}
        onmouseenter={() => showFill('italy')}
        onmouseleave={hideFill}>Italy</button
      > to my current life in
      <button
        type="button"
        class="journey__link"
        onclick={() => focus('australia')}
        onmouseenter={() => showFill('australia')}
        onmouseleave={hideFill}>Australia</button
      > — a journey that shaped my global perspective.
    </p>
    <div class="journey-map" bind:this={journeyHost} class:ready={mapReady}></div>
  </section>

  <section class="section" id="contact">
    <div class="section__head">
      <h2>Get in Touch</h2>
    </div>
    <div class="prose">
      <p>Open to collaboration, freelance, and interesting problems.</p>
    </div>
    <div class="leo-cta">
      <a class="btn btn--leo btn--leo-solid" href="mailto:leo.ghignone@gmail.com">Email</a>
      <a class="btn btn--leo" href="https://github.com/barbuz" target="_blank" rel="noopener">GitHub ↗</a>
      <a
        class="btn btn--leo"
        href="?barbuz"
        onclick={(e) => {
          e.preventDefault();
          setPersona('barbuz');
        }}>← Back to barbuz</a
      >
    </div>
  </section>

  <footer class="leo-foot">
    <span>© 2026 Leo Ghignone</span>
    <span
      ><a
        href="?barbuz"
        onclick={(e) => {
          e.preventDefault();
          setPersona('barbuz');
        }}>barbuz ↗</a
      ></span
    >
  </footer>
</div>
