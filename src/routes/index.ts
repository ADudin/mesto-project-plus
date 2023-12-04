import { Router } from "express";
import userRouter from './user';
import cardsRouter from './cards';

const router = Router();

router.use(userRouter);
router.use(cardsRouter);

export default router;