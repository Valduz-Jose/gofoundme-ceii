# GoFundMe CEII — Fundraising Platform

📖 Read this in: **English** | [Español](./README.es.md)

> A full-stack fundraising platform with real-time progress tracking, multi-currency display, and a complete admin panel — built for a real campaign.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

<br>

![GoFundMe CEII preview](public/preview.png)

<div align="center">

[🌐 Live Demo](https://gofoundme-ceii.vercel.app) &nbsp;·&nbsp; [📋 Report Bug](https://github.com/Valduz-Jose/gofoundme-ceii/issues)

</div>

---

## About

**CEII** (Centro de Estudiantes de Ingeniería en Informática) is the student organization for the Computer Engineering program at UNET (Universidad Nacional Experimental del Táchira, Venezuela). With limited or no internet access at their headquarters, students cannot reach online resources, development tools, or communicate with the outside world. This platform was created to raise **$1,329 USD** for the purchase and installation of a Starlink kit and the necessary network infrastructure.

Technically, this project goes beyond a simple donation page. It features a **live exchange rate engine** that converts the fundraising goal and progress into VES (BCV and parallel rates), EUR, and COP — currencies that donors actually use. All conversion data is pulled from the Venezuelan exchange rate API (`ve.dolarapi.com`) and cached intelligently with Next.js revalidation.

The platform ships with a **fully decoupled admin panel** secured by Supabase Auth. Administrators can manage donations, equipment items, site configuration, and payment methods — all without touching a single line of code. The payment methods system uses a flexible JSONB schema that supports any payment flow (mobile payments, Zelle, crypto wallets) without database migrations.

**Status:** Production — actively used for the real CEII fundraising campaign.

---

## Features

- 💱 **Multi-currency display** — real-time conversion to USD, VES BCV, VES Paralelo, EUR, and COP
- 📊 **Live progress bar** — reflects actual donations stored in Supabase with a glowing green visual
- 💚 **Donate modal** — tabbed interface (Venezuela, International, Colombia, Crypto, Contact) with one-click clipboard copy for payment details
- 🔐 **Admin panel** — full CRUD for donations, equipment, payment methods, and site config; protected by Supabase Auth
- 🗂️ **Dynamic payment methods** — admin can add/edit/remove payment methods with custom key-value fields (no code changes required)
- 🔄 **Exchange rate fallback** — last known rates persisted in Supabase; shown if the external API is unavailable
- 📱 **Fully responsive** — mobile-first layout, hero adapts from two-column desktop to stacked mobile
- 🛡️ **Row Level Security** — public users only read active records; write access restricted to authenticated admin at the database level
- ⚡ **Edge-ready** — deployed on Vercel with ISR revalidation (60s) for near-instant page loads

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, Server Components, Server Actions) |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS 3 (utility-first, custom CEII color palette) |
| **Database** | Supabase — PostgreSQL with Row Level Security |
| **Auth** | Supabase Auth (email/password, admin-only) |
| **Deployment** | Vercel (free tier, automatic deploys from GitHub) |
| **Exchange rates** | [ve.dolarapi.com](https://ve.dolarapi.com) (primary) |

---

## Architecture

```
┌─────────────┐     HTTPS      ┌──────────────────────┐
│   Browser   │ ─────────────► │  Next.js on Vercel   │
└─────────────┘                │  (App Router + ISR)  │
                               └──────────┬───────────┘
                                          │
                          ┌───────────────┼───────────────┐
                          │               │               │
                          ▼               ▼               ▼
                  ┌──────────────┐ ┌──────────┐  ┌─────────────────┐
                  │   Supabase   │ │  Server  │  │  ve.dolarapi.com│
                  │  PostgreSQL  │ │ Actions  │  │  (exchange rates)│
                  │  + Auth/RLS  │ │ (mutate) │  └─────────────────┘
                  └──────────────┘ └──────────┘

Public routes:   / (home with donate modal)
Admin routes:    /admin/** (protected by middleware + Supabase session)
API routes:      /api/rates (proxied exchange rate endpoint)
```

---

## Local Development

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- Git

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/Valduz-Jose/gofoundme-ceii.git
cd gofoundme-ceii

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Environment variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here   # server-side only
```

### Database setup

Run the SQL migrations in order in your Supabase SQL Editor:

```
supabase/migrations/001_initial_schema.sql   # core tables
supabase/migrations/002_payment_methods.sql  # payment methods + RLS
```

### Run

```bash
npm run dev
# → http://localhost:3000
```

The admin panel is at `/admin`. Create your first user from the Supabase dashboard under **Authentication → Users**.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                     # Public home page (Server Component)
│   ├── admin/
│   │   ├── actions.ts               # All Server Actions (CRUD)
│   │   └── (panel)/
│   │       ├── dashboard/
│   │       ├── donations/           # Donation management
│   │       ├── equipment/           # Equipment list
│   │       ├── payment-methods/     # Payment method CRUD
│   │       └── settings/            # Site config
│   └── api/rates/route.ts           # Exchange rate proxy
├── components/
│   ├── features/
│   │   ├── currency-display.tsx     # Multi-currency selector + amounts
│   │   ├── progress-bar.tsx         # Animated progress bar
│   │   ├── donate-modal.tsx         # Payment method modal (Client)
│   │   ├── donate-button.tsx        # Modal trigger (Client)
│   │   ├── donor-list.tsx           # Public donor list
│   │   ├── equipment-list.tsx       # Equipment cards
│   │   └── admin/
│   │       ├── sidebar.tsx          # Admin navigation
│   │       ├── form-fields.tsx      # Shared form primitives
│   │       └── payment-method-form.tsx  # Dynamic fields editor
│   └── ui/                          # Reusable primitives
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser Supabase client
│   │   ├── server.ts                # Server + service role clients
│   │   └── payment-methods.ts       # Data fetching helpers
│   └── exchange/rates.ts            # Exchange rate logic + caching
└── types/index.ts                   # Global TypeScript interfaces
```

---

## Technical Highlights

**Flexible JSONB schema for payment methods** — instead of hard-coding fields per payment type, each method stores its display data as `jsonb`. Adding a new payment method (e.g., a new crypto wallet) requires zero database migrations and no code changes — only an admin form submission.

**Row Level Security at the database layer** — public users (anon role) can only read records where `is_active = true`. Writes and reads of inactive records are exclusively available to the authenticated admin role. Security is enforced at the PostgreSQL level, not just in application code.

**Server Components + Server Actions** — the public page fetches all data server-side with no client waterfalls. Mutations (admin CRUD) use Next.js Server Actions, keeping the API surface small and type-safe with no separate REST endpoints to maintain.

**AI-assisted development** — this project was built using an AI-assisted workflow (Claude Code) for accelerated iteration while maintaining strict TypeScript types, security practices, and architectural conventions defined in `CLAUDE.md`.

---

## Roadmap

- [ ] Email notifications when a donation is registered
- [ ] Export donor list to CSV
- [ ] EN/ES internationalization (i18n)
- [ ] Automated tests with Vitest + Testing Library
- [ ] Dark mode
- [ ] Donation goal progress widget (embeddable)

---

## Author

**José Valduz**
Computer Engineering student · Universidad Nacional Experimental del Táchira (UNET)

[![GitHub](https://img.shields.io/badge/GitHub-Valduz--Jose-181717?logo=github)](https://github.com/Valduz-Jose)
[![Email](https://img.shields.io/badge/Email-jose.valduz%40unet.edu.ve-EA4335?logo=gmail&logoColor=white)](mailto:jose.valduz@unet.edu.ve)

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
Built with 💚 for the students of CEII
</div>
