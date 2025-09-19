const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config();

// Database connection
const connectDB = require('./config/database');
const User = require('./models/User');
const Game = require('./models/Game');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      user = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        role: 'user',
        provider: 'google'
      });
      await user.save();
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Connect to database
connectDB();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Routes

// Google OAuth routes
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to game
    res.redirect('http://localhost:3000/game');
  }
);

// Get current user
app.get('/api/auth/user', (req, res) => {
  if (req.user) {
    const { password, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get all signed-in users (for admin)
app.get('/api/users/online', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const existingUser = await User.findOne({ 
      $or: [{ username }, { email: email || null }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user',
      provider: 'local'
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await User.findOne({ username });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
        stats: user.stats
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Game routes
app.get('/api/sudoku/generate/:difficulty', (req, res) => {
  const { difficulty } = req.params;
  const puzzle = generateSudoku(difficulty);
  res.json({ puzzle, solution: solveSudoku([...puzzle.map(row => [...row])]) });
});

app.post('/api/game/save', authenticateToken, async (req, res) => {
  try {
    const { puzzle, currentState, difficulty, timeSpent, mistakes, hintsUsed } = req.body;
    
    const gameData = new Game({
      userId: req.user.id,
      username: req.user.username,
      puzzle,
      currentState,
      difficulty,
      timeSpent,
      mistakes: mistakes || 0,
      hintsUsed: hintsUsed || 0,
      completed: false
    });

    await gameData.save();
    
    res.json({ message: 'Game saved successfully', gameId: gameData._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save game' });
  }
});

app.post('/api/game/complete', authenticateToken, async (req, res) => {
  try {
    const { puzzle, solution, difficulty, timeSpent, mistakes, hintsUsed } = req.body;
    
    // Calculate score based on time, mistakes, and hints
    const baseScore = 1000;
    const timeBonus = Math.max(0, 600 - timeSpent); // Bonus for completing under 10 minutes
    const mistakePenalty = mistakes * 50;
    const hintPenalty = hintsUsed * 25;
    const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 }[difficulty] || 1;
    
    const score = Math.round((baseScore + timeBonus - mistakePenalty - hintPenalty) * difficultyMultiplier);
    
    const gameData = new Game({
      userId: req.user.id,
      username: req.user.username,
      puzzle,
      solution,
      difficulty,
      timeSpent,
      mistakes: mistakes || 0,
      hintsUsed: hintsUsed || 0,
      score: Math.max(0, score),
      completed: true,
      completedAt: new Date()
    });

    await gameData.save();
    
    // Update user stats
    const user = await User.findById(req.user.id);
    user.stats.gamesCompleted += 1;
    user.stats.totalPlayTime += timeSpent;
    
    // Update best time for difficulty
    if (!user.stats.bestTime[difficulty] || timeSpent < user.stats.bestTime[difficulty]) {
      user.stats.bestTime[difficulty] = timeSpent;
    }
    
    await user.save();
    
    res.json({ 
      message: 'Game completed successfully', 
      score: gameData.score,
      stats: user.stats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save completed game' });
  }
});

// Leaderboard routes
app.get('/api/leaderboard/:difficulty?', async (req, res) => {
  try {
    const { difficulty } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const query = { completed: true };
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      query.difficulty = difficulty;
    }
    
    const leaderboard = await Game.find(query)
      .sort({ score: -1, timeSpent: 1 })
      .limit(limit)
      .select('username difficulty score timeSpent completedAt mistakes hintsUsed')
      .lean();
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

app.get('/api/user/stats/:userId?', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const user = await User.findById(userId).select('username stats');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const games = await Game.find({ userId, completed: true })
      .sort({ completedAt: -1 })
      .limit(10)
      .select('difficulty score timeSpent completedAt mistakes hintsUsed');
    
    res.json({
      user: {
        username: user.username,
        stats: user.stats
      },
      recentGames: games
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Admin routes
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/admin/games', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 }).limit(100);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    await User.findByIdAndDelete(userId);
    await Game.deleteMany({ userId });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Sudoku generation and solving functions
function generateSudoku(difficulty = 'medium') {
  const grid = Array(9).fill().map(() => Array(9).fill(0));
  
  // Fill the grid with a valid solution
  fillGrid(grid);
  
  // Remove numbers based on difficulty
  const cellsToRemove = {
    easy: 40,
    medium: 50,
    hard: 60
  }[difficulty] || 50;
  
  removeNumbers(grid, cellsToRemove);
  
  return grid;
}

function fillGrid(grid) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        shuffleArray(numbers);
        
        for (let num of numbers) {
          if (isValidMove(grid, row, col, num)) {
            grid[row][col] = num;
            
            if (fillGrid(grid)) {
              return true;
            }
            
            grid[row][col] = 0;
          }
        }
        
        return false;
      }
    }
  }
  
  return true;
}

function removeNumbers(grid, count) {
  let removed = 0;
  
  while (removed < count) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (grid[row][col] !== 0) {
      grid[row][col] = 0;
      removed++;
    }
  }
}

function isValidMove(grid, row, col, num) {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }
  
  // Check 3x3 box
  const startRow = row - row % 3;
  const startCol = col - col % 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }
  
  return true;
}

function solveSudoku(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(grid, row, col, num)) {
            grid[row][col] = num;
            
            if (solveSudoku(grid)) {
              return grid;
            }
            
            grid[row][col] = 0;
          }
        }
        
        return false;
      }
    }
  }
  
  return grid;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
