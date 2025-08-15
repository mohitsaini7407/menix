import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;

// Middleware
app.use(express.json());
app.use(cors());

// Read users from users.json
const getUsersFromFile = () => {
  try {
    const usersPath = path.join(__dirname, 'users.json');
    const usersData = fs.readFileSync(usersPath, 'utf8');
    return JSON.parse(usersData);
  } catch (error) {
    console.error('Error reading users.json:', error);
    return [];
  }
};

// Login endpoint
app.post('/login', (req, res) => {
  const { identifier, password } = req.body;
  
  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      error: 'Username/email and password are required'
    });
  }

  const users = getUsersFromFile();
  const user = users.find(u => 
    (u.username && u.username.toLowerCase() === identifier.toLowerCase()) ||
    (u.email && u.email.toLowerCase() === identifier.toLowerCase())
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'User not found'
    });
  }

  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      error: 'Invalid password'
    });
  }

  // Remove password from response
  const { password: _, ...userResponse } = user;
  
  res.json({
    success: true,
    user: userResponse,
    message: 'Login successful'
  });
});

// Get user by ID endpoint
app.get('/user/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const users = getUsersFromFile();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  const { password: _, ...userResponse } = user;
  res.json({
    success: true,
    user: userResponse
  });
});

// Register endpoint (optional)
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Username, email, and password are required'
    });
  }

  const users = getUsersFromFile();
  
  // Check if user already exists
  const existingUser = users.find(u => 
    u.username.toLowerCase() === username.toLowerCase() ||
    u.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: 'User already exists'
    });
  }

  // Create new user
  const newUser = {
    id: Math.max(...users.map(u => u.id), 0) + 1,
    username,
    email,
    password,
    wallet: 0
  };

  users.push(newUser);

  // Write back to file
  try {
    const usersPath = path.join(__dirname, 'users.json');
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    
    const { password: _, ...userResponse } = newUser;
    res.json({
      success: true,
      user: userResponse,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Error writing users.json:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user'
    });
  }
});

// Tournaments endpoint
app.get('/tournaments', (req, res) => {
  try {
    const tournamentsPath = path.join(__dirname, 'tournaments.json');
    const tournamentsData = fs.readFileSync(tournamentsPath, 'utf8');
    const tournaments = JSON.parse(tournamentsData);
    res.json(tournaments);
  } catch (error) {
    console.error('Error reading tournaments.json:', error);
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
});

// Create tournament endpoint
app.post('/tournaments', (req, res) => {
  try {
    const tournamentsPath = path.join(__dirname, 'tournaments.json');
    const tournamentsData = fs.readFileSync(tournamentsPath, 'utf8');
    const tournaments = JSON.parse(tournamentsData);
    
    const newTournament = {
      id: Math.max(...tournaments.map(t => t.id), 0) + 1,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    tournaments.push(newTournament);
    fs.writeFileSync(tournamentsPath, JSON.stringify(tournaments, null, 2));
    
    res.json(newTournament);
  } catch (error) {
    console.error('Error creating tournament:', error);
    res.status(500).json({ error: 'Failed to create tournament' });
  }
});

// Register team for tournament endpoint
app.post('/tournaments/:id/register', (req, res) => {
  try {
    const tournamentsPath = path.join(__dirname, 'tournaments.json');
    const tournamentsData = fs.readFileSync(tournamentsPath, 'utf8');
    const tournaments = JSON.parse(tournamentsData);
    
    const tournamentId = parseInt(req.params.id);
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    
    if (!tournament.registeredTeams) {
      tournament.registeredTeams = [];
    }
    
    const newTeam = {
      id: Math.max(...tournament.registeredTeams.map(team => team.id), 0) + 1,
      ...req.body,
      registeredAt: new Date().toISOString()
    };
    
    tournament.registeredTeams.push(newTeam);
    fs.writeFileSync(tournamentsPath, JSON.stringify(tournaments, null, 2));
    
    res.json({ success: true, team: newTeam });
  } catch (error) {
    console.error('Error registering team:', error);
    res.status(500).json({ error: 'Failed to register team' });
  }
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
