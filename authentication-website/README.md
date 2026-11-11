<div align="center">

# 🔐 Authentication Website

**A complete, secure authentication system built with Next.js, MongoDB and Tailwind CSS.**

Sign up · Verify email · Log in · Reset password · Protected profile

<br />

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

## ✨ Features

| | Feature | Description |
| :-: | --- | --- |
| 📝 | **Sign up** | Create an account with username, email and password |
| ✉️ | **Email verification** | Verification link valid for 1 hour, can be resent from the profile |
| 🔑 | **Login / Logout** | HTTP-only JWT cookie, valid for 1 day |
| 🔁 | **Forgot & reset password** | Reset link sent by email, valid for 1 hour, single use |
| 👤 | **Protected profile** | Account details, verification status, copy user ID |
| 🛡️ | **Route protection** | Guests and logged-in users are redirected automatically |
| 📱 | **Responsive UI** | Works on mobile, tablet and desktop |

---

## 🧰 Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Token (`jsonwebtoken`), `bcryptjs` |
| Email | Nodemailer (SMTP, Mailtrap for development) |
| HTTP client | Axios |
| Notifications | React Hot Toast |
| Code quality | ESLint, React Compiler |

---

## 🔄 How It Works

```mermaid
flowchart LR
    A[Sign up] --> B[Verification email]
    B --> C[Click link /verify]
    C --> D[Email verified]
    A --> E[Log in]
    E --> F[JWT cookie set]
    F --> G[Profile page]
    E -.-> H[Forgot password]
    H --> I[Reset email]
    I --> J[Set new password]
    J --> E
```

---

## 📁 Project Structure

```text
authentication-website/
├── src/
│   ├── app/
│   │   ├── api/users/
│   │   │   ├── signup/              # Create account
│   │   │   ├── login/               # Check credentials, set cookie
│   │   │   ├── logout/              # Remove cookie
│   │   │   ├── profile/             # Logged-in user data
│   │   │   ├── verify/              # Verify email token
│   │   │   ├── resendverification/  # Send a new verification email
│   │   │   ├── forgotpassword/      # Send reset email
│   │   │   └── resetpassword/       # Save new password
│   │   ├── login/                   # Login page
│   │   ├── signup/                  # Signup page
│   │   ├── forgotpassword/          # Forgot password page
│   │   ├── resetpassword/           # Reset password page
│   │   ├── verify/                  # Email verification page
│   │   ├── profile/                 # Profile page
│   │   ├── layout.tsx               # Root layout and toaster
│   │   └── globals.css
│   ├── components/                  # AuthShell, PasswordField, Spinner, ToasterProvider, styles
│   ├── database/config.ts           # Cached MongoDB connection
│   ├── helper/                      # Cookies, tokens, mail, validation, API helpers
│   ├── model/userModel.ts           # User schema
│   └── proxy.ts                     # Route protection
├── .env.example
├── next.config.ts
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.9 or newer
- A **MongoDB** database (for example MongoDB Atlas)
- An **SMTP** account (a free [Mailtrap](https://mailtrap.io) sandbox works well)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env

# 3. Start the development server
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

| Variable | Description | Example |
| --- | --- | --- |
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://user:password@cluster.mongodb.net/` |
| `TOKEN_SECRET` | Long random secret used to sign login tokens | `a1b2c3...` |
| `DOMAIN` | Public URL of the app, used in email links | `http://localhost:3000` |
| `SMTP_HOST` | SMTP server host | `sandbox.smtp.mailtrap.io` |
| `SMTP_PORT` | SMTP server port | `2525` |
| `SMTP_USER` | SMTP username | `xxxx` |
| `SMTP_PASS` | SMTP password | `xxxx` |
| `EMAIL_FROM` | Sender shown in emails | `"Authentication App <from@example.com>"` |

Generate a strong `TOKEN_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> [!WARNING]
> Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 🗺️ Pages

| Route | Access | Purpose |
| --- | --- | --- |
| `/signup` | Guests | Create an account |
| `/login` | Guests | Log in |
| `/forgotpassword` | Guests | Request a password reset link |
| `/resetpassword?token=...` | Everyone | Set a new password (link from email) |
| `/verify?token=...` | Everyone | Verify the email address (link from email) |
| `/profile` | Logged-in users | View account details, resend verification, log out |

Access rules are handled in `src/proxy.ts`.

---

## 🔌 API Reference

All routes are under `/api/users`.

| Route | Method | Auth | Purpose |
| --- | --- | :-: | --- |
| `/signup` | `POST` | ❌ | Create an account and send the verification email |
| `/login` | `POST` | ❌ | Check credentials and set the auth cookie |
| `/logout` | `POST` | ✅ | Remove the auth cookie |
| `/profile` | `GET` | ✅ | Return the logged-in user (no password or tokens) |
| `/verify` | `POST` | ❌ | Verify the email with the token from the link |
| `/resendverification` | `POST` | ✅ | Send a new verification email |
| `/forgotpassword` | `POST` | ❌ | Send a password reset email |
| `/resetpassword` | `POST` | ❌ | Save a new password with the token from the link |

<details>
<summary><b>Example: sign up request</b></summary>

```http
POST /api/users/signup
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "mypassword123"
}
```

```json
{
  "success": true,
  "emailSent": true,
  "message": "Account created! Please check your email to verify your account."
}
```

</details>

---

## 🛡️ Security

- 🔒 Passwords are hashed with **bcrypt** and never returned by the API
- 🍪 Login token is stored in an **HTTP-only, SameSite** cookie
- 🎟️ Verification and reset tokens are random, stored only as **SHA-256 hashes**, expire after 1 hour and work once
- 🕵️ Login and forgot-password responses do **not** reveal whether an email is registered
- ⏱️ Emails to the same user are limited to **one per minute**
- 🧼 Request bodies accept strings only, which prevents NoSQL injection
- 🙈 Server errors are logged on the server and never sent to the client

---

## 📜 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Check the code with ESLint |

---

## ☁️ Deployment

1. Push the project to GitHub.
2. Import it into [Vercel](https://vercel.com/new).
3. Add all the [environment variables](#️-environment-variables) in the project settings.
4. Set `DOMAIN` to your live URL (for example `https://your-app.vercel.app`).
5. Deploy.

> [!TIP]
> In MongoDB Atlas, allow your hosting provider's IP addresses (or `0.0.0.0/0`) under **Network Access**, otherwise the database connection will fail.

---

<div align="center">

Made with ❤️ using Next.js

</div>