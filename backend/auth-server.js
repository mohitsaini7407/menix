const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

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

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
