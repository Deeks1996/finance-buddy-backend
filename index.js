import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import transactionRoutes from './routes/transactionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';
dotenv.config();

const app = express();
app.use(cors({
  origin: ['http://localhost:5173','https://finance-buddy-frontend.vercel.app'],
  credentials: true                
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

app.use(clerkMiddleware());
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Finance-Buddy is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
