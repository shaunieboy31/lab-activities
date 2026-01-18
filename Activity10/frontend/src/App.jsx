import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  checkIn,
  confirmPayment,
  createEvent,
  updateEvent,
  createRegistration,
  updateRegistration,
  cancelRegistration,
  suspendEvent,
  activateEvent,
  deleteEvent,
  loginOrganizer,
  loginAdmin,
  fetchEvents,
  fetchRegistrations,
  getRegistration,
  fetchOrganizers,
  createOrganizer,
  updateOrganizer,
  deleteOrganizer,
  fetchAnnouncements,
  createAnnouncement
} from './api';

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : 'TBA');
const formatMessage = (msg) => {
  if (!msg) return '';
  if (typeof msg === 'string') {
    try {
      const parsed = JSON.parse(msg);
      if (parsed?.message) return parsed.message;
    } catch (_) {
      // plain string, fall through
    }
    return msg;
  }
  if (msg?.message) return msg.message;
  return String(msg);
};

export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinId, setCheckinId] = useState('');
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [role, setRole] = useState('attendee');
  const [organizerKey, setOrganizerKey] = useState('');
  const [organizerAuthed, setOrganizerAuthed] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [organizers, setOrganizers] = useState([]);
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', capacity: 100, price: 0 });
  const [eventLoading, setEventLoading] = useState(false);
  const [editingEventId, setEditingEventId] = useState('');
  const [eventActionId, setEventActionId] = useState('');
  const [organizerConfirmId, setOrganizerConfirmId] = useState('');
  const [registrationPage, setRegistrationPage] = useState(0);
  const [eventSearch, setEventSearch] = useState('');
  const [eventStatusFilter, setEventStatusFilter] = useState('all');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [attendeeStatusFilter, setAttendeeStatusFilter] = useState('all');
  const [editingTicket, setEditingTicket] = useState(false);
  const [updateForm, setUpdateForm] = useState({ name: '', email: '', company: '' });
  const [announcements, setAnnouncements] = useState([]);
  const [selectedEventForAnnouncements, setSelectedEventForAnnouncements] = useState('');
  const [announcementForm, setAnnouncementForm] = useState({ subject: '', message: '' });
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const [registrationEventFilter, setRegistrationEventFilter] = useState('all');

  const loadData = async () => {
    try {
      const [evs, regs] = await Promise.all([fetchEvents(), fetchRegistrations()]);
      setEvents(evs);
      setRegistrations(regs);
      
      // Load organizers if admin
      if (adminAuthed && adminKey) {
        try {
          const orgs = await fetchOrganizers(adminKey);
          setOrganizers(orgs);
        } catch (err) {
          console.error('Failed to load organizers:', err);
        }
      }
    } catch (err) {
      setMessage(err.message || 'Could not load data');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [adminAuthed, adminKey]);

  useEffect(() => {
    setRegistrationPage(0);
  }, [registrations]);

  useEffect(() => {
    const savedKey = localStorage.getItem('organizerKey');
    if (!savedKey) return;
    setOrganizerKey(savedKey);
    loginOrganizer(savedKey)
      .then(() => setOrganizerAuthed(true))
      .catch(() => {
        setOrganizerAuthed(false);
        localStorage.removeItem('organizerKey');
      });
  }, []);

  useEffect(() => {
    const savedAdminKey = localStorage.getItem('adminKey');
    if (!savedAdminKey) return;
    setAdminKey(savedAdminKey);
    loginAdmin(savedAdminKey)
      .then(() => setAdminAuthed(true))
      .catch(() => {
        setAdminAuthed(false);
        localStorage.removeItem('adminKey');
      });
  }, []);

  const paymentStatus = (ticket?.paymentStatus || ticket?.status || 'pending').toLowerCase();

  const selectedEvent = events.find((ev) => ev.id === selectedEventId) || events[0];

  useEffect(() => {
    if (events.length && !selectedEventId) setSelectedEventId(events[0].id);
  }, [events, selectedEventId]);

  const onRegister = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setRegisterLoading(true);
    setMessage('');
    try {
      const created = await createRegistration(selectedEvent.id, { name, email, company });
      setTicket(created);
      setMessage('Registration created. Complete GCash payment, then confirm.');
      loadData();
    } catch (err) {
      setMessage(err.message || 'Registration failed');
    } finally {
      setRegisterLoading(false);
    }
  };

  const onConfirmPayment = async () => {
    if (!ticket) return;
    if ((ticket.paymentStatus || ticket.status) === 'confirmed') return;
    try {
      setConfirmLoading(true);
      await confirmPayment(ticket.id);
      const refreshed = await getRegistration(ticket.id);
      setTicket({ ...ticket, ...refreshed, paymentStatus: 'confirmed' });
      setMessage('Payment marked as confirmed.');
      loadData();
    } catch (err) {
      setMessage(err.message || 'Could not confirm payment');
    } finally {
      setConfirmLoading(false);
    }
  };

  const onOrganizerConfirm = async (regId) => {
    if (!organizerAuthed) {
      setMessage('Organizer login required');
      return;
    }
    setMessage('');
    setOrganizerConfirmId(regId);
    try {
      await confirmPayment(regId);
      await loadData();
      setMessage('Payment marked as confirmed');
    } catch (err) {
      setMessage(err.message || 'Could not confirm payment');
    } finally {
      setOrganizerConfirmId('');
    }
  };

  const onCheckIn = async (idToUse) => {
    const targetId = idToUse || checkinId;
    if (!targetId) return;
    setMessage('');
    try {
      setCheckinLoading(true);
      const resp = await checkIn(targetId);
      setMessage(`Checked in: ${resp.id}`);
      if (ticket && ticket.id === targetId) {
        const refreshed = await getRegistration(targetId);
        setTicket({ ...ticket, ...refreshed });
      }
      loadData();
    } catch (err) {
      setMessage(err.message || 'Check-in failed');
    } finally {
      setCheckinLoading(false);
    }
  };

  const handleScan = (text) => {
    if (!text) return;
    try {
      const parsed = JSON.parse(text);
      if (parsed.ticketId) {
        setCheckinId(parsed.ticketId);
        onCheckIn(parsed.ticketId);
        setScannerEnabled(false);
      }
    } catch (err) {
      setMessage('QR not recognized');
    }
  };

  const copyTicketId = async () => {
    if (!ticket?.id) return;
    try {
      await navigator.clipboard.writeText(ticket.id);
      setMessage('Ticket ID copied');
    } catch (err) {
      setMessage('Clipboard unavailable—copy manually');
    }
  };

  const pasteToCheckin = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCheckinId(text.trim());
    } catch (err) {
      setMessage('Clipboard unavailable—paste manually');
    }
  };

  const onCreateEvent = async (e) => {
    e.preventDefault();
    if (!organizerAuthed) {
      setMessage('Organizer login required to create events');
      return;
    }
    setMessage('');
    try {
      setEventLoading(true);
      
      if (editingEventId) {
        // Update existing event
        await updateEvent(
          editingEventId,
          {
            title: eventForm.title,
            description: eventForm.description,
            date: eventForm.date,
            capacity: Number(eventForm.capacity) || 0,
            price: Number(eventForm.price) || 0
          },
          organizerKey
        );
        setMessage('Event updated');
        setEditingEventId('');
      } else {
        // Create new event
        await createEvent(
          {
            title: eventForm.title,
            description: eventForm.description,
            date: eventForm.date,
            capacity: Number(eventForm.capacity) || 0,
            price: Number(eventForm.price) || 0
          },
          organizerKey
        );
        setMessage('Event created');
      }
      
      setEventForm({ title: '', description: '', date: '', capacity: 100, price: 0 });
      loadData();
    } catch (err) {
      setMessage(err.message || (editingEventId ? 'Could not update event' : 'Could not create event'));
    } finally {
      setEventLoading(false);
    }
  };

  const doEventAction = async (action, eventId) => {
    if (!eventId) return;
    if (!organizerAuthed) {
      setMessage('Organizer login required');
      return;
    }
    setMessage('');
    setEventActionId(eventId);
    try {
      if (action === 'suspend') await suspendEvent(eventId, organizerKey);
      if (action === 'activate') await activateEvent(eventId, organizerKey);
      if (action === 'delete') await deleteEvent(eventId, organizerKey);
      await loadData();
      setMessage(action === 'delete' ? 'Event deleted' : `Event ${action}d`);
    } catch (err) {
      setMessage(err.message || `Could not ${action} event`);
    } finally {
      setEventActionId('');
    }
  };

  const onOrganizerLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await loginOrganizer(organizerKey);
      setOrganizerAuthed(true);
      localStorage.setItem('organizerKey', organizerKey);
      setMessage('Organizer authenticated');
    } catch (err) {
      setOrganizerAuthed(false);
      localStorage.removeItem('organizerKey');
      setMessage(err.message || 'Organizer login failed');
    }
  };

  const onOrganizerLogout = () => {
    setOrganizerAuthed(false);
    setOrganizerKey('');
    localStorage.removeItem('organizerKey');
    setMessage('Organizer logged out');
  };

  const onAdminLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await loginAdmin(adminKey);
      setAdminAuthed(true);
      localStorage.setItem('adminKey', adminKey);
      setMessage('Admin authenticated');
      loadData();
    } catch (err) {
      setAdminAuthed(false);
      localStorage.removeItem('adminKey');
      setMessage(err.message || 'Admin login failed');
    }
  };

  const onAdminLogout = () => {
    setAdminAuthed(false);
    setAdminKey('');
    setOrganizers([]);
    localStorage.removeItem('adminKey');
    setMessage('Admin logged out');
  };

  const onUpdateRegistration = async (e) => {
    e.preventDefault();
    if (!ticket) return;
    setMessage('');
    setConfirmLoading(true);
    try {
      await updateRegistration(ticket.id, updateForm);
      const refreshed = await getRegistration(ticket.id);
      setTicket({ ...ticket, ...refreshed });
      setEditingTicket(false);
      setMessage('Registration updated successfully');
      loadData();
    } catch (err) {
      setMessage(err.message || 'Failed to update registration');
    } finally {
      setConfirmLoading(false);
    }
  };

  const onCancelRegistration = async () => {
    if (!ticket) return;
    if (!confirm('Cancel your registration? This cannot be undone.')) return;
    setMessage('');
    setConfirmLoading(true);
    try {
      await cancelRegistration(ticket.id);
      setTicket(null);
      setMessage('Registration cancelled');
      loadData();
    } catch (err) {
      setMessage(err.message || 'Failed to cancel registration');
    } finally {
      setConfirmLoading(false);
    }
  };

  const loadAnnouncements = async (eventId) => {
    if (!eventId) return;
    try {
      const data = await fetchAnnouncements(eventId);
      setAnnouncements(data);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    }
  };

  const onCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!selectedEventForAnnouncements || !organizerKey) return;
    setMessage('');
    setAnnouncementLoading(true);
    try {
      await createAnnouncement(selectedEventForAnnouncements, announcementForm, organizerKey);
      setAnnouncementForm({ subject: '', message: '' });
      setMessage('Announcement sent to all confirmed attendees!');
      await loadAnnouncements(selectedEventForAnnouncements);
    } catch (err) {
      setMessage(err.message || 'Failed to send announcement');
    } finally {
      setAnnouncementLoading(false);
    }
  };

  useEffect(() => {
    if (!scannerEnabled) return undefined;
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 220 });
    scanner.render((decodedText) => handleScan(decodedText), (error) => console.debug(error));
    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scannerEnabled]);

  return (
    <div className="shell">
      <div className="hero">
        <div>
          <p className="eyebrow">Activity10</p>
          <h1>QR Ticketing + GCash Checkout</h1>
          <p className="muted">Register attendees, show QR tickets, scan or paste for check-in.</p>
        </div>
        <div className="row role-switch">
          <button
            type="button"
            className={`ghost ${role === 'attendee' ? 'active' : ''}`}
            onClick={() => setRole('attendee')}
          >
            Audience
          </button>
          <button
            type="button"
            className={`ghost ${role === 'organizer' ? 'active' : ''}`}
            onClick={() => setRole('organizer')}
          >
            Organizer
          </button>
          <button
            type="button"
            className={`ghost ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
          >
            Admin
          </button>
          <div className="pill outline">Backend: http://localhost:3010 · Frontend: 3011</div>
        </div>
      </div>

      {message && <div className="notice floating">{formatMessage(message)}</div>}

      {role === 'admin' && (
        <div className="card floating" style={{ marginBottom: 16 }}>
          <form className="grid two" onSubmit={onAdminLogin}>
            <label>
              <span className="label">Admin key</span>
              <input
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="enter admin key"
                required
              />
            </label>
            <div className="stack right">
              <span className={`pill small ${adminAuthed ? 'success' : 'pending'}`}>
                {adminAuthed ? 'Authenticated' : 'Not authenticated'}
              </span>
            </div>
            <div className="row">
              <button type="submit">{adminAuthed ? 'Re-authenticate' : 'Log in as admin'}</button>
              {adminAuthed && (
                <button type="button" className="ghost" onClick={onAdminLogout}>
                  Log out
                </button>
              )}
              <span className="muted small">Required to manage organizers and view all data.</span>
            </div>
          </form>
        </div>
      )}

      {role === 'organizer' && (
        <div className="card floating" style={{ marginBottom: 16 }}>
          <form className="grid two" onSubmit={onOrganizerLogin}>
            <label>
              <span className="label">Organizer key</span>
              <input
                value={organizerKey}
                onChange={(e) => setOrganizerKey(e.target.value)}
                placeholder="enter organizer key"
                required
              />
            </label>
            <div className="stack right">
              <span className={`pill small ${organizerAuthed ? 'success' : 'pending'}`}>
                {organizerAuthed ? 'Authenticated' : 'Not authenticated'}
              </span>
            </div>
            <div className="row">
              <button type="submit">{organizerAuthed ? 'Re-authenticate' : 'Log in as organizer'}</button>
              {organizerAuthed && (
                <button type="button" className="ghost" onClick={onOrganizerLogout}>
                  Log out
                </button>
              )}
              <span className="muted small">Required before creating or controlling events.</span>
            </div>
          </form>
        </div>
      )}

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Front desk</p>
            <h2>Register & issue tickets</h2>
          </div>
        </div>

        <div className="grid two">
          <div className="card">
            <div className="card-head">
              <h3>Events</h3>
              <span className="muted">Select and register</span>
            </div>
            {(role === 'organizer' || role === 'admin') && (
              <div className="stack" style={{ marginBottom: 12 }}>
                <label>
                  <span className="label">Search</span>
                  <input
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                    placeholder="Search by title..."
                  />
                </label>
                <div className="row">
                  <button
                    type="button"
                    className={`ghost ${eventStatusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setEventStatusFilter('all')}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={`ghost ${eventStatusFilter === 'active' ? 'active' : ''}`}
                    onClick={() => setEventStatusFilter('active')}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    className={`ghost ${eventStatusFilter === 'suspended' ? 'active' : ''}`}
                    onClick={() => setEventStatusFilter('suspended')}
                  >
                    Suspended
                  </button>
                </div>
              </div>
            )}
            {events.length === 0 && <p className="muted">No events yet.</p>}
            <div className="event-list">
              {events
                .filter(ev => {
                  if (eventSearch && !ev.title.toLowerCase().includes(eventSearch.toLowerCase())) return false;
                  if (eventStatusFilter !== 'all' && (ev.status || 'active') !== eventStatusFilter) return false;
                  return true;
                })
                .map((ev) => (
                <div key={ev.id} className={`event ${selectedEvent?.id === ev.id ? 'active' : ''}`}>
                  <button className="event-select" onClick={() => setSelectedEventId(ev.id)}>
                    <div className="event-row">
                      <strong>{ev.title}</strong>
                      <span className="muted">{formatDate(ev.date)}</span>
                    </div>
                    <p className="muted small">Seats left: {ev.seatsRemaining}</p>
                    <p className="muted small">Status: {ev.status || 'active'}</p>
                  </button>
                  {role === 'organizer' && (
                    <div className="row wrap">
                      <button
                        type="button"
                        className="ghost"
                        disabled={!organizerAuthed}
                        onClick={() => {
                          setEditingEventId(ev.id);
                          setEventForm({
                            title: ev.title,
                            description: ev.description || '',
                            date: ev.date || '',
                            capacity: ev.capacity,
                            price: ev.price
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="ghost"
                        disabled={!organizerAuthed || eventActionId === ev.id || ev.status === 'suspended'}
                        onClick={() => doEventAction('suspend', ev.id)}
                      >
                        {eventActionId === ev.id ? 'Working...' : 'Suspend'}
                      </button>
                      <button
                        type="button"
                        className="ghost"
                        disabled={!organizerAuthed || eventActionId === ev.id || ev.status === 'active'}
                        onClick={() => doEventAction('activate', ev.id)}
                      >
                        {eventActionId === ev.id ? 'Working...' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        className="ghost danger"
                        disabled={!organizerAuthed || eventActionId === ev.id}
                        onClick={() => doEventAction('delete', ev.id)}
                      >
                        {eventActionId === ev.id ? 'Working...' : 'Delete'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Register</h3>
              <span className="muted">Get ticket + GCash QR</span>
            </div>
            <form onSubmit={onRegister} className="stack">
              <label>
                <span className="label">Name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label>
                <span className="label">Email</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />
              </label>
              <label>
                <span className="label">Company (optional)</span>
                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Optional" />
              </label>
              <button type="submit" disabled={registerLoading || !selectedEvent}>
                {registerLoading ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {role === 'organizer' && (
        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Organizer</p>
              <h2>{editingEventId ? 'Edit event' : 'Create new event'}</h2>
            </div>
            {editingEventId && (
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setEditingEventId('');
                  setEventForm({ title: '', description: '', date: '', capacity: 100, price: 0 });
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
          <div className="card">
            <form className="grid two" onSubmit={onCreateEvent}>
              <div className="stack">
                <span className="label">Organizer auth</span>
                <span className={`pill small ${organizerAuthed ? 'success' : 'pending'}`}>
                  {organizerAuthed ? 'Authenticated' : 'Login required'}
                </span>
                <span className="muted small">Use the organizer login above to enable actions.</span>
              </div>
              <label>
                <span className="label">Title</span>
                <input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
              </label>
              <label>
                <span className="label">Description</span>
                <input value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
              </label>
              <label>
                <span className="label">Date/Time (ISO)</span>
                <input value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} placeholder="2026-02-01T10:00" />
              </label>
              <label>
                <span className="label">Capacity</span>
                <input type="number" value={eventForm.capacity} onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })} />
              </label>
              <label>
                <span className="label">Price</span>
                <input type="number" value={eventForm.price} onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })} />
              </label>
              <div className="row">
                <button type="submit" disabled={eventLoading || !organizerAuthed}>
                  {eventLoading
                    ? editingEventId
                      ? 'Updating...'
                      : 'Creating...'
                    : organizerAuthed
                      ? editingEventId
                        ? 'Update Event'
                        : 'Create Event'
                      : 'Login required'}
                </button>
                <span className="muted small">
                  {editingEventId ? 'Editing an existing event.' : 'New events appear in the list immediately.'}
                </span>
              </div>
            </form>
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Ticketing</p>
            <h2>Your Ticket & Payment</h2>
          </div>
          {ticket && (
            <div className="row">
              <button type="button" className="ghost" onClick={() => setTicketModalOpen(true)}>Open Ticket</button>
              <button type="button" className="ghost" onClick={copyTicketId}>Copy ID</button>
            </div>
          )}
        </div>

        <div className="grid two">
          <div className="card tall">
            <div className="card-head">
              <h3>Your Ticket</h3>
              <span className="muted">{paymentStatus === 'confirmed' ? 'Entry QR' : 'Payment QR'}</span>
            </div>
            {!ticket && <p className="muted">Register to see your QR.</p>}
            {ticket && (
              <div className="ticket">
                <div className="status-bar">
                  <span className={`pill small ${paymentStatus === 'confirmed' ? 'success' : 'pending'}`}>
                    Payment: {paymentStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
                  </span>
                  <span className={`pill small ${ticket.checkinAt ? 'success' : 'pending'}`}>
                    Check-in: {ticket.checkinAt ? 'Checked in' : 'Not checked in'}
                  </span>
                </div>
                <div className="ticket-meta">
                  <div>
                    <strong>{ticket.event?.title || selectedEvent?.title}</strong>
                    <p className="muted small">Ticket ID: {ticket.id}</p>
                  </div>
                  <span className={`pill small ${paymentStatus === 'confirmed' ? 'success' : 'pending'}`}>
                    {(ticket.paymentStatus || ticket.status || 'pending').toUpperCase()}
                  </span>
                </div>
                <div className="qr-grid">
                  {paymentStatus !== 'confirmed' ? (
                    <div>
                      <p className="label">GCash QR - Scan to Pay</p>
                      <img src={ticket.gcashQrImage} alt="GCash QR" className="qr" />
                      <p className="muted small" style={{ marginTop: 8 }}>Scan this QR to complete payment via GCash</p>
                    </div>
                  ) : (
                    <div>
                      <p className="label">Entry QR - Scan to Check In</p>
                      <img src={ticket.qrImage} alt="Ticket QR" className="qr" />
                      <p className="muted small" style={{ marginTop: 8 }}>Scan this QR at the event to check in</p>
                    </div>
                  )}
                </div>
                <div className="actions">
                  <button type="button" className="ghost" onClick={copyTicketId}>Copy Ticket ID</button>
                  {role === 'organizer' && organizerAuthed && (
                    <button
                      type="button"
                      onClick={onConfirmPayment}
                      disabled={paymentStatus === 'confirmed' || confirmLoading}
                    >
                      {paymentStatus === 'confirmed'
                        ? 'Payment Confirmed'
                        : confirmLoading
                          ? 'Confirming...'
                          : 'Mark Payment Confirmed'}
                    </button>
                  )}
                  {role !== 'organizer' && paymentStatus !== 'confirmed' && (
                    <span className="pill pending small">Awaiting organizer confirmation</span>
                  )}
                  {ticket.checkinAt && <span className="pill success">Checked in</span>}
                  {role === 'attendee' && !ticket.checkinAt && (
                    <>
                      <button
                        type="button"
                        className="ghost"
                        onClick={() => {
                          setEditingTicket(!editingTicket);
                          if (!editingTicket) {
                            setUpdateForm({
                              name: ticket.name,
                              email: ticket.email,
                              company: ticket.company || ''
                            });
                          }
                        }}
                      >
                        {editingTicket ? 'Cancel Edit' : 'Update Info'}
                      </button>
                      <button
                        type="button"
                        className="ghost danger"
                        onClick={onCancelRegistration}
                        disabled={confirmLoading}
                      >
                        {confirmLoading ? 'Cancelling...' : 'Cancel Registration'}
                      </button>
                    </>
                  )}
                </div>
                {editingTicket && (
                  <form onSubmit={onUpdateRegistration} className="stack" style={{ marginTop: 12 }}>
                    <label>
                      <span className="label">Name</span>
                      <input
                        value={updateForm.name}
                        onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      <span className="label">Email</span>
                      <input
                        type="email"
                        value={updateForm.email}
                        onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      <span className="label">Company (optional)</span>
                      <input
                        value={updateForm.company}
                        onChange={(e) => setUpdateForm({ ...updateForm, company: e.target.value })}
                      />
                    </label>
                    <button type="submit" disabled={confirmLoading}>
                      {confirmLoading ? 'Updating...' : 'Save Changes'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          <div className="card tall">
            <div className="card-head">
              <h3>Check-in</h3>
              <span className="muted">Scan QR or paste ID</span>
            </div>
            <div className="stack">
              <label>
                <span className="label">Ticket ID</span>
                <input value={checkinId} onChange={(e) => setCheckinId(e.target.value)} placeholder="paste or scan" />
              </label>
              <div className="row">
                <button type="button" className="ghost" onClick={() => ticket?.id && setCheckinId(ticket.id)} disabled={!ticket}>
                  Use My Ticket ID
                </button>
                <button type="button" className="ghost" onClick={pasteToCheckin}>Paste from Clipboard</button>
                <button type="button" className="ghost" onClick={copyTicketId} disabled={!ticket}>
                  Copy My Ticket ID
                </button>
              </div>
              <div className="row">
                <button type="button" onClick={() => onCheckIn()} disabled={checkinLoading || ticket?.checkinAt}>
                  {ticket?.checkinAt ? 'Already Checked In' : checkinLoading ? 'Checking in...' : 'Check-in'}
                </button>
                <button type="button" className="ghost" onClick={() => setScannerEnabled((v) => !v)}>
                  {scannerEnabled ? 'Hide Scanner' : 'Open Scanner'}
                </button>
              </div>
              {scannerEnabled && <div id="qr-reader" className="scanner" />}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Activity log</p>
            <h2>Recent Registrations</h2>
          </div>
          <div className="row">
            {(role === 'organizer' || role === 'admin') && (
              <a
                href={`http://localhost:3010/api/registrations/export/csv`}
                download
                className="ghost"
                style={{ textDecoration: 'none', padding: '10px 14px', borderRadius: '10px' }}
              >
                Export CSV
              </a>
            )}
            <span className="muted small">Page {registrationPage + 1} of {Math.max(1, Math.ceil((registrations.filter(reg => {
              if (registrationEventFilter !== 'all' && reg.eventId !== registrationEventFilter) return false;
              if (attendeeSearch && !(reg.name.toLowerCase().includes(attendeeSearch.toLowerCase()) || reg.email.toLowerCase().includes(attendeeSearch.toLowerCase()))) return false;
              if (attendeeStatusFilter === 'confirmed' && reg.status !== 'confirmed') return false;
              if (attendeeStatusFilter === 'pending' && reg.status !== 'pending') return false;
              if (attendeeStatusFilter === 'checkedin' && !reg.checkinAt) return false;
              return true;
            }).length || 0) / 4))}</span>
            <button
              type="button"
              className="ghost"
              disabled={registrationPage === 0}
              onClick={() => setRegistrationPage((p) => Math.max(0, p - 1))}
            >
              Prev
            </button>
            <button
              type="button"
              className="ghost"
              disabled={(registrationPage + 1) * 4 >= registrations.filter(reg => {
                if (registrationEventFilter !== 'all' && reg.eventId !== registrationEventFilter) return false;
                if (attendeeSearch && !(reg.name.toLowerCase().includes(attendeeSearch.toLowerCase()) || reg.email.toLowerCase().includes(attendeeSearch.toLowerCase()))) return false;
                if (attendeeStatusFilter === 'confirmed' && reg.status !== 'confirmed') return false;
                if (attendeeStatusFilter === 'pending' && reg.status !== 'pending') return false;
                if (attendeeStatusFilter === 'checkedin' && !reg.checkinAt) return false;
                return true;
              }).length}
              onClick={() => setRegistrationPage((p) => ((p + 1) * 4 >= registrations.length ? p : p + 1))}
            >
              Next
            </button>
          </div>
        </div>
        <div className="card">
          {(role === 'organizer' || role === 'admin') && (
            <div className="stack" style={{ marginBottom: 12 }}>
              <label>
                <span className="label">Search attendees</span>
                <input
                  value={attendeeSearch}
                  onChange={(e) => {
                    setAttendeeSearch(e.target.value);
                    setRegistrationPage(0);
                  }}
                  placeholder="Search by name or email..."
                />
              </label>
              <div className="row wrap">
                <button
                  type="button"
                  className={`ghost ${attendeeStatusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => { setAttendeeStatusFilter('all'); setRegistrationPage(0); }}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`ghost ${attendeeStatusFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => { setAttendeeStatusFilter('pending'); setRegistrationPage(0); }}
                >
                  Pending
                </button>
                <button
                  type="button"
                  className={`ghost ${attendeeStatusFilter === 'confirmed' ? 'active' : ''}`}
                  onClick={() => { setAttendeeStatusFilter('confirmed'); setRegistrationPage(0); }}
                >
                  Confirmed
                </button>
                <button
                  type="button"
                  className={`ghost ${attendeeStatusFilter === 'checkedin' ? 'active' : ''}`}
                  onClick={() => { setAttendeeStatusFilter('checkedin'); setRegistrationPage(0); }}
                >
                  Checked In
                </button>
              </div>
              <label style={{ marginTop: 12 }}>
                <span className="label">Filter by Event</span>
                <select
                  value={registrationEventFilter}
                  onChange={(e) => {
                    setRegistrationEventFilter(e.target.value);
                    setRegistrationPage(0);
                  }}
                >
                  <option value="all">-- All Events --</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </label>
            </div>
          )}
          {registrations.length === 0 && <p className="muted">No registrations yet.</p>}
          <div className="list">
            {[...registrations]
              .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
              .filter(reg => {
                if (registrationEventFilter !== 'all' && reg.eventId !== registrationEventFilter) return false;
                if (attendeeSearch && !(reg.name.toLowerCase().includes(attendeeSearch.toLowerCase()) || reg.email.toLowerCase().includes(attendeeSearch.toLowerCase()))) return false;
                if (attendeeStatusFilter === 'confirmed' && reg.status !== 'confirmed') return false;
                if (attendeeStatusFilter === 'pending' && reg.status !== 'pending') return false;
                if (attendeeStatusFilter === 'checkedin' && !reg.checkinAt) return false;
                return true;
              })
              .slice(registrationPage * 4, registrationPage * 4 + 4)
              .map((reg) => {
                const regStatus = reg.status || 'pending';
                const checked = !!reg.checkinAt;
                const eventTitle = events.find(e => e.id === reg.eventId)?.title || 'Unknown Event';
                return (
                  <div key={reg.id} className="list-item">
                    <div>
                      <strong>{reg.name}</strong>
                      <p className="muted small">{reg.email}</p>
                      <p className="muted small">{eventTitle}</p>
                      <p className="muted small">{reg.id}</p>
                    </div>
                    <div className="stack right">
                      <span className={`pill small ${regStatus === 'confirmed' ? 'success' : 'pending'}`}>
                        {regStatus.toUpperCase()}
                      </span>
                      <span className={`pill small ${checked ? 'success' : 'pending'}`}>
                        {checked ? 'CHECKED IN' : 'NOT CHECKED'}
                      </span>
                      {role === 'organizer' && organizerAuthed && !checked && regStatus !== 'confirmed' && (
                        <button
                          type="button"
                          className="ghost"
                          disabled={organizerConfirmId === reg.id}
                          onClick={() => onOrganizerConfirm(reg.id)}
                        >
                          {organizerConfirmId === reg.id ? 'Marking...' : 'Mark payment confirmed'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {role === 'organizer' && organizerAuthed && (
        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Organizer</p>
              <h2>Send Announcement</h2>
            </div>
          </div>
          <div className="card">
            <form className="stack" onSubmit={onCreateAnnouncement}>
              <label>
                <span className="label">Select Event</span>
                <select
                  value={selectedEventForAnnouncements}
                  onChange={(e) => {
                    setSelectedEventForAnnouncements(e.target.value);
                    loadAnnouncements(e.target.value);
                  }}
                  required
                >
                  <option value="">-- Choose an event --</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="label">Subject</span>
                <input
                  value={announcementForm.subject}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, subject: e.target.value })}
                  required
                  placeholder="Important Update"
                />
              </label>
              <label>
                <span className="label">Message</span>
                <textarea
                  value={announcementForm.message}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                  rows={4}
                  required
                  placeholder="Dear attendees, we have an important update..."
                />
              </label>
              <button type="submit" disabled={announcementLoading || !selectedEventForAnnouncements}>
                {announcementLoading ? 'Sending...' : 'Send to All Confirmed Attendees'}
              </button>
              <p className="muted small">
                This will email all attendees with confirmed payment for the selected event.
              </p>
            </form>

            {selectedEventForAnnouncements && announcements.length > 0 && (
              <div className="stack" style={{ marginTop: 24 }}>
                <h3>Previous Announcements</h3>
                {announcements.map((ann) => (
                  <div key={ann.id} className="card" style={{ padding: '12px' }}>
                    <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ margin: 0, marginBottom: 4 }}>{ann.subject}</h4>
                        <p style={{ margin: 0, marginBottom: 8 }}>{ann.message}</p>
                        <p className="muted small" style={{ margin: 0 }}>
                          Sent by {ann.createdBy} on {formatDate(ann.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {ticketModalOpen && ticket && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-head">
              <div>
                <p className="eyebrow">Ticket</p>
                <h3>{ticket.event?.title || selectedEvent?.title}</h3>
                <p className="muted small">{ticket.id}</p>
              </div>
              <button type="button" className="ghost" onClick={() => setTicketModalOpen(false)}>Close</button>
            </div>
            <div className="status-bar">
              <span className={`pill small ${paymentStatus === 'confirmed' ? 'success' : 'pending'}`}>
                Payment: {paymentStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
              </span>
              <span className={`pill small ${ticket.checkinAt ? 'success' : 'pending'}`}>
                Check-in: {ticket.checkinAt ? 'Checked in' : 'Not checked in'}
              </span>
            </div>
            <div className="qr-grid">
              {paymentStatus !== 'confirmed' ? (
                <div>
                  <p className="label">GCash QR - Scan to Pay</p>
                  <img src={ticket.gcashQrImage} alt="GCash QR" className="qr" />
                  <p className="muted small" style={{ marginTop: 8 }}>Scan this QR to complete payment via GCash</p>
                </div>
              ) : (
                <div>
                  <p className="label">Entry QR - Scan to Check In</p>
                  <img src={ticket.qrImage} alt="Ticket QR" className="qr" />
                  <p className="muted small" style={{ marginTop: 8 }}>Scan this QR at the event to check in</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {role === 'admin' && adminAuthed && (
        <AdminPanel
          organizers={organizers}
          adminKey={adminKey}
          setMessage={setMessage}
          loadData={loadData}
        />
      )}
    </div>
  );
}

function AdminPanel({ organizers, adminKey, setMessage, loadData }) {
  const [newOrg, setNewOrg] = useState({ name: '', email: '', key: '' });
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(false);

  const onAddOrganizer = async (e) => {
    e.preventDefault();
    if (!newOrg.name || !newOrg.email || !newOrg.key) return;
    setLoading(true);
    try {
      await createOrganizer(newOrg, adminKey);
      setNewOrg({ name: '', email: '', key: '' });
      setMessage('Organizer added successfully');
      loadData();
    } catch (err) {
      setMessage(err.message || 'Failed to add organizer');
    } finally {
      setLoading(false);
    }
  };

  const onToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setEditingId(id);
    try {
      await updateOrganizer(id, { status: newStatus }, adminKey);
      setMessage(`Organizer ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      loadData();
    } catch (err) {
      setMessage(err.message || 'Failed to update organizer');
    } finally {
      setEditingId('');
    }
  };

  const onDeleteOrganizer = async (id) => {
    if (!confirm('Delete this organizer? This action cannot be undone.')) return;
    setEditingId(id);
    try {
      await deleteOrganizer(id, adminKey);
      setMessage('Organizer deleted');
      loadData();
    } catch (err) {
      setMessage(err.message || 'Failed to delete organizer');
    } finally {
      setEditingId('');
    }
  };

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Admin panel</p>
          <h2>Manage Organizers</h2>
        </div>
      </div>

      <div className="grid two">
        <div className="card">
          <div className="card-head">
            <h3>Add Organizer</h3>
          </div>
          <form onSubmit={onAddOrganizer} className="stack">
            <label>
              <span className="label">Name</span>
              <input
                value={newOrg.name}
                onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                required
              />
            </label>
            <label>
              <span className="label">Email</span>
              <input
                type="email"
                value={newOrg.email}
                onChange={(e) => setNewOrg({ ...newOrg, email: e.target.value })}
                required
              />
            </label>
            <label>
              <span className="label">Access Key</span>
              <input
                value={newOrg.key}
                onChange={(e) => setNewOrg({ ...newOrg, key: e.target.value })}
                placeholder="unique key for organizer login"
                required
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Organizer'}
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Organizers</h3>
            <span className="muted">{organizers.length} total</span>
          </div>
          {organizers.length === 0 && <p className="muted">No organizers yet.</p>}
          <div className="list">
            {organizers.map((org) => (
              <div key={org.id} className="list-item">
                <div>
                  <strong>{org.name}</strong>
                  <p className="muted small">{org.email}</p>
                  <p className="muted small">Key: {org.key}</p>
                </div>
                <div className="stack right">
                  <span className={`pill small ${org.status === 'active' ? 'success' : 'pending'}`}>
                    {org.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                  <div className="row">
                    <button
                      type="button"
                      className="ghost"
                      disabled={editingId === org.id}
                      onClick={() => onToggleStatus(org.id, org.status)}
                    >
                      {editingId === org.id ? 'Working...' : org.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      className="ghost danger"
                      disabled={editingId === org.id}
                      onClick={() => onDeleteOrganizer(org.id)}
                    >
                      {editingId === org.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
