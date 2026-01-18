import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import nodemailer from 'nodemailer';
import swaggerSpec from './swagger.js';

const app = express();
const PORT = process.env.PORT || 3010;
const ORG_KEY = process.env.ORG_KEY || 'admin';
const ADMIN_KEY = process.env.ADMIN_KEY || 'superadmin';

// Email configuration - create test account if no env vars configured
// Default to your Ethereal account unless env vars override
let EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'vernon.rath69@ethereal.email',
    pass: process.env.EMAIL_PASS || 'xkEMbYZMeTfBaCznrZ'
  }
};

// Create email transporter
let emailTransporter = null;

const initializeEmailTransporter = async () => {
  // If env vars are provided, use them
  if (EMAIL_CONFIG.auth.user && EMAIL_CONFIG.auth.pass) {
    emailTransporter = nodemailer.createTransport(EMAIL_CONFIG);
    console.log('[Email] Using configured SMTP credentials');
    return;
  }
  
  // Otherwise create a test account
  try {
    console.log('[Email] Creating test email account via Ethereal...');
    const testAccount = await nodemailer.createTestAccount();
    emailTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('[Email] Test account created successfully');
    console.log('[Email] User:', testAccount.user);
    console.log('[Email] View emails at:', testAccount.web);
  } catch (error) {
    console.error('[Email] Failed to create test account:', error.message);
  }
};

// Initialize email on startup
await initializeEmailTransporter();

// Email helper functions
const sendEmail = async (to, subject, html) => {
  if (!emailTransporter) {
    console.log('[Email] Not configured. Would send:', { to, subject });
    return { success: false, message: 'Email not configured' };
  }
  
  try {
    console.log('[Email] Attempting to send email to:', to);
    const info = await emailTransporter.sendMail({
      from: '"QR Ticketing System" <noreply@qrticket.local>',
      to,
      subject,
      html
    });
    console.log('[Email] ✓ Successfully sent to:', to);
    console.log('[Email] Message ID:', info.messageId);
    if (info.testMessageUrl) {
      console.log('[Email] 📧 Preview URL:', info.testMessageUrl);
    }
    return { success: true };
  } catch (error) {
    console.error('[Email] ✗ Error sending to', to, ':', error.message);
    return { success: false, message: error.message };
  }
};

const sendRegistrationEmail = async (registration, event) => {
  const html = `
    <h2>Registration Confirmed!</h2>
    <p>Dear ${registration.name},</p>
    <p>Thank you for registering for <strong>${event.title}</strong>.</p>
    <p><strong>Event Details:</strong></p>
    <ul>
      <li>Date: ${new Date(event.date).toLocaleString()}</li>
      <li>Price: ₱${event.price}</li>
    </ul>
    <p><strong>Your Ticket ID:</strong> ${registration.id}</p>
    <p><strong>Payment Instructions:</strong></p>
    <p>Please scan the GCash QR code below to complete payment. The organizer will confirm your payment and send you your entry ticket.</p>
    <img src="${registration.gcashQrImage}" alt="GCash Payment QR" style="max-width: 300px; margin: 20px 0;">
    <p>After payment is confirmed, you'll receive another email with your entry QR code to check in at the event.</p>
  `;
  await sendEmail(registration.email, `Registration Confirmed - ${event.title}`, html);
};

const sendPaymentConfirmationEmail = async (registration, event) => {
  const html = `
    <h2>Payment Confirmed! 🎉</h2>
    <p>Dear ${registration.name},</p>
    <p>Your payment for <strong>${event.title}</strong> has been confirmed by the organizer.</p>
    <p><strong>Your Ticket ID:</strong> ${registration.id}</p>
    <p><strong>Event Details:</strong></p>
    <ul>
      <li>Date: ${new Date(event.date).toLocaleString()}</li>
    </ul>
    <p><strong>Your Entry QR Code:</strong></p>
    <p>Scan this QR code at the event to check in:</p>
    <img src="${registration.qrImage}" alt="Entry Ticket QR" style="max-width: 300px; margin: 20px 0;">
    <p>See you at the event!</p>
  `;
  await sendEmail(registration.email, `Payment Confirmed - ${event.title}`, html);
};

const sendAnnouncementEmail = async (registration, event, announcement) => {
  const html = `
    <h2>Event Announcement - ${event.title}</h2>
    <p>Dear ${registration.name},</p>
    <h3>${announcement.subject}</h3>
    <p>${announcement.message}</p>
    <hr>
    <p><small>This announcement was sent by the event organizer.</small></p>
  `;
  await sendEmail(registration.email, `Announcement: ${announcement.subject}`, html);
};

