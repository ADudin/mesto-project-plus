import { Router } from 'express';

import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
} from '../controllers/cards';

import {
  createCardValidation,
  getCardValidation
} from '../validation/card-validation'

const router = Router();

router.get('/cards', getCards);

router.post('/cards', createCardValidation, createCard);

router.delete('/cards/:cardId', getCardValidation, deleteCard);

router.put('/cards/:cardId/likes', getCardValidation, likeCard);

router.delete('/cards/:cardId/likes', getCardValidation, dislikeCard);

export default router;