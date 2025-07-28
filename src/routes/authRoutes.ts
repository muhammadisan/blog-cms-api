`src/routes/authRoutes.ts`

import { Router } from 'express';
import { login, logout } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = Router();

// Login user
router.post('/login', login);
// Logout user (invalidate token on client)
router.post('/logout', protect, logout);

export default router;