import { Router } from 'express';

import {
  getUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar
} from '../controllers/users';

import {
  getUserByIdValidation,
  updateUserValidation,
  updateAvatarValidation
} from '../validation/user-validation'

const router = Router();

router.get('/users', getUsers);

router.get('/users/me', getUser);

router.get('/users/:userId', getUserByIdValidation, getUserById);

router.patch('/users/me', updateUserValidation, updateUser);

router.patch('/users/me/avatar', updateAvatarValidation, updateAvatar);

export default router;