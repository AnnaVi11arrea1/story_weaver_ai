import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './utils/db.js';
import authRoutes from './routes/auth.js';
import storyRoutes from './routes/stories.js';
import userRoutes from './routes/users.js';
import groupRoutes from './routes/groups.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file explicitly
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug environment variables
console.log('Environment check:');
console.log('MONGODB_URL:', process.env.MONGODB_URL);
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();

// MIDDLEWARE
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://humble-goldfish-v66w9jpq7p9gfpx97-5173.app.github.dev',
        process.env.FRONTEND_URL
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);

// TEST ROUTE
app.get('/api/health', (req, res) => {
    res.json({ 
        message: 'Server is running!', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV 
    });
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ 
        message: 'Something went wrong!', 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
    });
});

// START SERVER
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
