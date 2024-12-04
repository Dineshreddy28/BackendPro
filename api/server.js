const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware for CORS
const allowedOrigins = ['https://e-recruiter.netlify.app']; // Add your Netlify app's URL here
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse incoming JSON requests
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/resume', express.static(path.join(__dirname, 'uploads/resume')));

// Routes
app.use('/user', userRoutes);
app.use('/jobs', jobRoutes);
app.use('/candidates', candidateRoutes);

// Handle Errors
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).send({ message: err.message });
  } else {
    next(err);
  }
});

// Start Server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
