import { Router } from 'express';

import {
  getUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar
} from '../controllers/users';

const router = Router();

router.get('/users', getUsers);

router.get('/users/me', getUser);

router.get('/users/:userId', getUserById);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateAvatar);

export default router;