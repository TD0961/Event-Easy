const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel'); // adjust path as needed

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Collect all emails from Google profile
      const emails = profile.emails ? profile.emails.map(e => e.value) : [];
      let user = await User.findOne({ googleId: profile.id });
      let isNewUser = false;
      if (!user) {
        user = await User.findOne({ email: emails[0] });
        if (user) {
          user.googleId = profile.id;
          await user.save();
        } else {
          // Don't create user yet, let frontend choose email
          // Instead, pass emails to frontend
          return done(null, false, { emails, profile });
        }
      }
      if (!user) {
        return done(new Error("User not found after Google authentication"), null);
      }
      user = user.toObject ? user.toObject() : user;
      user.isNewUser = isNewUser;
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  if (!user) {
    console.error("No user to serialize:", user);
    return done(new Error("No user to serialize"), null);
  }
  // Try both .id and ._id for compatibility
  const userId = user.id || user._id;
  if (!userId) {
    console.error("User object missing id/_id:", user);
    return done(new Error("User object missing id/_id"), null);
  }
  done(null, userId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      console.error("No user found in deserializeUser for id:", id);
      return done(new Error("User not found"), null);
    }
    done(null, user);
  } catch (err) {
    console.error("Error in deserializeUser:", err);
    done(err, null);
  }
});