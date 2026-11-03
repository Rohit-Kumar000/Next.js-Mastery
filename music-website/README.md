<div align="center">

# Music School

### Modern Music Learning Platform

A responsive music school website for discovering courses, learning from instructors, and exploring music events — built with **Next.js 16** and a rich, animated interface.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-14-FF0055?logo=framer&logoColor=white)](https://motion.dev/)

[View Project](https://github.com/Rohit-Kumar000/Next.js-Mastery/tree/branch01/music-website) · [Report an Issue](https://github.com/Rohit-Kumar000/Next.js-Mastery/issues)

</div>

---

## About

**Music School** is a modern music learning website designed to bring courses, instructors, student stories, and learning events together in one place. Its dark visual style and interactive UI components create an engaging experience across the site.

## Features

- 🎸 **Course discovery** — explore featured courses or browse the full catalog.
- 👩‍🏫 **Instructor profiles** — discover the people behind the lessons.
- 💬 **Student testimonials** — read learner feedback and experiences.
- 🎙️ **Webinar highlights** — find music topics and upcoming learning sessions.
- ✉️ **Contact page** — send a message through a simple contact form interface.
- ✨ **Animated UI** — gradients, spotlight and beam effects, hover cards, moving cards, and 3D course cards.
- 📱 **Responsive layout** — designed to adapt to mobile, tablet, and desktop screens.
- 🧩 **Reusable components** — shared page sections and visual components keep the UI modular.

## Tech Stack

| Technology | Purpose |
| --- | --- |
| **Next.js 16** | App framework and routing |
| **React 19** | User interface components |
| **TypeScript** | Typed application code |
| **Tailwind CSS 4** | Utility-first styling |
| **Motion** | UI animations and interactions |
| **Simplex Noise** | Noise-based visual effects |
| **clsx** and **tailwind-merge** | Conditional and conflict-safe class names |

## Pages

| Route | Description |
| --- | --- |
| `/` | Hero, featured courses, school highlights, testimonials, webinars, and instructors |
| `/courses` | Complete music course catalog |
| `/contact` | Contact form interface |

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

```bash
git clone https://github.com/Rohit-Kumar000/Next.js-Mastery.git
cd Next.js-Mastery/music-website
git switch branch01
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Project Structure

```text
music-website/
├── src/
│   ├── app/
│   │   ├── contact/          # Contact page
│   │   ├── courses/          # Course catalog
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout and metadata
│   │   └── page.tsx          # Home page
│   ├── components/           # Page sections and shared UI
│   │   └── ui/               # Animated and visual components
│   ├── data/
│   │   └── music_courses.json
│   └── utils/
└── package.json
```

## Contact Form Note

The contact page currently provides client-side required-field validation and logs submitted values to the browser console. Connect a backend API or form service to receive messages.

## Author

**Rohit Kumar** · [GitHub](https://github.com/Rohit-Kumar000)

---

<div align="center">

Made with 🎶 using Next.js 16

</div>
