const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

// Load environment configuration
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const broadcastRoutes = require('./routes/broadcastRoutes');
const dealRoutes = require('./routes/dealRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cross-Origin Resource Sharing
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS origin blocked.'));
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'DormDeal - Campus Peer-to-Peer Marketplace & Rental Hub',
    timestamp: new Date().toISOString(),
  });
});

// Mount application API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/products', itemRoutes); // Alias for frontend compatibility
app.use('/api/broadcasts', broadcastRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Connect to database and start server
let server;
connectDB()
  .then(async () => {
    // Auto-seed initial data if database is empty for seamless testing
    try {
      const Item = require('./models/Item');
      const count = await Item.countDocuments();
      if (count === 0) {
        console.log('[DormDeal Server] Database is empty. Auto-seeding initial student data...');
        const seedDatabase = require('./utils/seeder');
        await seedDatabase(false);
      }
    } catch (seedErr) {
      console.warn('[DormDeal Server] Auto-seed notice:', seedErr.message);
    }

    server = app.listen(PORT, () => {
      console.log('====================================================');
      console.log(` DormDeal API Server running on port ${PORT}`);
      console.log(` Environment : ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health Check: http://localhost:${PORT}/api/health`);
      console.log('====================================================');
    });
  })
  .catch((err) => {
    console.error(`Database connection failed: ${err.message}`);
    process.exit(1);
  });

module.exports = app;
