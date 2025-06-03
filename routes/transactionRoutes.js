import express from 'express';
// Import authentication middleware to protect routes
import { authMiddleware } from '../middleware/authMiddleware.js';

// Import transaction controller functions for handling requests
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
} from '../controllers/transactionController.js';

// Create an Express router instance to define route handlers
const router = express.Router();

// POST /transactions - Add a new transaction
router.post('/', authMiddleware, addTransaction);

// GET /transactions - Get all transactions for the authenticated user
router.get('/', authMiddleware, getTransactions);

// DELETE /transactions/:id - Delete a specific transaction by ID for the authenticated user
router.delete('/:id', authMiddleware, deleteTransaction);

// Export the router to be used in the main app
export default router;
