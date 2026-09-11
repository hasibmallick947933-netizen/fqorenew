const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const progressRoutes = require('./routes/progressRoutes');
const statsRoutes = require('./routes/statsRoutes');
const userRoutes = require('./routes/userRoutes');
const publicRoutes = require('./routes/publicRoutes');
const planRoutes = require('./routes/planRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl) or matching clientUrl/localhost
      if (!origin || origin.includes('localhost') || origin === clientUrl) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for production deployment flexibility
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request Logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api', limiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'EduX Intelligence Platform API',
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes (mounted on both /api/* and root /* for seamless URL resolution)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/content', contentRoutes);
app.use('/content', contentRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/categories', categoryRoutes);

app.use('/api/media', mediaRoutes);
app.use('/media', mediaRoutes);

app.use('/api/bookmarks', bookmarkRoutes);
app.use('/bookmarks', bookmarkRoutes);

app.use('/api/progress', progressRoutes);
app.use('/progress', progressRoutes);

app.use('/api/stats', statsRoutes);
app.use('/stats', statsRoutes);

app.use('/api/users', userRoutes);
app.use('/users', userRoutes);

app.use('/api/public', publicRoutes);
app.use('/public', publicRoutes);

app.use('/api/plans', planRoutes);
app.use('/plans', planRoutes);

app.use('/api/payments', paymentRoutes);
app.use('/payments', paymentRoutes);

app.use('/api/courses', courseRoutes);
app.use('/courses', courseRoutes);

// 404 Catch-all
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const { seedDatabase } = require('./utils/seedData');

const startServer = async () => {
  await connectDB();
  await seedDatabase();
  const server = app.listen(PORT, () => {
    console.log(`EduX API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;
