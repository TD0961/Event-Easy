const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log("Generated token:", token);
    const frontendUrl = process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL
      : 'http://localhost:5173';
    // Pass isNewUser flag to frontend
    const isNewUser = req.user.isNewUser ? 'true' : 'false';
    res.redirect(`${frontendUrl}/oauth-success?token=${token}&role=${req.user.role}&new=${isNewUser}`);
  }
);

module.exports = router;