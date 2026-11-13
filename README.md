<div align="center">

<h1>⚡ Next.js Mastery</h1>

<p><b>Three production-style apps. One goal: master modern web development.</b></p>

<p>
A hands-on collection of full-stack projects built with the Next.js App Router,<br/>
focused on secure authentication, clean architecture and polished, responsive interfaces.
</p>

![Projects](https://img.shields.io/badge/projects-3-7c3aed?style=for-the-badge)
![Status](https://img.shields.io/badge/status-complete-16a34a?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

[**Explore projects**](#-the-projects) · [**Run locally**](#-run-any-project-in-2-minutes) · [**Tech stack**](#-tech-stack) · [**Connect**](#-connect)

</div>

---

## 🧭 At a glance

| | |
| --- | --- |
| 📦 **Projects** | 3 independent apps, each in its own folder |
| 🎯 **Focus** | Auth, API design, responsive UI, third-party integrations |
| 🧱 **Architecture** | App Router · Route Handlers · Server and Client Components |
| ✅ **Status** | All projects complete |

## 🗂️ The projects

<table>
  <tr>
    <td width="33%" valign="top">
      <h3>💌 Messanger</h3>
      <p><i>Share a link. Get honest messages.</i></p>
      <p>Anonymous messaging with email verification, a private dashboard and AI-powered message ideas.</p>
      <p><b>Stack:</b> Next.js 16, MongoDB, NextAuth, Resend, Gemini</p>
      <p><a href="./messanger-website">Open project →</a></p>
    </td>
    <td width="33%" valign="top">
      <h3>🔐 Authentication</h3>
      <p><i>Secure access, done right.</i></p>
      <p>A complete authentication flow with sign-up, sign-in and protected routes.</p>
      <p><b>Stack:</b> Next.js, TypeScript, Tailwind CSS</p>
      <p><a href="./authentication-website">Open project →</a></p>
    </td>
    <td width="33%" valign="top">
      <h3>🎵 Music</h3>
      <p><i>A music experience in the browser.</i></p>
      <p>A clean, responsive music-themed interface focused on smooth UI and great design.</p>
      <p><b>Stack:</b> Next.js, TypeScript, Tailwind CSS</p>
      <p><a href="./music-website">Open project →</a></p>
    </td>
  </tr>
</table>

### 💌 Spotlight: Messanger

The most complete project in the collection, built end to end.

- 🔐 **Auth:** NextAuth with JWT sessions and bcrypt-hashed passwords
- 📧 **Verification:** 6-digit OTP emails through Resend, valid for 1 hour
- 🤖 **AI:** Gemini generates fresh message suggestions on every click and never repeats shown ones
- 🎛️ **Control:** pause or resume your inbox with one switch
- 🛡️ **Safety:** Zod validation, escaped queries and rate-limited public endpoints
- 📱 **Responsive:** tuned for mobile, tablet and desktop

<details>
<summary><b>How Messanger works</b></summary>

<br/>

```text
Sign up ─▶ Verify OTP ─▶ Get your link  /u/<username>
                              │
        Anyone opens the link ▼
   Write a message (or tap "Suggest messages")
                              │
                              ▼
   Message lands in your private dashboard
   (read · delete · pause inbox anytime)
```

</details>

## 🚀 Run any project in 2 minutes

Every project is self-contained with its own dependencies.

```bash
git clone https://github.com/Rohit-Kumar000/Next.js-Mastery.git
cd Next.js-Mastery/<project-folder>     # e.g. messanger-website

npm install
cp .env.example .env.local              # Windows: copy .env.example .env.local
npm run dev
```

Open **http://localhost:3000** 🎉

> 💡 Requires Node.js 20.9+. Each project's own README lists the environment variables and services it needs.

## 🧰 Tech stack

<div align="center">

| Layer | Tools |
| :---: | :--- |
| **Framework** | Next.js (App Router) · React |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS · shadcn/ui |
| **Data** | MongoDB · Mongoose |
| **Auth** | NextAuth.js · bcrypt |
| **Services** | Resend · Google Gemini |
| **Quality** | Zod · React Hook Form · ESLint |

</div>

## 🏗️ Repository layout

```text
Next.js-Mastery/
├── 🔐 authentication-website/   # Authentication flow
├── 💌 messanger-website/        # Anonymous messaging app
├── 🎵 music-website/            # Music web experience
└── 📄 README.md
```

## 🎯 What I practiced

- ✅ Server and Client Components, Route Handlers and middleware (proxy)
- ✅ Secure authentication: hashing, sessions, protected routes, email OTP
- ✅ Input validation and rate limiting on public APIs
- ✅ Mobile-first, accessible and responsive UI
- ✅ Integrating third-party services and AI into real products

## 🤝 Connect

Found a bug or have an idea? Open an [issue](https://github.com/Rohit-Kumar000/Next.js-Mastery/issues) or send a pull request.

**GitHub:** [@Rohit-Kumar000](https://github.com/Rohit-Kumar000)

<div align="center">

⭐ If this collection helped or inspired you, a star means a lot.

<sub>Built with ❤️ using Next.js</sub>

</div>
