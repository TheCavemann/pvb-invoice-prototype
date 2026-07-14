# PVB Admin Dashboard — Wallets Module Prototype

A front-end-only, clickable prototype of a new **Wallets** module for the
PiggyVest Business (PVB) Admin Dashboard, built for stakeholder review.
There is no backend — all data is realistic mock data generated client-side.

## Stack

- React + Vite
- Tailwind CSS v4
- React Router

## Getting started

```bash
npm install
npm run dev
```

The app opens on `/overview`. Use the sidebar to navigate to **Wallets**
for the fully built page; **Overview** and **Transactions** are simple
stubs included so the prototype feels like a real app.

## Wallets page

- Search across wallet ID, account number, account name, and business name.
- Filter by wallet type, business, branch, date created, balance range, and status.
- A "Preview state" control lets reviewers switch between the Loading, Success,
  and Error states on demand (there's no real network call to trigger them).
- Table pagination with a configurable page size.