const requireOrganizer = (req, res, next) => {
  const orgKey = req.headers['x-org-key'];
  if (!orgKey) return res.status(401).json({ message: 'Organizer key required' });
  
  // Check if it's a valid organizer from the database
  const organizer = db.data.organizers?.find(o => o.key === orgKey && o.status === 'active');
  if (!organizer) return res.status(401).json({ message: 'Invalid or inactive organizer key' });
  
  req.organizer = organizer;
  return next();
};

const requireAdmin = (req, res, next) => {
  if (!ADMIN_KEY) return res.status(401).json({ message: 'Admin key not configured' });
  if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).json({ message: 'Invalid admin key' });
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
db.data ||= { events: [], registrations: [], organizers: [], announcements: [] };

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
  
  // Seed default organizer if none exist
  if ((db.data.organizers || []).length === 0) {
    const defaultOrganizer = {
      id: randomUUID(),
      name: 'Default Organizer',
      email: 'organizer@example.com',
      key: 'admin',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    db.data.organizers.push(defaultOrganizer);
  }
  
  await save();
};

await seedIfEmpty();
await backfillEvents();

app.use(cors());
app.use(express.json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui { max-width: 1400px; margin: 0 auto; }',
  customSiteTitle: 'QR Ticketing API - Documentation'
}));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/organizer', (req, res) => {
  const orgKey = req.headers['x-org-key'];
  if (!orgKey) return res.status(401).json({ message: 'Organizer key required' });
  
  const organizer = db.data.organizers?.find(o => o.key === orgKey && o.status === 'active');
  if (!organizer) return res.status(401).json({ message: 'Invalid or inactive organizer key' });
  
  res.json({ message: 'Authorized', organizer: { id: organizer.id, name: organizer.name, email: organizer.email } });
});

