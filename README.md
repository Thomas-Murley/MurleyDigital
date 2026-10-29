# Murley Digital

A studio site for selling and building websites, plus a private client portal for monthly hosting.

The public site has the work, services, prices, a contact form, and the legal pages. Client accounts are not public. You create an invite, choose the monthly amount from the real hosting cost, and send the link. The client sets a password and adds a card for that amount. They cannot change the price.

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If `ADMIN_PASSWORD` is empty the first time the data file is created, the login is written to `data/generated-admin-password.txt`. The desk will ask you to change that password. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local` before the first boot if you want to choose them yourself.

```bash
npm test
npm run build
npm start
```

## What you do with a new client

1. Sign in at `/login`. You land in the desk.
2. Open **Invites** and set the client, the site, and the monthly amount. Plan buttons are starting points. Type the real number.
3. Copy the link, or copy the email draft, and send it yourself. This app does not send mail.
4. The client opens the link, creates a password, and adds a payment method. The first hosting period is recorded when the card is saved. The same amount runs each month until they cancel.
5. Change a rate, pause, or cancel from the client page. A rate change applies on the next charge. Tell them at least 14 days ahead. That notice is also in the billing terms.

There is no public sign-up button.

## Payments

Without Stripe, billing is a demonstration ledger. The card form rejects real card numbers and only accepts the test numbers shown on that screen. It stores the brand, last four, and expiry. It does not store the full number or the security code, and it does not charge a bank.

Before you invite a real client, connect Stripe:

1. Put `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in the environment.
2. Point a Stripe webhook at `https://YOUR_DOMAIN/api/stripe/webhook`.
3. Subscribe to `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, and `customer.subscription.deleted`.
4. Set `NEXT_PUBLIC_SITE_URL` to the public origin, with no trailing slash.
5. Restart the server. New accounts then use Stripe Checkout. Accounts already opened in demonstration mode stay on the ledger.

Use Stripe test keys first. The settings page shows whether the key is live or test.

To record charges when nobody has the portal open, call this once a day:

```bash
curl -X POST https://YOUR_DOMAIN/api/cron/billing \
  -H "Authorization: Bearer $CRON_SECRET"
```

Opening the desk or a client portal also catches up anything that is due.

## Edit the public site

| What | Where |
| --- | --- |
| Projects, packages, services, questions | `lib/content.ts` |
| Studio name, public email, phone, location | Desk, Settings |
| Terms, privacy, billing copy | `lib/legal.ts` |

The projects in `lib/content.ts` are starter examples so the portfolio has a shape. Replace them with your own work, and replace the figures, before you treat the site as a record of real engagements.

Have a lawyer review the terms, privacy notice, and billing terms before you rely on them. Set the legal name in Settings. Name the governing state in each project proposal. The terms say the proposal wins if it conflicts.

## Where data lives

Accounts, invites, invoices, and contact messages are in `data/store.json` on the server disk. Host this on a machine with a persistent disk. A serverless host that wipes the filesystem will forget your clients. Passwords are hashed. Session cookies are signed with `SESSION_SECRET` (or a secret created in `data/session-secret`).

Project build fees are not charged in the portal. Invoice those directly. The portal is only for the monthly hosting subscription.
