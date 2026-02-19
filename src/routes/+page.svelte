<script lang="ts">
	import { Mail, Linkedin, MapPin, Code, Brain, Cpu, ChevronDown } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import JourneyMap from '$lib/JourneyMap.svelte';

	let JourneyMapComponent: any;
	let scrolled = false;

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function scrollToSection(sectionId: string) {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<svelte:head>
	<title>Leo Ghignone - Software Engineer</title>
	<meta name="description" content="Leo Ghignone - Full-stack Software Engineer with PhD in Machine Learning, specializing in geospatial data, reinforcement learning, and open-source solutions" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
	<!-- Navigation Header -->
	<header class="fixed top-0 w-full z-50 transition-all duration-300 {scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : ''}">
		<nav class="container mx-auto px-6 py-4">
			<div class="flex justify-between items-center">
				<div class="text-xl font-bold text-slate-800">Leo Ghignone</div>
				<div class="hidden md:flex space-x-8">
					<button on:click={() => scrollToSection('about')} class="text-slate-600 hover:text-blue-600 transition-colors">About</button>
					<button on:click={() => scrollToSection('skills')} class="text-slate-600 hover:text-blue-600 transition-colors">Skills</button>
					<button on:click={() => scrollToSection('projects')} class="text-slate-600 hover:text-blue-600 transition-colors">Projects</button>
					<button on:click={() => scrollToSection('contact')} class="text-slate-600 hover:text-blue-600 transition-colors">Contact</button>
				</div>
			</div>
		</nav>
	</header>

	<!-- Hero Section -->
	<section class="pt-20 min-h-screen flex items-center justify-center px-6">
		<div class="text-center max-w-4xl">
			<h1 class="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
				Hi, I'm <span class="text-blue-600">Leo Ghignone</span>
			</h1>
			<p class="text-xl md:text-2xl text-slate-600 mb-8">
				Software Engineer
			</p>
			<p class="text-lg text-slate-500 mb-12 max-w-2xl mx-auto">
				Specializing in geospatial data analysis, machine learning, and large language models. 
				I build intelligent solutions that turn complex data into actionable insights.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
				<button on:click={() => scrollToSection('contact')} class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
					Get In Touch
				</button>
				<button on:click={() => scrollToSection('projects')} class="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
					View My Work
				</button>
			</div>
			<ChevronDown class="w-8 h-8 text-slate-400 mx-auto animate-bounce" />
		</div>
	</section>

	<!-- About Section -->
	<section id="about" class="py-20 px-6">
		<div class="container mx-auto max-w-4xl">
			<h2 class="text-4xl font-bold text-center text-slate-900 mb-12">About Me</h2>
			<div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
				<p class="text-lg text-slate-600 mb-6 leading-relaxed">
					I'm a passionate software engineer with a PhD in Machine Learning, where my research focused on efficient Reinforcement Learning for Swarm systems. 
					My strong interdisciplinary skills enable me to develop sophisticated solutions across various domains, from complex data challenges to innovative AI applications.
				</p>
				<p class="text-lg text-slate-600 mb-6 leading-relaxed">
					As a full-stack developer and open-source advocate, I specialize in building robust, scalable solutions using cutting-edge technologies. 
					My expertise spans geospatial data analysis with cloud-optimized formats like GeoParquet and Zarr, advanced machine learning algorithms, 
					and practical applications of large language models using tools like Ollama for local model deployment.
				</p>
				<p class="text-lg text-slate-600 mb-6 leading-relaxed">
					I'm committed to open-source software development and believe in creating solutions that are not only powerful but also accessible and maintainable. 
					Whether it's building predictive models, analyzing spatial patterns, or implementing AI-powered systems, I bring both technical excellence 
					and strategic thinking to every project.
				</p>
				<p class="text-lg text-slate-600 leading-relaxed">
					<a href="https://unsworks.unsw.edu.au/bitstreams/29367c76-5c06-475f-823a-68abe57dd763/download" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 underline">
						Read my PhD thesis on Reinforcement Learning for Swarm systems
					</a>
				</p>
			</div>
			
			<!-- Journey Map -->
			<div class="mt-12">
				<h3 class="text-2xl font-bold text-slate-900 mb-6 text-center">My Journey</h3>
				<p class="text-center text-slate-600 mb-8">
					From my roots in <button class="text-blue-600 hover:text-blue-700 underline font-medium transition-colors" on:click={() => JourneyMapComponent?.goToLocation('italy')} on:mouseenter={() => JourneyMapComponent?.showCountryFill('italy')} on:mouseleave={() => JourneyMapComponent?.hideAllFills()}>Italy</button> to my current life in <button class="text-blue-600 hover:text-blue-700 underline font-medium transition-colors" on:click={() => JourneyMapComponent?.goToLocation('australia')} on:mouseenter={() => JourneyMapComponent?.showCountryFill('australia')} on:mouseleave={() => JourneyMapComponent?.hideAllFills()}>Australia</button> - a journey that shaped my global perspective
				</p>
				<JourneyMap bind:this={JourneyMapComponent} />
			</div>
		</div>
	</section>

	<!-- Skills Section -->
	<section id="skills" class="py-20 px-6 bg-white/50">
		<div class="container mx-auto max-w-6xl">
			<h2 class="text-4xl font-bold text-center text-slate-900 mb-12">Core Expertise</h2>
			<div class="grid md:grid-cols-3 gap-8">
				<div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
					<div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
						<MapPin class="w-8 h-8 text-blue-600" />
					</div>
					<h3 class="text-xl font-bold text-slate-900 mb-4">Geospatial Data</h3>
					<p class="text-slate-600">
						Expert in cloud-optimized formats (GeoParquet, Zarr), spatial analysis, and GIS systems for 
						extracting meaningful insights from location-based data at scale.
					</p>
				</div>
				<div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
					<div class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
						<Brain class="w-8 h-8 text-green-600" />
					</div>
					<h3 class="text-xl font-bold text-slate-900 mb-4">Machine Learning</h3>
					<p class="text-slate-600">
						PhD-level expertise in Reinforcement Learning for Swarm systems, predictive modeling, 
						and advanced ML algorithms for intelligent data-driven solutions.
					</p>
				</div>
				<div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
					<div class="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
						<Cpu class="w-8 h-8 text-purple-600" />
					</div>
					<h3 class="text-xl font-bold text-slate-900 mb-4">LLM & Open Source</h3>
					<p class="text-slate-600">
						Local model deployment with Ollama, prompt engineering, and full-stack development 
						using open-source technologies for scalable, maintainable solutions.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Projects Section -->
	<section id="projects" class="py-20 px-6">
		<div class="container mx-auto max-w-4xl">
			<h2 class="text-4xl font-bold text-center text-slate-900 mb-12">Featured Projects</h2>
			<div class="space-y-8">
				<div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
					<h3 class="text-2xl font-bold text-slate-900 mb-3">Cloud-Optimized GIS Platform</h3>
					<p class="text-slate-600 mb-4">
						Developed a scalable platform leveraging GeoParquet and Zarr formats for efficient geospatial data 
						processing, enabling real-time analysis of large-scale spatial datasets with cloud-native architecture.
					</p>
					<div class="flex flex-wrap gap-2">
						<span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">GeoParquet</span>
						<span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Zarr</span>
						<span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Cloud Native</span>
					</div>
				</div>
				<div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
					<h3 class="text-2xl font-bold text-slate-900 mb-3">Reinforcement Learning for Swarm Systems</h3>
					<p class="text-slate-600 mb-4">
						PhD research project developing efficient RL algorithms for coordinating multi-agent systems, 
						demonstrating significant improvements in computational efficiency and system performance.
					</p>
					<div class="flex flex-wrap gap-2">
						<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Reinforcement Learning</span>
						<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Swarm Systems</span>
						<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Multi-Agent</span>
					</div>
				</div>
				<div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
					<h3 class="text-2xl font-bold text-slate-900 mb-3">Open-Source LLM Deployment Framework</h3>
					<p class="text-slate-600 mb-4">
						Created a comprehensive framework for deploying and managing local LLMs using Ollama, featuring 
						task-specific interfaces and seamless integration with existing open-source workflows.
					</p>
					<div class="flex flex-wrap gap-2">
						<span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Ollama</span>
						<span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Local LLMs</span>
						<span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Open Source</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Contact Section -->
	<section id="contact" class="py-20 px-6 bg-white/50">
		<div class="container mx-auto max-w-4xl">
			<h2 class="text-4xl font-bold text-center text-slate-900 mb-12">Get In Touch</h2>
			<div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
				<p class="text-lg text-slate-600 mb-8">
					Interested in collaborating or have a project in mind? I'd love to hear from you!
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
					<a href="mailto:leo.ghignone@gmail.com" class="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
						<Mail class="w-5 h-5" />
						Email Me
					</a>
					<a href="https://github.com/barbuz" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
						<svg class="w-5 h-5" fill="#181717" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
						GitHub
					</a>
				</div>
				<p class="text-slate-500">
					Available for freelance and contract opportunities
				</p>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-slate-900 text-white py-8 px-6">
		<div class="container mx-auto text-center">
			<p>&copy; 2026 Leo Ghignone. All rights reserved.</p>
		</div>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}
	
	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}
</style>
