const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010';

const handle = async (res, fallback) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || fallback);
  }
  return res.json();
};

export const fetchEvents = async () => {
  const res = await fetch(`${API_URL}/api/events`);
  return handle(res, 'Failed to load events');
};

export const createRegistration = async (eventId, payload) => {
  const res = await fetch(`${API_URL}/api/events/${eventId}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handle(res, 'Registration failed');
};

export const confirmPayment = async (registrationId) => {
  const res = await fetch(`${API_URL}/api/registrations/${registrationId}/confirm`, { method: 'POST' });
  return handle(res, 'Confirm failed');
};

export const checkIn = async (registrationId) => {
  const res = await fetch(`${API_URL}/api/registrations/${registrationId}/checkin`, { method: 'POST' });
  return handle(res, 'Check-in failed');
};

export const getRegistration = async (registrationId) => {
  const res = await fetch(`${API_URL}/api/registrations/${registrationId}`);
  return handle(res, 'Ticket not found');
};

export const fetchRegistrations = async () => {
  const res = await fetch(`${API_URL}/api/registrations`);
  return handle(res, 'Failed to load registrations');
};

export const createEvent = async (payload, organizerKey) => {
  const res = await fetch(`${API_URL}/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(organizerKey ? { 'x-org-key': organizerKey } : {})
    },
    body: JSON.stringify(payload)
  });
  return handle(res, 'Failed to create event');
};

const withOrg = (organizerKey) => ({
  ...(organizerKey ? { 'x-org-key': organizerKey } : {})
});

export const loginOrganizer = async (organizerKey) => {
  const res = await fetch(`${API_URL}/api/auth/organizer`, {
    method: 'POST',
    headers: withOrg(organizerKey)
  });
  return handle(res, 'Organizer login failed');
};

export const suspendEvent = async (eventId, organizerKey) => {
  const res = await fetch(`${API_URL}/api/events/${eventId}/suspend`, {
    method: 'POST',
    headers: withOrg(organizerKey)
  });
  return handle(res, 'Failed to suspend');
};

export const activateEvent = async (eventId, organizerKey) => {
  const res = await fetch(`${API_URL}/api/events/${eventId}/activate`, {
    method: 'POST',
    headers: withOrg(organizerKey)
  });
  return handle(res, 'Failed to activate');
};

export const deleteEvent = async (eventId, organizerKey) => {
  const res = await fetch(`${API_URL}/api/events/${eventId}`, {
    method: 'DELETE',
    headers: withOrg(organizerKey)
  });
  return handle(res, 'Failed to delete');
};
