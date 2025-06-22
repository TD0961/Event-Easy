require('dotenv').config(envPath = "../.env");
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const router = require('./routes/routes');
const userRouter = require('./routes/userRoutes');
const eventRouter = require('./routes/eventRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const reportRouter = require('./routes/reportRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const session = require('express-session');
const passport = require('passport');
require('./config/passport'); 
const authRoutes = require('./routes/authRoutes');
// const userRouter = require('./routes/userRoutes');
// const eventRouter = require('./routes/eventRoutes');


// Route imports


const app = express();

// Middlewares
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
})); 
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ],
  credentials: true
}));

app.use(express.json());  
app.use(cookieParser());
 
// Default callback route
app.get('/', (req, res) => {
  res.send('🚀 Event-Easy backend is running');
});

app.use("/Event-Easy/users", router);
app.use("/Event-Easy/user", userRouter);
app.use("/Event-Easy/Event", eventRouter);
app.use('/Event-Easy/review', reviewRouter);
app.use('/Event-Easy/report', reportRouter);
app.use('/api', paymentRoutes);
app.use('/auth', authRoutes);




// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);

    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
