`src/routes/userRoutes.ts`

import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = Router();

// Public reads
router.get('/', getUsers);
router.get('/:id', getUserById);

// Protected writes
router.post('/', protect, createUser);
router.patch('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

export default router;