const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// Enhanced CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5000',
        'https://tasksphere-z2d1.onrender.com',
        'https://tasksphere1.onrender.com',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 200
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Enhanced Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Fixed Database connection with correct options
const connectWithRetry = async () => {
    console.log('🔄 Attempting to connect to MongoDB...');

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 45000, // 45 seconds
            maxPoolSize: 10,
            retryWrites: true,
            w: 'majority'
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        console.log('🔄 Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

// MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ Mongoose disconnected from MongoDB');
});

// Initialize connection
connectWithRetry();

// Enhanced Health check route with DB status
app.get('/api/health', async (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const dbHealthy = dbStatus === 1; // 1 = connected

    res.status(dbHealthy ? 200 : 503).json({
        success: dbHealthy,
        message: dbHealthy ? 'Backend is running' : 'Backend is having database issues',
        database: dbHealthy ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Simple test route
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
});

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const passwordRoutes = require('./routes/password');

// Apply routes with connection check middleware
const checkDBConnection = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: 'Database connection unavailable. Please try again later.',
            error: 'DATABASE_CONNECTION_ERROR'
        });
    }
    next();
};

// Apply database connection check to all API routes
app.use('/api/auth', checkDBConnection, authRoutes);
app.use('/api/users', checkDBConnection, userRoutes);
app.use('/api/tasks', checkDBConnection, taskRoutes);
app.use('/api/password', checkDBConnection, passwordRoutes);

// Enhanced Error handling middleware
app.use((err, req, res, next) => {
    console.error('💥 Server Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method
    });

    // Mongoose timeout error
    if (err.name === 'MongooseError' && err.message.includes('buffering timed out')) {
        return res.status(503).json({
            success: false,
            message: 'Database operation timed out. Please try again.',
            error: 'DATABASE_TIMEOUT'
        });
    }

    // MongoDB connection error
    if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
        return res.status(503).json({
            success: false,
            message: 'Database connection issue. Please try again later.',
            error: 'DATABASE_CONNECTION_LOST'
        });
    }

    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

const PORT = process.env.PORT || 5000;

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Received SIGINT. Closing server gracefully...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('🛑 Received SIGTERM. Closing server gracefully...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});