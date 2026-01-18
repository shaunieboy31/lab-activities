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

export const updateEvent = async (id, payload, organizerKey) => {
  const res = await fetch(`${API_URL}/api/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(organizerKey ? { 'x-org-key': organizerKey } : {})
    },
    body: JSON.stringify(payload)
  });
  return handle(res, 'Failed to update event');
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

export const loginAdmin = async (adminKey) => {
  const res = await fetch(`${API_URL}/api/auth/admin`, {
    method: 'POST',
    headers: { 'x-admin-key': adminKey }
  });
  return handle(res, 'Admin login failed');
};

export const fetchOrganizers = async (adminKey) => {
  const res = await fetch(`${API_URL}/api/admin/organizers`, {
    headers: { 'x-admin-key': adminKey }
  });
  return handle(res, 'Failed to load organizers');
};

export const createOrganizer = async (payload, adminKey) => {
  const res = await fetch(`${API_URL}/api/admin/organizers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey
    },
    body: JSON.stringify(payload)
  });
  return handle(res, 'Failed to create organizer');
};

export const updateOrganizer = async (id, payload, adminKey) => {
  const res = await fetch(`${API_URL}/api/admin/organizers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey
    },
    body: JSON.stringify(payload)
  });
  return handle(res, 'Failed to update organizer');
};

export const deleteOrganizer = async (id, adminKey) => {
  const res = await fetch(`${API_URL}/api/admin/organizers/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-key': adminKey }
  });
  return handle(res, 'Failed to delete organizer');
};

export const updateRegistration = async (id, payload) => {
  const res = await fetch(`${API_URL}/api/registrations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handle(res, 'Failed to update registration');
};

export const cancelRegistration = async (id) => {
  const res = await fetch(`${API_URL}/api/registrations/${id}`, {
    method: 'DELETE'
  });
  return handle(res, 'Failed to cancel registration');
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

export const fetchAnnouncements = async (eventId) => {
  const res = await fetch(`${API_URL}/api/events/${eventId}/announcements`);
  return handle(res, 'Failed to load announcements');
};

export const createAnnouncement = async (eventId, payload, organizerKey) => {
  const res = await fetch(`${API_URL}/api/events/${eventId}/announcements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...withOrg(organizerKey)
    },
    body: JSON.stringify(payload)
  });
  return handle(res, 'Failed to create announcement');
};
