import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration - Allow your frontend
app.use(cors({
  origin: ['https://menix.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Helper functions
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

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Menix Backend is working! 🚀'
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  try {
    console.log('🔐 Login request:', req.body);
    
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username/email and password are required'
      });
    }

    const users = readJsonFile('users.json');
    console.log('👥 Users loaded:', users.length);
    
    const user = users.find(u => 
      (u.username && u.username.toLowerCase() === identifier.toLowerCase()) ||
      (u.email && u.email.toLowerCase() === identifier.toLowerCase())
    );

    if (!user) {
      console.log('❌ User not found:', identifier);
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    if (user.password !== password) {
      console.log('❌ Invalid password for:', identifier);
      return res.status(401).json({
        success: false,
        error: 'Invalid password'
      });
    }

    const { password: _, ...userResponse } = user;
    
    console.log('✅ Login successful:', identifier);
    res.json({
      success: true,
      user: userResponse,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('💥 Login error:', error);
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
    console.error('💥 Register error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Tournaments endpoint
app.get('/tournaments', (req, res) => {
  try {
    const tournaments = readJsonFile('tournaments.json');
    res.json(tournaments);
  } catch (error) {
    console.error('💥 Tournaments error:', error);
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
});

// User endpoint
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
    console.error('💥 Get user error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: '🎉 Menix Backend is working perfectly!',
    timestamp: new Date().toISOString(),
    endpoints: ['/login', '/register', '/tournaments', '/user/:id', '/health', '/test'],
    status: 'Ready for production! 🚀'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Menix Backend running on port ${PORT}`);
  console.log(`📡 CORS enabled for: https://menix.vercel.app`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
  console.log(`🧪 Test: http://localhost:${PORT}/test`);
}); 