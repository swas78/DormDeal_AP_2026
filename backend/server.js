const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Initialize express app
const app = express();

// Security headers with Helmet
// Allow cross-origin images for uploaded files served statically
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy does not allow access from this origin.'));
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded media files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'CampusKart - University Student Marketplace',
    tagline: 'Your Campus. Your Marketplace.',
    timestamp: new Date().toISOString(),
  });
});

// Mount application API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Connect to database and start server
let server;
connectDB()
  .then(async () => {
    // Auto-seed initial sample data if database is empty for seamless testing
    try {
      const Product = require('./models/Product');
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log('[CampusKart Server] Database has no products. Seeding initial student marketplace data...');
        const seedDatabase = require('./utils/seeder');
        await seedDatabase(false);
      }
    } catch (seedErr) {
      console.warn('[CampusKart Server] Auto-seed notice:', seedErr.message);
    }

    server = app.listen(PORT, () => {
      console.log('====================================================');
      console.log(` CampusKart API Server Running on Port ${PORT}`);
      console.log(` Environment : ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health Check: http://localhost:${PORT}/api/health`);
      console.log('====================================================');
    });
  })
  .catch((err) => {
    console.error(`Failed to initialize database: ${err.message}`);
    process.exit(1);
  });

module.exports = app;
