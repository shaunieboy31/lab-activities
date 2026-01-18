import cors from 'cors';
import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

const app = express();
const PORT = process.env.PORT || 3010;
const ORG_KEY = process.env.ORG_KEY || 'admin';

const requireOrganizer = (req, res, next) => {
  if (!ORG_KEY) return res.status(401).json({ message: 'Organizer key not configured' });
  if (req.headers['x-org-key'] !== ORG_KEY) return res.status(401).json({ message: 'Invalid organizer key' });
  return next();
};

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbFile = path.join(dataDir, 'activity10.json');
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { events: [], registrations: [] });

await db.read();
db.data ||= { events: [], registrations: [] };

// Ensure existing records have defaults even if older data lacks fields
const backfillEvents = async () => {
  let dirty = false;
  db.data.events = (db.data.events || []).map((ev) => {
    if (!ev.status) {
      dirty = true;
      return { ...ev, status: 'active' };
    }
    return ev;
  });
  if (dirty) await save();
};

const save = () => db.write();

const seedIfEmpty = async () => {
  if ((db.data.events || []).length > 0) return;
  const seedEvent = {
    id: randomUUID(),
    title: 'TechFest 2026',
    description: 'Campus tech showcase with demos, talks, and startup booths.',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    capacity: 120,
    price: 100,
    status: 'active',
    createdAt: new Date().toISOString()
  };
  db.data.events.push(seedEvent);
  await save();
};

await seedIfEmpty();
await backfillEvents();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/organizer', (req, res) => {
  if (!ORG_KEY) return res.status(401).json({ message: 'Organizer key not configured' });
  if (req.headers['x-org-key'] !== ORG_KEY) return res.status(401).json({ message: 'Invalid organizer key' });
  res.json({ message: 'Authorized' });
});

const getEventWithStats = (eventId) => {
  const event = db.data.events.find((ev) => ev.id === eventId);
  if (!event) return null;
  const reserved = db.data.registrations.filter((r) => r.eventId === eventId && ['pending', 'confirmed'].includes(r.status)).length;
  const checkedIn = db.data.registrations.filter((r) => r.eventId === eventId && r.checkinAt).length;
  return {
    ...event,
    reserved,
    seatsRemaining: Math.max(event.capacity - reserved, 0),
    checkedIn
  };
};

app.get('/api/events', (_req, res) => {
  const sorted = [...db.data.events].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  res.json(sorted.map((ev) => getEventWithStats(ev.id)));
});

app.post('/api/events', requireOrganizer, async (req, res) => {
  const { title, description = '', date, capacity = 100, price = 0 } = req.body || {};
  if (!title) return res.status(400).json({ message: 'title is required' });
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  db.data.events.push({ id, title, description, date: date || null, capacity, price, status: 'active', createdAt });
  await save();
  res.status(201).json(getEventWithStats(id));
});

app.get('/api/events/:id', (req, res) => {
  const event = getEventWithStats(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

app.post('/api/events/:id/suspend', requireOrganizer, async (req, res) => {
  const event = db.data.events.find((ev) => ev.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  event.status = 'suspended';
  await save();
  res.json(getEventWithStats(event.id));
});

app.post('/api/events/:id/activate', requireOrganizer, async (req, res) => {
  const event = db.data.events.find((ev) => ev.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  event.status = 'active';
  await save();
  res.json(getEventWithStats(event.id));
});

app.delete('/api/events/:id', requireOrganizer, async (req, res) => {
  const idx = db.data.events.findIndex((ev) => ev.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Event not found' });
  const eventId = db.data.events[idx].id;
  db.data.events.splice(idx, 1);
  db.data.registrations = db.data.registrations.filter((r) => r.eventId !== eventId);
  await save();
  res.json({ message: 'Event deleted', id: eventId });
});

const generateQr = async (payload) => QRCode.toDataURL(payload);

app.post('/api/events/:id/register', async (req, res) => {
  try {
    const event = db.data.events.find((ev) => ev.id === req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.status === 'suspended') return res.status(400).json({ message: 'Event is suspended' });
    if (event.status === 'deleted') return res.status(404).json({ message: 'Event not found' });
    const { name, email } = req.body || {};
    if (!name || !email) return res.status(400).json({ message: 'name and email are required' });

    const reserved = db.data.registrations.filter((r) => r.eventId === event.id && ['pending', 'confirmed'].includes(r.status)).length;
    if (reserved >= event.capacity) return res.status(400).json({ message: 'Event is full' });

    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const qrPayload = JSON.stringify({ ticketId: id, eventId: event.id, type: 'ticket' });
    const qrImage = await generateQr(qrPayload);
    const gcashPayload = `GCASH:${event.title}|${event.price}|${email}`;
    const gcashQrImage = await generateQr(gcashPayload);

    const status = 'pending';
    db.data.registrations.unshift({
      id,
      eventId: event.id,
      name,
      email,
      status,
      qrPayload,
      qrImage,
      gcashQrImage,
      checkinAt: null,
      createdAt
    });
    await save();

    res.status(201).json({
      id,
      eventId: event.id,
      name,
      email,
      paymentStatus: status,
      qrImage,
      gcashQrImage,
      createdAt,
      event: getEventWithStats(event.id)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not register attendee' });
  }
});

app.get('/api/registrations', (_req, res) => {
  res.json(db.data.registrations);
});

app.get('/api/registrations/:id', (req, res) => {
  const row = db.data.registrations.find((r) => r.id === req.params.id);
  if (!row) return res.status(404).json({ message: 'Registration not found' });
  res.json(row);
});

app.post('/api/registrations/:id/confirm', async (req, res) => {
  const row = db.data.registrations.find((r) => r.id === req.params.id);
  if (!row) return res.status(404).json({ message: 'Registration not found' });
  row.status = 'confirmed';
  await save();
  res.json({ message: 'Payment confirmed', id: req.params.id });
});

app.post('/api/registrations/:id/checkin', async (req, res) => {
  const row = db.data.registrations.find((r) => r.id === req.params.id);
  if (!row) return res.status(404).json({ message: 'Registration not found' });
  row.checkinAt = new Date().toISOString();
  await save();
  res.json({ message: 'Checked in', id: req.params.id, checkinAt: row.checkinAt });
});

app.listen(PORT, () => {
  console.log(`Activity10 API running on http://localhost:${PORT}`);
});
