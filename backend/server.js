import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';

import authRoutes from './routes/auth.js';
import storyRoutes from './routes/stories.js';
import userRoutes from './routes/users.js';
import groupRoutes from './routes/groups.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// --- Connect to Database ---
connectDB();

// --- MIDDLEWARE ---
// FIX: Implement specific CORS options to allow requests from the frontend
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite's default port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Allow larger payloads for images/stories

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);


// --- TEST ROUTE ---
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!', error: err.message });
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});