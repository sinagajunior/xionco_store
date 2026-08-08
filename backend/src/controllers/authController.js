const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const googleCallback = (req, res) => {
  const token = generateToken(req.user);
  // Redirect to frontend with token
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?token=${token}`);
};

const facebookCallback = (req, res) => {
  const token = generateToken(req.user);
  // Redirect to frontend with token
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?token=${token}`);
};

const devLogin = (req, res) => {
  // Development only - generate token for dev user
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'Not available in production' });
  }

  const devUser = {
    id: '1',
    email: 'dev@xionco.local',
    name: 'Dev User'
  };

  const token = generateToken(devUser);
  res.json({ token, user: devUser });
};

const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  generateToken,
  googleCallback,
  facebookCallback,
  devLogin,
  logout
};
