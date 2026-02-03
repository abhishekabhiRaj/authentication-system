const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Hardcoded user for assignment (no database required)
const HARDCODED_USER = {
  email: 'user@example.com',
  password: 'password123',
};

app.use(cors());
app.use(express.json());

/**
 * POST /api/login
 * Accepts email & password, validates input, returns success or error.
 */
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Validate input - required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
    });
  }

  // Check credentials against hardcoded user
  if (email === HARDCODED_USER.email && password === HARDCODED_USER.password) {
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: { email: HARDCODED_USER.email },
    });
  }

  // Invalid credentials
  return res.status(401).json({
    success: false,
    message: 'Invalid email or password.',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
