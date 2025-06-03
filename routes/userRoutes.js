import express from 'express';
import { registerUser } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.post('/signup', registerUser);

// Protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Access granted', userId: req.auth.userId });
});

export default router;

