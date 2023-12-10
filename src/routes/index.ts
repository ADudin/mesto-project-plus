import { Router } from 'express';
import userRouter from './user';
import cardsRouter from './cards';
import auth from '../middlewares/auth';
import { loginUserValidation, createUserValidation } from '../middlewares/validation/user-validation';
import { login, createUser } from '../controllers/users';

const router = Router();

router.post('/signin', loginUserValidation, login);
router.post('/signup', createUserValidation, createUser);

router.use(auth);

router.use(userRouter);
router.use(cardsRouter);

export default router;
