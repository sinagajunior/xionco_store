const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');
const pool = require('./database');
require('dotenv').config();

// Google OAuth2
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, displayName, emails, photos } = profile;
    const email = emails && emails[0] ? emails[0].value : null;
    const avatar = photos && photos[0] ? photos[0].value : null;

    // Upsert user
    const result = await pool.query(
      `INSERT INTO users (provider, provider_id, name, email, avatar_url)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (provider, provider_id) DO UPDATE SET
       name = EXCLUDED.name, email = EXCLUDED.email, avatar_url = EXCLUDED.avatar_url
       RETURNING id, provider, provider_id, name, email`,
      ['google', id, displayName, email, avatar]
    );

    const user = result.rows[0];
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Facebook OAuth2
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: '/api/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'photos', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, displayName, emails, photos } = profile;
    const email = emails && emails[0] ? emails[0].value : null;
    const avatar = photos && photos[0] ? photos[0].value : null;

    // Upsert user
    const result = await pool.query(
      `INSERT INTO users (provider, provider_id, name, email, avatar_url)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (provider, provider_id) DO UPDATE SET
       name = EXCLUDED.name, email = EXCLUDED.email, avatar_url = EXCLUDED.avatar_url
       RETURNING id, provider, provider_id, name, email`,
      ['facebook', id, displayName, email, avatar]
    );

    const user = result.rows[0];
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
