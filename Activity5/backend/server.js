const express = require('express');
const cors = require('cors');
const app = express();

// ---------- ADD/ENSURE THIS IS AT THE TOP (before any redirect or docs) ----------
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
  credentials: true
}));

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  return res.sendStatus(204);
});
// ---------- end added code ----------

/* ...existing routes ... */

// Example: if you currently redirect root to /api/docs, change it to skip OPTIONS:
app.get('/', (req, res) => {
  if (req.method === 'OPTIONS') return res.sendStatus(204); // safety guard
  // only redirect non-OPTIONS requests
  return res.redirect('/api/docs');
});

app.listen(3000, () => console.log('listening on 3000'));