app.post('/api/auth/admin', (req, res) => {
  if (!ADMIN_KEY) return res.status(401).json({ message: 'Admin key not configured' });
  if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).json({ message: 'Invalid admin key' });
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

app.put('/api/events/:id', requireOrganizer, async (req, res) => {
  const event = db.data.events.find((ev) => ev.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  
  const { title, description, date, capacity, price } = req.body || {};
  if (title !== undefined) event.title = title;
  if (description !== undefined) event.description = description;
  if (date !== undefined) event.date = date;
  if (capacity !== undefined) event.capacity = Number(capacity);
  if (price !== undefined) event.price = Number(price);
  
  await save();
  res.json(getEventWithStats(event.id));
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
    const { name, email, company } = req.body || {};
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
      company: company || '',
      status,
      qrPayload,
      qrImage,
      gcashQrImage,
      checkinAt: null,
      createdAt
    });
    await save();

    // Send registration confirmation email
    const registration = db.data.registrations[0];
    console.log('[Registration] Sending email to:', registration.email);
    await sendRegistrationEmail(registration, event);

    res.status(201).json({
      id,
      eventId: event.id,
      name,
      email,
      company: company || '',
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

app.get('/api/registrations/export/csv', (req, res) => {
  const eventId = req.query.eventId;
  let regs = db.data.registrations || [];
  
  if (eventId) {
    regs = regs.filter(r => r.eventId === eventId);
  }
  
  // CSV header
  const headers = ['ID', 'Name', 'Email', 'Company', 'Event ID', 'Status', 'Checked In', 'Check-in Time', 'Created At'];
  const rows = regs.map(r => [
    r.id,
    r.name,
    r.email,
    r.company || '',
    r.eventId,
    r.status || 'pending',
    r.checkinAt ? 'Yes' : 'No',
    r.checkinAt || '',
    r.createdAt || ''
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="registrations-${Date.now()}.csv"`);
  res.send(csv);
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
  
  // Send payment confirmation email
  const event = db.data.events.find(e => e.id === row.eventId);
  if (event) {
    console.log('[Payment Confirm] Sending email to:', row.email);
    await sendPaymentConfirmationEmail(row, event);
  } else {
    console.log('[Payment Confirm] Event not found for eventId:', row.eventId);
  }
  
  res.json({ message: 'Payment confirmed', id: req.params.id });
});

app.post('/api/registrations/:id/checkin', async (req, res) => {
  const row = db.data.registrations.find((r) => r.id === req.params.id);
  if (!row) return res.status(404).json({ message: 'Registration not found' });
  row.checkinAt = new Date().toISOString();
  await save();
  res.json({ message: 'Checked in', id: req.params.id, checkinAt: row.checkinAt });
});

app.put('/api/registrations/:id', async (req, res) => {
  const row = db.data.registrations.find((r) => r.id === req.params.id);
  if (!row) return res.status(404).json({ message: 'Registration not found' });
  
  const { name, email, company } = req.body || {};
  if (name) row.name = name;
  if (email !== undefined) row.email = email;
  if (company !== undefined) row.company = company;
  
  await save();
  res.json({ message: 'Registration updated', registration: row });
});

app.delete('/api/registrations/:id', async (req, res) => {
  const idx = db.data.registrations.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Registration not found' });
  
  const reg = db.data.registrations[idx];
  db.data.registrations.splice(idx, 1);
  await save();
  res.json({ message: 'Registration cancelled', id: reg.id });
});

// Admin endpoints for organizer management
app.get('/api/admin/organizers', requireAdmin, (_req, res) => {
  res.json(db.data.organizers || []);
});

app.post('/api/admin/organizers', requireAdmin, async (req, res) => {
  const { name, email, key } = req.body || {};
  if (!name || !email || !key) {
    return res.status(400).json({ message: 'name, email, and key are required' });
  }
  
  // Check if key already exists
  if (db.data.organizers?.find(o => o.key === key)) {
    return res.status(400).json({ message: 'Organizer key already exists' });
  }
  
  const id = randomUUID();
  const organizer = {
    id,
    name,
    email,
    key,
    status: 'active',
    createdAt: new Date().toISOString()
  };
  
  db.data.organizers = db.data.organizers || [];
  db.data.organizers.push(organizer);
  await save();
  
  res.status(201).json(organizer);
});

app.put('/api/admin/organizers/:id', requireAdmin, async (req, res) => {
  const organizer = db.data.organizers?.find(o => o.id === req.params.id);
  if (!organizer) return res.status(404).json({ message: 'Organizer not found' });
  
  const { name, email, status } = req.body || {};
  if (name) organizer.name = name;
  if (email) organizer.email = email;
  if (status && ['active', 'inactive'].includes(status)) organizer.status = status;
  
  await save();
  res.json(organizer);
});

app.delete('/api/admin/organizers/:id', requireAdmin, async (req, res) => {
  const idx = db.data.organizers?.findIndex(o => o.id === req.params.id);
  if (idx === undefined || idx === -1) return res.status(404).json({ message: 'Organizer not found' });
  
  db.data.organizers.splice(idx, 1);
  await save();
  res.json({ message: 'Organizer deleted' });
});

// ============= ANNOUNCEMENTS =============

app.get('/api/events/:eventId/announcements', async (req, res) => {
  const eventId = req.params.eventId;
  const announcements = (db.data.announcements || [])
    .filter(a => a.eventId === eventId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(announcements);
});

app.post('/api/events/:eventId/announcements', requireOrganizer, async (req, res) => {
  const eventId = req.params.eventId;
  const event = db.data.events.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  
  const { subject, message } = req.body || {};
  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required' });
  }
  
  const id = randomUUID();
  const announcement = {
    id,
    eventId,
    subject,
    message,
    createdAt: new Date().toISOString(),
    createdBy: req.organizer.name
  };
  
  db.data.announcements = db.data.announcements || [];
  db.data.announcements.push(announcement);
  await save();
  
  // Send announcement email to all confirmed attendees
  const attendees = db.data.registrations.filter(
    r => r.eventId === eventId && r.status === 'confirmed'
  );
  
  for (const attendee of attendees) {
    await sendAnnouncementEmail(attendee, event, announcement);
  }
  
  res.status(201).json(announcement);
});

// Test email endpoint
app.post('/api/test-email', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: 'Email is required' });
  
  const html = `
    <h2>Test Email</h2>
    <p>This is a test email from the QR Ticketing System.</p>
    <p>If you're reading this, emails are working!</p>
  `;
  
  const result = await sendEmail(email, 'Test Email from QR Ticketing', html);
  if (result.success) {
    res.json({ message: 'Test email sent', email });
  } else {
    res.status(500).json({ message: result.message });
  }
});

app.listen(PORT, () => {
  console.log(`Activity10 API running on http://localhost:${PORT}`);
});
