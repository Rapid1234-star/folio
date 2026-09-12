<div align="center">

# Aayan Desai — Portfolio

### QA Automation Engineer & Cybersecurity Specialist

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vite.dev)
[![Three.js](https://img.shields.io/badge/Three.js-185-000000?logo=threedotjs)](https://threejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-3-88CE02)](https://gsap.com)

**Cyber-terminal portfolio — Neon green. Dual mode. Built to ship.**

**Live site:** [https://aayan-d.vercel.app/](https://aayan-d.vercel.app/)

[Report Bug](https://github.com/Rapid1234-star/folio/issues) · [GitHub](https://github.com/Rapid1234-star/folio)

</div>

---

## Overview

Interactive single-page portfolio with a terminal / cyber aesthetic: dual Visual ↔ Terminal modes, GSAP scroll storytelling, an interactive About globe, project dock, CLI overlay, and responsive HUD chrome from mobile to desktop.

---

## Features

- **Dual mode UI** — Visual (glass panels) and Terminal (green-on-black) rendering of the same content
- **Hero boot sequence** — Typed terminal intro with CTAs (CV download + enter work)
- **About globe** — Interactive canvas globe beside the About section (theme-matched)
- **CyberGlobe / particles** — Ambient 3D / particle background with mobile fallback
- **Project dock** — Horizontal swipe dock + project detail modal
- **CLI overlay** — Keyboard-driven mini terminal (`whoami`, `projects`, etc.)
- **Ambient audio** — Optional background track with mute controls
- **Accessibility** — Skip link, focus styles, `prefers-reduced-motion`, semantic sections
- **Responsive** — Tuned across phones, tablets, laptops, and desktop

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Language | TypeScript 5.8 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| 3D / canvas | Three.js, React Three Fiber, custom globe canvas |
| Motion | GSAP + ScrollTrigger, Lenis |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
git clone https://github.com/Rapid1234-star/folio.git
cd folio
npm install
```

### Develop

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
├── public/
│   ├── aayan_cv.pdf          # Downloadable CV
│   ├── favicon.svg
│   ├── og-image.png          # Social / Open Graph preview
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── music/
│   └── projects/             # Project thumbnails
├── src/
│   ├── components/
│   │   ├── CyberGlobe/       # Ambient globe / particles
│   │   ├── InteractiveGlobe.tsx
│   │   ├── sections/         # Hero, About, Experience, Projects, …
│   │   ├── CliOverlay.tsx
│   │   ├── ModeToggle.tsx
│   │   └── …
│   ├── hooks/
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html                # SEO meta + JSON-LD
├── package.json
└── vite.config.ts
```

---

## Deploy

Production URL: **[https://aayan-d.vercel.app/](https://aayan-d.vercel.app/)**

This repo is set up for Vercel. The CV and OG image live under `public/` so they ship with the static build.

---

## Browser Support

Chrome, Firefox, Safari, and Edge (recent versions), plus mobile Safari / Chrome Android.

---

## License

Private. Do not distribute without permission.

---

<div align="center">

**Built by [Aayan Irshad Desai](https://aayan-d.vercel.app/)**

[GitHub](https://github.com/Rapid1234-star) · [LinkedIn](https://linkedin.com/in/aayan-desai) · [Live Portfolio](https://aayan-d.vercel.app/)

</div>
