<div align="center">

# Messanger

**Share a link. Receive honest, anonymous messages.**

A full-stack anonymous messaging app with email verification, a private dashboard and AI-powered message suggestions.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?logo=googlegemini&logoColor=white)

</div>

---

## 📖 Overview

Messanger lets anyone send you an anonymous message through a personal link, no account needed for the sender. You get a private dashboard to read, manage and delete messages, and a switch to pause your inbox whenever you want. Senders who are out of ideas can tap **Suggest messages** to get fresh AI-generated prompts from Gemini.

## ✨ Features

| | Feature | Details |
| --- | --- | --- |
| 🔐 | **Secure authentication** | NextAuth (JWT sessions), bcrypt-hashed passwords |
| 📧 | **Email verification** | 6-digit OTP via Resend, valid for 1 hour, styled with React Email |
| 🔗 | **Public profile link** | `/u/<username>`: anyone can message you anonymously |
| 🎛️ | **Inbox control** | Pause or resume incoming messages with one switch |
| 🗂️ | **Dashboard** | View, refresh and delete received messages |
| 🤖 | **AI suggestions** | New ideas on every click, previously shown ones are never repeated, built-in fallback when Gemini is busy |
| 🛡️ | **Safe by default** | Zod validation, escaped regex queries, rate limiting on public endpoints |
| 📱 | **Fully responsive** | Optimised for mobile, tablet and desktop |

## 🧰 Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, React Compiler |
| Language | TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui (Base UI), Lucide icons |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js (Credentials provider) |
| Email | Resend + React Email |
| AI | Google Gemini (Interactions API) |
| Forms & validation | React Hook Form + Zod |

## 🚀 Quick start

### Prerequisites

- Node.js **20.9+** and npm
- A MongoDB database ([Atlas](https://www.mongodb.com/atlas) or local)
- A [Resend](https://resend.com) account
- A [Google AI Studio](https://aistudio.google.com) API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/messanger-website.git
cd messanger-website

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env.local        # Windows: copy .env.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account and enter the code sent to your email.

## 🔑 Environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-host>/<db-name>?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
GEMINI_API_KEY=your-google-ai-studio-key
# GEMINI_MODEL=gemini-3.8-flash   # optional
```

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_SECRET` | Random secret for signing sessions, generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Site URL (`http://localhost:3000` locally, your domain in production) |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Sender address on a domain verified in Resend |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `GEMINI_MODEL` | *(optional)* Gemini model ID, defaults to `gemini-3.8-flash` |

> ⚠️ Never commit `.env.local` or share your keys. On MongoDB Atlas, allow your IP under **Network Access**.

## 📜 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check without emitting files |

## 🗂️ Project structure

```text
messanger-website/
├── emails/
│   └── VerificationEmail.tsx       # React Email template for the OTP mail
├── src/
│   ├── app/
│   │   ├── (app)/                  # Landing page + dashboard
│   │   ├── (auth)/                 # sign-in, sign-up, verify/[username]
│   │   ├── u/[username]/           # Public "send a message" page
│   │   ├── api/                    # Route handlers (see API section)
│   │   ├── globals.css             # Tailwind + design tokens
│   │   └── layout.tsx              # Root layout, navbar, toaster
│   ├── components/
│   │   ├── ui/                     # shadcn/ui primitives
│   │   ├── MessageCard.tsx
│   │   └── Navbar.tsx
│   ├── context/                    # NextAuth session provider
│   ├── helper/                     # Verification email sender
│   ├── lib/                        # dbConnect, Resend client, rate limiter, utils
│   ├── model/                      # Mongoose User model
│   ├── schema/                     # Zod schemas
│   ├── types/                      # Shared and NextAuth type declarations
│   ├── messages.json               # Sample messages for the landing carousel
│   └── proxy.ts                    # Route protection (auth redirects)
├── .env.example
├── components.json                 # shadcn/ui config
├── next.config.ts
└── package.json
```

## 🔌 API reference

| Method | Endpoint | Auth | Description |
| --- | --- | :---: | --- |
| `POST` | `/api/sign-up` | - | Create account and email the OTP |
| `POST` | `/api/verify-code` | - | Verify the OTP |
| `GET` | `/api/check-username-unique` | - | Live username availability |
| `GET` | `/api/public-profile/[username]` | - | Public inbox status |
| `POST` | `/api/send-message` | - | Send an anonymous message |
| `POST` | `/api/suggest-messages` | - | Get AI message suggestions |
| `GET` / `POST` | `/api/accept-messages` | ✅ | Read / change inbox status |
| `GET` | `/api/get-messages` | ✅ | List received messages |
| `DELETE` | `/api/delete-message/[messageid]` | ✅ | Delete a message |
| `*` | `/api/auth/[...nextauth]` | - | NextAuth handlers |

## 🔒 Security notes

- Passwords are hashed with **bcrypt**; sessions use signed **JWTs**.
- All inputs are validated with **Zod** on the server.
- User-provided values used in regex queries are escaped.
- Public endpoints (`send-message`, `suggest-messages`, `verify-code`) are **rate limited**.
- The built-in limiter is in-memory (per server instance). For heavy production traffic, replace `src/lib/rateLimit.ts` with a shared store such as Redis.

## ☁️ Deployment

Deploy in minutes on [Vercel](https://vercel.com):

1. Push the repo to GitHub and import it in Vercel.
2. Add every variable from `.env.example` under **Project Settings → Environment Variables** and set `NEXTAUTH_URL` to your production domain.
3. Deploy.

## 🩺 Troubleshooting

<details>
<summary><b>"You can only send testing emails to your own email address"</b></summary>

Resend's shared sender `onboarding@resend.dev` can only email the address that owns your Resend account. To email anyone, verify a domain at [resend.com/domains](https://resend.com/domains) and set `RESEND_FROM_EMAIL` to an address on that domain (for example `noreply@yourdomain.com`).

</details>

<details>
<summary><b>AI suggestions say "setup is required"</b></summary>

`GEMINI_API_KEY` is missing. Add it to `.env.local` and restart `npm run dev`.

</details>

<details>
<summary><b>MongoDB connection fails</b></summary>

Check `MONGODB_URI` and make sure your current IP address is allowed under **Network Access** in MongoDB Atlas.

</details>

<details>
<summary><b>Environment changes are not picked up</b></summary>

Next.js reads `.env.local` at startup. Stop the dev server and run `npm run dev` again.

</details>

## 🤝 Contributing

Issues and pull requests are welcome. Please run `npm run lint` and `npm run typecheck` before submitting.

---

<div align="center">

Made with ❤️ using Next.js

</div>