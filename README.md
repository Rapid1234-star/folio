<div align="center">

# 🖥️ AYAN DESAI — PORTFOLIO ⚡

### 👨‍💻 QA Automation Engineer & 🔐 Cybersecurity Specialist

[![React](https://img.shields.io/badge/⚛️_React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/🔷_TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/⚡_Vite-6-646CFF?logo=vite)](https://vite.dev)
[![Three.js](https://img.shields.io/badge/🎲_Three.js-185-000000?logo=threedotjs)](https://threejs.org)
[![Tailwind CSS](https://img.shields.io/b🌬️_Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/🎬_GSAP-3-88CE02)](https://gsap.com)

**A cyberpunk-themed interactive portfolio that looks like it was hacked straight out of the Matrix 🟢**

[🔗 Live Demo](https://aayan-desai.vercel.app) · [🐛 Report Bug](https://github.com/Rapid1234-star/portfolio/issues)

</div>

---

## 📖 Overview

Ever wondered what happens when a QA engineer with too much caffeine 🥤 decides to build a portfolio? You get this — a **terminal-aesthetic** personal website with a real-time 3D city, CRT monitor effects, scroll-driven animations, and a dual-mode UI that switches between *pretty glass cards* and *hacker terminal vibes*.

Built for screens from **320px** 📱 to **4K** 🖥️. Yes, it works on your smartwatch too (probably).

---

## 🚀 Features

### 🎮 Core

- **🔄 Dual Mode UI** — Toggle between **Visual mode** (glassmorphism cards ✨) and **Terminal mode** (green-on-black text 🟢). Feel like a hacker? We got you.
- **🏙️ 3D City Scene** — An animated low-poly city built with React Three Fiber. It's just vibing in the background, looking cool.
- **🎬 GSAP Scroll Animations** — Section reveals, parallax effects, and buttery-smooth transitions via ScrollTrigger. *chef's kiss* 👨‍🍳
- **🗂️ Project Dock** — macOS-style expandable dock with hover interactions. Click a project → modal pops up. Magic. 🪄
- **📺 CRT Effects** — Scanlines, screen flicker, and phosphor glow. Because nostalgia hits different. 💚
- **🔊 Ambient Audio** — Background synth audio. Mute it if you're in a meeting. We won't judge. 🎵
- **📱 Mobile Hamburger Menu** — Slide-in nav panel on mobile. Clean. Fast. No nonsense.

### ♿ Accessibility (yes, we care about this stuff)

- ⏩ Skip-to-content link
- ⌨️ Full keyboard navigation
- 🏷️ `aria-label` / `aria-current` on navigation
- 👁️ Focus-visible outlines on everything clickable
- 🎭 `prefers-reduced-motion` — disables CRT flicker, scanlines, marquee, and bounce animations
- 📐 Semantic heading hierarchy (H1 → H2 → H3)

### 📱 Responsive (it works everywhere, seriously)

- 📐 Hamburger menu on mobile, dots on desktop
- 📏 Bottom control bar adapts: full-width on mobile, floating on desktop
- 🖱️ Project dock scrolls horizontally on small screens
- 👆 Touch targets minimum **44×44px** — no fat-finger fails

---

## 🛠️ Tech Stack

| Layer | Technology | Why? |
|-------|-----------|------|
| ⚛️ Framework | React 19 | Because we like component-based chaos |
| 🔷 Language | TypeScript 5.8 | Types are love, types are life |
| ⚡ Build Tool | Vite 6 | Fast. Very fast. Zoom zoom. |
| 🎨 Styling | Tailwind CSS 4 | Utility-first or bust |
| 🎲 3D | Three.js + R3F | For that cyberpunk city aesthetic |
| 🎬 Animations | GSAP + ScrollTrigger | Smooth scroll = happy users |
| 🎯 Icons | Lucide React | Clean, consistent, beautiful |

---

## 🏁 Getting Started

### 📋 Prerequisites

- [Node.js](https://nodejs.org/) 18+ (the newer, the better)
- npm or yarn (pick your weapon ⚔️)

### ⬇️ Installation

```bash
# 📦 Clone the repo
git clone https://github.com/Rapid1234-star/portfolio.git

# 📂 Navigate to project
cd portfolio/Portfolio v2

# 🔧 Install dependencies
npm install
```

### 🏃 Development

```bash
npm run dev
```

Then open **http://localhost:3000** and watch the magic happen ✨

### 📦 Build

```bash
npm run build    # 🏗️ Build for production
npm run preview  # 👀 Preview the build
```

### 🔍 Lint

```bash
npm run lint
```

Runs TypeScript type checking. No errors? You're a legend 🏆

---

## 📁 Project Structure

```
Portfolio v2/
├── public/
│   └── models/              # 🎲 3D assets (GLB/GLTF)
├── src/
│   ├── components/
│   │   ├── AudioPlayer.tsx        # 🔊 Ambient audio vibes
│   │   ├── BackToTop.tsx          # ⬆️ Floating back-to-top
│   │   ├── MobileNav.tsx          # 📱 Hamburger menu
│   │   ├── NavigationDots.tsx     # 🔵 Section navigation dots
│   │   ├── SectionHeader.tsx      # 📝 Reusable section headers
│   │   ├── SystemLogs.tsx         # 💻 Terminal log drawer
│   │   ├── TerminalToggle.tsx     # 🔄 Visual/Terminal toggle
│   │   ├── ThreeScene.tsx         # 🏙️ 3D city scene
│   │   ├── LoadingScreen.tsx      # ⏳ Boot sequence loader
│   │   └── sections/
│   │       ├── Hero.tsx           # 🦸 Landing with typing effect
│   │       ├── Summary.tsx        # 👤 About / candidate profile
│   │       ├── Experience.tsx     # 💼 Work history timeline
│   │       ├── Projects.tsx       # 🗂️ Project dock + modals
│   │       ├── Skills.tsx         # 🛠️ Tech stack grid
│   │       └── Education.tsx      # 🎓 Education & certifications
│   ├── utils/
│   │   └── sfx.ts                 # 🔔 Sound effects
│   ├── hooks/
│   │   └── useTerminalMode.ts     # 🖥️ Terminal mode state
│   ├── App.tsx                    # 🏠 Root layout
│   ├── index.css                  # 🎨 Global styles & CRT
│   └── main.tsx                   # 🚀 Entry point
├── index.html
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🤔 Key Decisions (a.k.a. "Why did you do it this way?")

- **🔀 No router** — It's a single-page scroll portfolio. Sections stacked, dots navigate. Simple. Clean. Effective.
- **🎭 Dual rendering** — Same content, two visual modes. No code duplication. *Modern problems require modern solutions* 🧠
- **🏙️ 3D as ambient** — The Three.js scene is decorative, not interactive. Keeps performance high while looking stunning.
- **🎬 GSAP over CSS** — ScrollTrigger gives precise control. CSS only handles micro-interactions. Best of both worlds.
- **📺 CRT as overlay** — Scanlines and flicker are CSS overlays with `pointer-events: none`. Never blocks usability. Smart. 🧠

---

## 🌐 Browser Support

| Browser | Status |
|---------|--------|
| 🟢 Chrome 90+ | Supported ✅ |
| 🟠 Firefox 90+ | Supported ✅ |
| 🔵 Safari 15+ | Supported ✅ |
| 🟣 Edge 90+ | Supported ✅ |
| 📱 Mobile Safari | Supported ✅ |
| 📱 Chrome Android | Supported ✅ |

---

## ⚡ Performance

- 🔄 Three.js scene uses `Suspense` with `useProgress` for progressive loading
- 📦 GLTF models are lazy-loaded and cached
- 🎬 GSAP ScrollTrigger instances created once, refreshed on resize
- 🖥️ CRT effects use CSS `will-change` and `transform` for GPU acceleration
- 📉 No unnecessary re-renders. React.memo where it matters.

---

## 📜 License

This project is **private** 🤫. Do not distribute without permission. I know where you live. 👀

---

<div align="center">

### 🎉 Built with 💚 by **Aayan Irshad Desai**

[🐙 GitHub](https://github.com/Rapid1234-star) · [💼 LinkedIn](https://linkedin.com/in/aayan-desai)

*"I don't always test my code, but when I do, I do it with Playwright"* 🎭

</div>
