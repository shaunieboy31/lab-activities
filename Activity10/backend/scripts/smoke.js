/*
  Quick smoke test (no camera):
  - Ensures there is at least one event (creates one if empty)
  - Registers a fake attendee
  - Marks payment as confirmed
  - Checks in the ticket
*/
const API = process.env.API_URL || 'http://localhost:3010';

const request = async (path, options = {}) => {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status} on ${path}: ${body}`);
  }
  return res.json();
};

const main = async () => {
  console.log('API:', API);

  let events = await request('/api/events');
  if (!events.length) {
    console.log('No events found, creating one...');
    const created = await request('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Smoke Event',
        description: 'Auto-created for smoke test',
        capacity: 10,
        price: 0,
      }),
    });
    events = [created];
  }

  const event = events[0];
  console.log('Using event:', event.title, event.id);

  const reg = await request(`/api/events/${event.id}/register`, {
    method: 'POST',
    body: JSON.stringify({ name: 'Smoke Tester', email: 'smoke@test.local' }),
  });
  console.log('Registered ticket:', reg.id);

  await request(`/api/registrations/${reg.id}/confirm`, { method: 'POST' });
  console.log('Payment confirmed');

  await request(`/api/registrations/${reg.id}/checkin`, { method: 'POST' });
  console.log('Checked in');

  const final = await request(`/api/registrations/${reg.id}`);
  console.log('Final state:', {
    status: final.status,
    checkinAt: final.checkinAt,
    eventId: final.eventId,
  });
};

main().catch((err) => {
  console.error('Smoke test failed:', err.message);
  process.exitCode = 1;
});
