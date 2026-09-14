# Ship Desk

Internal tool the operations team uses to fulfil customer orders: browse and search orders, filter by status, open an order, mark it shipped with a tracking number, and plan upcoming shipments on a month-by-month calendar.

## Setup

```bash
npm install
npm run dev
```

Opens at http://localhost:5173.

## Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Type check (`tsc --noEmit`) then production build |
| `npm run preview` | Serve the production build locally |
| `npm run format` | Prettier over `src/` |

## Pages

| Route | What it does |
|-------|--------------|
| `/orders` | Order list — search, status tabs, pagination, summary stats, "Mark shipped" on pending rows |
| `/orders/:public_id` | Single order — full details, "Mark shipped" if still pending |
| `/orders/calendar` | Shipping calendar — shipments grouped by month, pin an order to a month |

## API

| Method | Path | Body | Returns |
|--------|------|------|---------|
| `GET` | `/admin/orders?page&limit&search&status` | — | `{ data: Order[], _metadata }` |
| `GET` | `/admin/orders/:public_id` | — | `{ status, data: Order }` |
| `PATCH` | `/admin/orders/:public_id/ship` | `{ tracking_number: string, carrier: 'aramex' \| 'bosta' \| 'dhl' }` | `{ status, data: Order }` |

List responses carry a `_metadata` block with pagination plus `total_revenue` and `pending_count` across all matching records. Validation errors come back as `422 { message, errors: { field: string[] } }`.

## Stack

React 19, TypeScript, Vite, TanStack Query v5, React Router v7, styled-components, react-hook-form + zod.