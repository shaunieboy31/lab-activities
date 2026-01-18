# Activity10 - QR Ticketing + GCash Checkout

## Run
- Backend: `cd Activity10/backend && npm start` (uses http://localhost:3010)
- Frontend: `cd Activity10/frontend && npm run dev -- --host --port 3011`
- Override API URL for the frontend with `VITE_API_URL`.

## No-camera flow
1) Register for an event (pre-seeded TechFest 2026). The ticket card shows the Ticket ID and two QRs (entry + GCash).
2) Click **Copy Ticket ID** in the ticket card.
3) Click **Mark Payment Confirmed**.
4) Paste the Ticket ID into the Check-in card and press **Check-in**.

## Smoke test (API only)
- `cd Activity10/backend && npm run smoke`
- What it does: ensures an event exists, registers a fake attendee, marks payment confirmed, checks in the ticket, and prints the final state.

## Notes
- Data is persisted to `Activity10/backend/data/activity10.json`.
- GCash QR is simulated as a generated QR payload for demo/testing.
- Camera scanner uses `html5-qrcode`—only needed if you want live scan; the no-camera flow works via pasted Ticket ID.
