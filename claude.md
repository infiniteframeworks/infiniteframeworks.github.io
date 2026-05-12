# Claude Code Project Guide

## Project Overview

This is the **Infinite Frameworks** business website - a static site for a digital consulting studio based in North Carolina. The site is hosted on GitHub Pages at `infiniteframeworks.com` and showcases services, portfolio, team information, and contact details.

## Tech Stack

- **HTML5** - Semantic markup with accessibility support
- **CSS3** - Modern features (Grid, Flexbox, CSS variables, animations)
- **Vanilla JavaScript** - Minimal DOM manipulation (no frameworks)
- **Eleventy (11ty)** - Static site generator with Nunjucks templating
- **GitHub Pages** - Static hosting via GitHub Actions

## Directory Structure

```
infiniteframeworks.github.io/
├── _includes/              # Reusable templates
│   ├── layouts/
│   │   └── base.njk        # Base HTML layout (head, body wrapper)
│   ├── header.njk          # Navigation
│   └── footer.njk          # Copyright
│
├── index.njk               # Homepage source
├── pages/                  # Page sources
│   ├── about/index.njk
│   ├── contact/index.njk
│   └── services/index.njk
│
├── _site/                  # Compiled output (gitignored, built by CI)
├── styles.css              # Global stylesheet
├── script.js               # JavaScript (hamburger menu)
├── eleventy.config.js      # Build config
├── package.json            # Node dependencies
├── favicons/               # Favicon assets
├── logo.png                # Brand logo
├── site.webmanifest        # PWA manifest
├── CNAME                   # Domain config
└── 404.html                # Error page
```

## Build System

The site uses [Eleventy](https://www.11ty.dev/) with Nunjucks templates.

### Template Syntax

Each page is a `.njk` file with YAML frontmatter for per-page metadata:
```njk
---
layout: layouts/base.njk
title: Page Title · Infinite Frameworks
description: Page description for SEO.
---

<section>... page content ...</section>
```

Shared layout and components live in `_includes/`.

### Running the Build

```bash
npm run build      # one-time build → _site/
npm start          # dev server with hot reload
```

### Important: Edit `.njk` source files, never touch `_site/` directly (it's gitignored).

## Design System

### Colors (CSS Variables)

```css
--color-primary: #0069bb;      /* Primary blue */
--color-primary-soft: #1b87d2; /* Soft blue */
--color-ink: #1c252f;          /* Dark text/backgrounds */
--color-bg: #f5f6fb;           /* Page background */
--color-surface: #ffffff;      /* Cards/surfaces */
--color-text-main: #1f2933;    /* Body text */
--color-text-muted: #6b7280;   /* Secondary text */
--color-border-subtle: #dde1ea;/* Borders */
```

### Typography

- **Font stack**: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Base line-height**: 1.6
- **Responsive headings**: Use `clamp()` for fluid sizing

### Spacing

```css
--space-xs: 0.5rem;
--space-sm: 1rem;
--space-md: 1.5rem;
--space-lg: 2rem;
--space-xl: 3rem;
--space-2xl: 4rem;
```

### Breakpoints

- **960px**: Tablet (grid column changes)
- **768px**: Mobile (hamburger menu activates)

## Coding Conventions

### HTML

- Use semantic elements (`<header>`, `<nav>`, `<section>`, `<footer>`)
- Include ARIA labels on interactive elements
- Use absolute paths for links (`/pages/services/`)
- Maintain proper heading hierarchy

### CSS

- Organize styles by section (header, hero, services, about, contact, footer)
- Use CSS variables for all colors and spacing
- Mobile-first responsive approach
- Respect `prefers-reduced-motion` for animations

### JavaScript

- Minimal, vanilla JS only
- Use `DOMContentLoaded` event pattern
- Keep scripts deferred

## Pages

| Page | Source | URL |
|------|--------|-----|
| Home | `index.njk` | `/` |
| Services | `pages/services/index.njk` | `/pages/services/` |
| About | `pages/about/index.njk` | `/pages/about/` |
| Contact | `pages/contact/index.njk` | `/pages/contact/` |
| 404 | `404.html` | (error page, passthrough copied) |
| Blog | External | `blog.infiniteframeworks.com` |

## Common Tasks

### Adding a New Page

1. Create `pages/[page-name]/index.njk` with frontmatter and content
2. Add navigation link in `_includes/header.njk`

### Modifying Navigation

Edit `_includes/header.njk`.

### Updating Meta/Analytics

Edit `_includes/layouts/base.njk`.

### Changing Global Styles

Edit `styles.css`.

## Key Files

- [styles.css](styles.css) - All site styles
- [script.js](script.js) - JavaScript functionality
- [eleventy.config.js](eleventy.config.js) - Build config and passthrough copies
- [_includes/layouts/base.njk](_includes/layouts/base.njk) - Base HTML layout
- [_includes/header.njk](_includes/header.njk) - Navigation
- [_includes/footer.njk](_includes/footer.njk) - Footer

## Brand Voice

- Personal tone (use "I" not "we")
- Focus on clarity, craft, and continuity
- Target audience: Small to mid-size businesses
- Geographic focus: North Carolina-based

## Deployment

Push to `main` → GitHub Actions builds via `.github/workflows/deploy.yml` → deploys `_site/` to GitHub Pages.

**One-time setup required:** In repo Settings → Pages, set source to **GitHub Actions** (not "Deploy from branch").
