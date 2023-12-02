import { Router } from 'express';

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar
} from '../controllers/users';

const router = Router();

router.get('/users', getUsers);

router.get('/users/:userId', getUser);

router.post('/users', createUser);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateAvatar);

export default router;