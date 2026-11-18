<script lang="ts">
  import { onMount } from 'svelte';
  import { setPersona } from '$lib/persona.svelte';
  import PersonaToggle from '$lib/PersonaToggle.svelte';

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
    <div class="leo-right">
      <div class="leo-links">
        <a href="#about-leo">About</a>
        <a href="#experience">Experience</a>
        <a href="#expertise">Expertise</a>
        <a href="#publications">Publications</a>
        <a href="#journey">Journey</a>
        <a href="#community">Community</a>
        <a href="#contact">Contact</a>
      </div>
      <PersonaToggle />
    </div>
  </nav>

  <header class="leo-hero">
    <div class="eyebrow reveal" style="animation-delay: 0.05s">Software Engineer</div>
    <h1 class="reveal" style="animation-delay: 0.12s">
      Turning hard data into <em>useful things</em>.
    </h1>
    <p class="reveal" style="animation-delay: 0.2s">
      Full-stack engineer with a PhD in Artificial Intelligence. I work across geospatial data,
      reinforcement learning, and practical LLM systems.
    </p>
    <div class="leo-cta reveal" style="animation-delay: 0.28s">
      <a class="btn btn--leo btn--leo-solid" href="mailto:leo.ghignone@gmail.com">Get in touch</a>
    </div>
  </header>

  <section class="section" id="about-leo">
    <div class="section__head">
      <h2>About</h2>
    </div>
    <div class="prose">
      <p>
        I'm a software engineer with a PhD in Artificial Intelligence, where my research was about efficient
        reinforcement learning for swarm systems — many small agents learning to cooperate, cheap
        enough to run on simple hardware. I build across the stack, and I like a project that ends in
        something people actually use.
      </p>
      <p>
        As a full-stack developer and open-source advocate, I build geospatial tooling on
        cloud-optimised formats like GeoParquet and Zarr, apply machine learning where it earns its
        place, and run LLMs locally or in the cloud, whichever fits the project.
      </p>
    </div>
  </section>

  <section class="section" id="experience">
    <div class="section__head">
      <h2>Experience</h2>
    </div>
    <ul class="cv-list">
      <li class="cv-item reveal" style="animation-delay: 0.08s">
        <div class="cv-when">2025–2026</div>
        <div class="cv-body">
          <h3>Senior Software Engineer <span class="cv-org">· UNSW Canberra</span></h3>
          <p>
            Led a small team building tools for under-resourced organisations, and designed AI
            systems that make sense of unstructured input.
          </p>
        </div>
      </li>
      <li class="cv-item reveal" style="animation-delay: 0.12s">
        <div class="cv-when">2023–2025</div>
        <div class="cv-body">
          <h3>Data Engineer <span class="cv-org">· IMOS</span></h3>
          <p>
            Built the ingestion pipelines that turn heterogeneous ocean datasets into cloud-optimised
            formats, for the Great Barrier Reef Data Management System.
          </p>
        </div>
      </li>
      <li class="cv-item reveal" style="animation-delay: 0.16s">
        <div class="cv-when">2017–2024</div>
        <div class="cv-body">
          <h3>PhD, Deep Reinforcement Learning for Swarm Systems <span class="cv-org">· UNSW Canberra</span></h3>
          <p>
            Designed deep reinforcement learning algorithms for swarms of small agents, and measured
            the memory and time each approach costs to run.
          </p>
        </div>
      </li>
    </ul>
  </section>

  <section class="section" id="expertise">
    <div class="section__head">
      <h2>Core Expertise</h2>
    </div>
    <div class="leo-grid">
      <div class="leo-card reveal" style="animation-delay: 0.08s">
        <h3>Geospatial Data</h3>
        <p>Cloud-optimised formats (GeoParquet, Zarr), spatial analysis, and GIS for insight at scale.</p>
      </div>
      <div class="leo-card reveal" style="animation-delay: 0.16s">
        <h3>Reinforcement Learning</h3>
        <p>PhD-level work in RL for swarm systems, predictive modelling, and applied ML.</p>
      </div>
      <div class="leo-card reveal" style="animation-delay: 0.24s">
        <h3>Local or Cloud LLMs</h3>
        <p>Running models with Ollama and OpenHands, prompt engineering, and full-stack open-source systems.</p>
      </div>
    </div>
  </section>

  <section class="section" id="publications">
    <div class="section__head">
      <h2>Publications</h2>
      <a class="section__link" href="https://scholar.google.com/citations?user=kpNTZ3IAAAAJ" target="_blank" rel="noopener">Google Scholar ↗</a>
    </div>
    <ul class="pub-list">
      <li class="pub-item">
        <div class="pub-year">2026</div>
        <div class="pub-body">
          <a class="pub-title" href="https://biss.pensoft.net/article/185022/download/pdf/" target="_blank" rel="noopener"
            >GBR Data Management System: A One-Stop Shop to Great Barrier Reef Data ↗</a
          >
          <div class="pub-meta">Biodiversity Information Science and Standards</div>
        </div>
      </li>
      <li class="pub-item">
        <div class="pub-year">2024</div>
        <div class="pub-body">
          <a class="pub-title" href="https://doi.org/10.26190/unsworks/30505" target="_blank" rel="noopener"
            >Reinforcement Learning for Swarm Systems ↗</a
          >
          <div class="pub-meta">PhD thesis · UNSW Canberra</div>
        </div>
      </li>
      <li class="pub-item">
        <div class="pub-year">2023</div>
        <div class="pub-body">
          <a
            class="pub-title"
            href="https://doi.org/10.1109/pree57903.2023.10370420"
            target="_blank"
            rel="noopener">Wind-speed Forecasting based on Smoothing Ensemble Empirical Mode Decomposition and LSTM ↗</a
          >
          <div class="pub-meta">International Conference on Power and Renewable Energy Engineering</div>
        </div>
      </li>
      <li class="pub-item">
        <div class="pub-year">2022</div>
        <div class="pub-body">
          <a class="pub-title" href="https://www.frontiersin.org/articles/10.3389/frobt.2022.745958/pdf" target="_blank" rel="noopener"
            >Characterisation of Indicators for Adaptive Human-Swarm Teaming ↗</a
          >
          <div class="pub-meta">Frontiers in Robotics and AI</div>
        </div>
      </li>
    </ul>
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
      > to my study and work in
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

  <section class="section" id="community">
    <div class="section__head">
      <h2>Community</h2>
    </div>
    <ul class="cv-list">
      <li class="cv-item reveal" style="animation-delay: 0.08s">
        <div class="cv-when">2024–2025</div>
        <div class="cv-body">
          <h3>Organiser <span class="cv-org">· FOSS4G</span></h3>
          <p>
            Part of the team behind the global conference for open-source geospatial software —
            <a href="https://2024.foss4g-oceania.org/" target="_blank" rel="noopener">FOSS4G SotM Oceania 2024 ↗</a>
            and <a href="https://2025.foss4g.org/" target="_blank" rel="noopener">FOSS4G 2025 ↗</a>.
          </p>
        </div>
      </li>
      <li class="cv-item reveal" style="animation-delay: 0.12s">
        <div class="cv-when">2024</div>
        <div class="cv-body">
          <h3>ON Prime <span class="cv-org">· CSIRO</span></h3>
          <p>
            Took the <a href="https://research.csiro.au/onalumni/foresight/" target="_blank" rel="noopener">ForeSight ↗</a>
            wind-forecasting project through CSIRO's research-to-product program, where the team won
            best in cohort.
          </p>
        </div>
      </li>
    </ul>
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
