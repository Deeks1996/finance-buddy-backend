import { requireAuth } from '@clerk/express';

export const authMiddleware = (req, res, next) => {
  try {
    requireAuth()(req, res, () => {
      console.log('req.auth (function):', req.auth);
      const authData = req.auth();
      console.log('Auth data:', authData);
      next();
    });
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};


