const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

const db = new Database('qa_system.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    diagnostic_center TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS qa_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    diagnostic_center TEXT NOT NULL,
    department TEXT NOT NULL,
    month TEXT NOT NULL,
    year INTEGER NOT NULL,
    total_specimen INTEGER DEFAULT 0,
    total_stat_specimen INTEGER DEFAULT 0,
    total_qc INTEGER DEFAULT 0,
    total_failed_qc INTEGER DEFAULT 0,
    total_panic_result INTEGER DEFAULT 0,
    informed_panic_results INTEGER DEFAULT 0,
    not_informed_panic_results INTEGER DEFAULT 0,
    rejected_sample INTEGER DEFAULT 0,
    hemolysed_sample INTEGER DEFAULT 0,
    unsatisfactory_sample INTEGER DEFAULT 0,
    shipment_verification INTEGER DEFAULT 0,
    qc_lot_verification INTEGER DEFAULT 0,
    eqa TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(diagnostic_center, department, month, year)
  );
`);

const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (username, password, role, diagnostic_center) VALUES (?, ?, ?, ?)').run('admin', hashedPassword, 'admin', 'HQ');
}

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'qa-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

const requireAuth = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = user;
    res.json({ success: true, role: user.role });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json({ 
      username: req.session.user.username, 
      role: req.session.user.role,
      diagnostic_center: req.session.user.diagnostic_center 
    });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

app.get('/admin', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/diagnostic-center', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'diagnostic-center.html'));
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/api/diagnostic-centers', requireAdmin, (req, res) => {
  const centers = db.prepare('SELECT id, username, diagnostic_center, created_at FROM users WHERE role = ?').all('center');
  res.json(centers);
});

app.post('/api/diagnostic-centers', requireAdmin, (req, res) => {
  const { username, password, diagnostic_center } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  try {
    db.prepare('INSERT INTO users (username, password, role, diagnostic_center) VALUES (?, ?, ?, ?)').run(username, hashedPassword, 'center', diagnostic_center);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

app.delete('/api/diagnostic-centers/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/qa-data', requireAuth, (req, res) => {
  let query = 'SELECT * FROM qa_data';
  const params = [];
  
  if (req.session.user.role === 'center') {
    query += ' WHERE diagnostic_center = ?';
    params.push(req.session.user.diagnostic_center);
  }
  
  query += ' ORDER BY year DESC, month DESC';
  const data = db.prepare(query).all(...params);
  res.json(data);
});

app.post('/api/qa-data', requireAuth, (req, res) => {
  const { diagnostic_center, department, month, year, data } = req.body;
  
  const stmt = db.prepare(`
    INSERT INTO qa_data (diagnostic_center, department, month, year, total_specimen, total_stat_specimen, total_qc, total_failed_qc, total_panic_result, informed_panic_results, not_informed_panic_results, rejected_sample, hemolysed_sample, unsatisfactory_sample, shipment_verification, qc_lot_verification, eqa)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(diagnostic_center, department, month, year) DO UPDATE SET
      total_specimen = excluded.total_specimen,
      total_stat_specimen = excluded.total_stat_specimen,
      total_qc = excluded.total_qc,
      total_failed_qc = excluded.total_failed_qc,
      total_panic_result = excluded.total_panic_result,
      informed_panic_results = excluded.informed_panic_results,
      not_informed_panic_results = excluded.not_informed_panic_results,
      rejected_sample = excluded.rejected_sample,
      hemolysed_sample = excluded.hemolysed_sample,
      unsatisfactory_sample = excluded.unsatisfactory_sample,
      shipment_verification = excluded.shipment_verification,
      qc_lot_verification = excluded.qc_lot_verification,
      eqa = excluded.eqa
  `);
  
  stmt.run(
    diagnostic_center, department, month, year,
    data.total_specimen || 0,
    data.total_stat_specimen || 0,
    data.total_qc || 0,
    data.total_failed_qc || 0,
    data.total_panic_result || 0,
    data.informed_panic_results || 0,
    data.not_informed_panic_results || 0,
    data.rejected_sample || 0,
    data.hemolysed_sample || 0,
    data.unsatisfactory_sample || 0,
    data.shipment_verification || 0,
    data.qc_lot_verification || 0,
    data.eqa || ''
  );
  
  res.json({ success: true });
});

app.get('/api/qa-data/:center/:department/:month/:year', requireAuth, (req, res) => {
  const { center, department, month, year } = req.params;
  const data = db.prepare('SELECT * FROM qa_data WHERE diagnostic_center = ? AND department = ? AND month = ? AND year = ?').get(center, department, month, year);
  res.json(data || {});
});

app.get('/api/analytics', requireAdmin, (req, res) => {
  const { month, year, diagnostic_center } = req.query;
  
  let query = 'SELECT * FROM qa_data WHERE 1=1';
  const params = [];
  
  if (month) { query += ' AND month = ?'; params.push(month); }
  if (year) { query += ' AND year = ?'; params.push(year); }
  if (diagnostic_center) { query += ' AND diagnostic_center = ?'; params.push(diagnostic_center); }
  
  const data = db.prepare(query).all(...params);
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
