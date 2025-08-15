import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
mongoose.connect(
  'mongodb+srv://mohitsaini7407:mohit7407@menix.804cf5m.mongodb.net/menix?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  wallet: Number
});
const User = mongoose.model('users', userSchema);

// Helper function to read JSON files
const readJsonFile = (filename) => {
  try {
    const filePath = path.join(__dirname, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

// Helper function to write JSON files
const writeJsonFile = (filename, data) => {
  try {
    const filePath = path.join(__dirname, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// MongoDB Atlas login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('MongoDB login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// JSON file login endpoint (fallback)
app.post('/login', (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username/email and password are required'
      });
    }

    const users = readJsonFile('users.json');
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
  } catch (error) {
    console.error('JSON login error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Register endpoint
app.post('/register', (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, and password are required'
      });
    }

    const users = readJsonFile('users.json');
    
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

    if (writeJsonFile('users.json', users)) {
      const { password: _, ...userResponse } = newUser;
      res.json({
        success: true,
        user: userResponse,
        message: 'Registration successful'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to register user'
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get user by ID endpoint
app.get('/user/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const users = readJsonFile('users.json');
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
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Tournaments endpoints
app.get('/tournaments', (req, res) => {
  try {
    const tournaments = readJsonFile('tournaments.json');
    res.json(tournaments);
  } catch (error) {
    console.error('Get tournaments error:', error);
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
});

app.post('/tournaments', (req, res) => {
  try {
    const tournaments = readJsonFile('tournaments.json');
    
    const newTournament = {
      id: Math.max(...tournaments.map(t => t.id), 0) + 1,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    tournaments.push(newTournament);
    
    if (writeJsonFile('tournaments.json', tournaments)) {
      res.json(newTournament);
    } else {
      res.status(500).json({ error: 'Failed to create tournament' });
    }
  } catch (error) {
    console.error('Create tournament error:', error);
    res.status(500).json({ error: 'Failed to create tournament' });
  }
});

app.post('/tournaments/:id/register', (req, res) => {
  try {
    const tournaments = readJsonFile('tournaments.json');
    
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
    
    if (writeJsonFile('tournaments.json', tournaments)) {
      res.json({ success: true, team: newTeam });
    } else {
      res.status(500).json({ error: 'Failed to register team' });
    }
  } catch (error) {
    console.error('Register team error:', error);
    res.status(500).json({ error: 'Failed to register team' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));