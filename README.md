# Leo Ghignone - Personal Website

A beautiful, modern personal website built with Svelte and TailwindCSS, showcasing Leo Ghignone's expertise in software engineering, geospatial data, machine learning, and large language models.

## 🚀 Features

- **Modern UI Design**: Clean, responsive design with smooth animations
- **TailwindCSS**: Utility-first CSS framework for rapid styling
- **Lucide Icons**: Beautiful, consistent iconography
- **Mobile Responsive**: Optimized for all device sizes
- **GitHub Pages Ready**: Configured for automatic deployment
- **SEO Optimized**: Meta tags and semantic HTML for better search visibility

## 🛠️ Tech Stack

- **Framework**: Svelte 5 with TypeScript
- **Styling**: TailwindCSS with custom animations
- **Icons**: Lucide Svelte
- **Deployment**: GitHub Pages via GitHub Actions
- **Build Tool**: Vite

## 📁 Project Structure

```
personal-website/
├── src/
│   ├── routes/
│   │   ├── +page.svelte      # Main page with all sections
│   │   └── +layout.ts         # Layout configuration
│   └── app.html              # HTML template
├── static/                   # Static assets
├── .github/workflows/        # GitHub Actions for deployment
└── build/                   # Build output (generated)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Git for version control

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd personal-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be output to the `build/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🌐 Deployment to GitHub Pages

### Automatic Deployment

The project is configured for automatic deployment to GitHub Pages via GitHub Actions:

1. **Push to main branch**
   ```bash
   git add .
   git commit -m "Deploy website"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as the source

3. **Automatic deployment**
   - The GitHub Actions workflow will automatically build and deploy your site
   - Your site will be available at `https://<username>.github.io/personal-website`

### Manual Deployment

If you prefer manual deployment:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   - Use GitHub Desktop or `gh-pages` package to deploy the `build/` directory

## ⚙️ Configuration

### Updating Base Path

If your repository name differs from `personal-website`, update the base path in `svelte.config.js`:

```javascript
paths: {
  base: process.env.NODE_ENV === 'production' ? '/your-repo-name' : ''
}
```

### Customizing Content

Edit `src/routes/+page.svelte` to:
- Update personal information
- Modify project descriptions
- Change contact links
- Adjust styling and colors

## 🎨 Customization

### Colors

The primary color scheme uses Tailwind's blue palette. Modify colors in the Svelte components:
- Primary: `blue-600`, `blue-700`
- Background: `slate-50`, `blue-50`
- Text: `slate-900`, `slate-600`

### Fonts

The site uses system fonts for optimal performance. To add custom fonts:
1. Import fonts in `app.html`
2. Update CSS in the `<style>` blocks

### Animations

Custom animations are defined in the `<style>` blocks. The bounce animation is used for the scroll indicator.

## 📱 Sections Overview

1. **Hero Section**: Eye-catching introduction with call-to-action buttons
2. **About**: Detailed personal and professional background
3. **Skills**: Three core expertise areas with icons and descriptions
4. **Projects**: Featured work with technology tags
5. **Contact**: Professional contact information and social links
6. **Footer**: Copyright information

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run dev -- --open    # Start and open in browser

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Type checking
npm run check           # Run TypeScript checks
npm run check:watch     # Run checks in watch mode
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Built with ❤️ by Leo Ghignone**
