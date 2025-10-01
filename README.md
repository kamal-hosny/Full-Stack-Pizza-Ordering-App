### Full Stack Ordering App (Pizza Shop)

A production-ready full‑stack ordering system for a pizza shop. It supports a browsable menu, shopping cart, checkout (Cash on Delivery or Stripe), order management, user management, and a modern responsive UI with Arabic/English localization.

#### Live Demo
- You can run locally following the steps below. Production deployment is straightforward on Vercel.

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Radix UI
- **State**: Redux Toolkit + Redux Persist
- **Auth**: NextAuth.js (with Prisma adapter)
- **Database**: PostgreSQL + Prisma ORM
- **Payments**: Stripe (payment intents + webhooks)
- **Media**: Cloudinary (image uploads)
- **Email**: Resend (order confirmations/status updates)
- **i18n**: Custom dictionaries for `en` and `ar`

### Key Features
- **Menu browsing** with categories, sizes, extras, and product images
- **Cart and checkout** with delivery fee and summary
- **Two payment methods**: Cash on Delivery, Stripe Card
- **Order lifecycle**: Pending → Confirmed → Preparing → Ready → Delivered/Cancelled
- **Admin dashboard**: Manage orders, users, categories, and products
- **User roles**: Super Admin, Admin, User (role-based UI/permissions)
- **Transactional emails**: Confirmation + status updates
- **Internationalization**: Arabic/English with RTL support

### System Design (High Level)
- Next.js App Router renders both public pages and admin portal
- Prisma models: `User`, `Order`, `OrderProduct`, `Product`, `Category`, etc.
- Stripe flow: create Payment Intent → confirm on client → Stripe webhook updates order `paymentStatus`
- Server Actions and API routes handle DB mutations, emails, and uploads

### Getting Started (Local)
1) Install dependencies
```bash
npm install
```
2) Create `.env` and set required variables (see below)
3) Generate Prisma client and run dev
```bash
npx prisma generate
npm run dev
```
Open [`http://localhost:3000`](http://localhost:3000).

### Environment Variables
- `DATABASE_URL` = PostgreSQL connection string
- `STRIPE_SECRET_KEY` = Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` = Webhook signing secret for `api/stripe-webhook`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `RESEND_API_KEY` (for emails)
- `NEXTAUTH_SECRET` and providers’ secrets if applicable
- `NEXT_PUBLIC_BASE_URL` (used in emails/webhooks during development)

### Project Structure (Selected)
- `src/app/[locale]/` public pages (home, menu, cart, contact, profile)
- `src/app/[locale]/admin/` admin portal (orders, users, categories, products)
- `src/app/api/` API routes (payments, emails, uploads, webhooks)
- `src/server/_actions/` server actions (orders, auth)
- `src/lib/` utilities (Stripe, Cloudinary, Prisma, formatting, auth guards)
- `src/dictionaries/` translations (`en.json`, `ar.json`)

### Roles & Permissions
- **Super Admin**: full access
- **Admin**: manage catalog, orders, and users per policy
- **User**: place orders, manage own profile

### Payment Flow (Stripe)
1) Client requests `/api/create-payment-intent` with `orderId`
2) Client confirms card payment with `clientSecret`
3) Stripe sends webhook → server validates signature → updates `paymentStatus`

### Deployment
- Recommended: [Vercel](https://vercel.com) for the Next.js app
- Provision a managed Postgres (e.g., Neon, Supabase), set environment variables, and add Stripe webhook for `your-domain.com/api/stripe-webhook`

### Notes for Reviewers (HR/Recruiters)
- Modern, accessible UI with responsive design
- Clean, typed codebase with clear separation of concerns
- Real integrations (Stripe, Cloudinary, Resend) and role-based admin portal
- Supports RTL and English out of the box

---
For any questions, please reach out and I’ll provide a quick walkthrough or a demo.
