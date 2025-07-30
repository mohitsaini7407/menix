const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const DATA_DIR = __dirname;
const regFile = path.join(DATA_DIR, 'registeredlive.json');
const tournamentsFile = path.join(DATA_DIR, 'tournaments.json');
const usersFile = path.join(DATA_DIR, 'users.json');

function readJson(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// POST /register
app.post('/register', (req, res) => {
  const { userId, tournamentId, teamName } = req.body;
  const users = readJson(usersFile);
  const tournaments = readJson(tournamentsFile);
  const regs = readJson(regFile);

  const user = users.find(u => u.id === userId);
  const tournament = tournaments.find(t => t.id === tournamentId);

  if (!user || !tournament) return res.status(400).json({ error: 'Invalid user or tournament' });
  if (regs.some(r => r.userId === userId && r.tournamentId === tournamentId))
    return res.status(400).json({ error: 'Already registered' });
  if (user.wallet < tournament.entryFee)
    return res.status(400).json({ error: 'Insufficient balance' });
  if (tournament.joined >= tournament.totalSlots)
    return res.status(400).json({ error: 'Tournament full' });

  // Deduct fee, increment joined, save registration
  user.wallet -= tournament.entryFee;
  tournament.joined += 1;
  regs.push({ userId, tournamentId, teamName, registeredAt: new Date().toISOString() });

  writeJson(usersFile, users);
  writeJson(tournamentsFile, tournaments);
  writeJson(regFile, regs);

  res.json({ success: true });
});

// Signup endpoint
app.post('/signup', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) return res.status(400).json({ error: 'Identifier and password required' });

  const users = readJson(usersFile);
  const isEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(identifier);
  const isPhone = /^\d{10}$/.test(identifier);

  if (!isEmail && !isPhone) {
    return res.status(400).json({ error: 'Invalid email or phone number' });
  }

  if (users.find(u => (isEmail ? u.email === identifier : u.phone === identifier))) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    password,
    wallet: 0
  };
  if (isEmail) newUser.email = identifier;
  if (isPhone) newUser.phone = identifier;

  users.push(newUser);
  writeJson(usersFile, users);
  res.json({ success: true, user: newUser });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { identifier, password } = req.body;
  const users = readJson(usersFile);
  const user = users.find(u =>
    ((u.email && u.email === identifier) || (u.phone && u.phone === identifier)) &&
    u.password === password
  );
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ success: true, user });
});

// GET /registrations?userId=...
app.get('/registrations', (req, res) => {
  const { userId } = req.query;
  const regs = readJson(regFile);
  res.json(regs.filter(r => String(r.userId) === String(userId)));
});

// GET /tournaments
app.get('/tournaments', (req, res) => {
  res.json(readJson(tournamentsFile));
});

// GET /users
app.get('/users', (req, res) => {
  res.json(readJson(usersFile));
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Register server running on port ${PORT}`)); 