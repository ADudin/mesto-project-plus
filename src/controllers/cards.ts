import { NextFunction, Request, Response} from 'express';
import Card from '../models/card';
import STATUS_CODES from '../utils/status-codes';

export const getCards = (req: Request, res: Response, next: NextFunction) => {

  return Card.find({})
    .then(cards => res.status(STATUS_CODES.OK).send(cards))
    .catch(next);
};

export const createCard = (req: any, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  return Card.create({ name, link, owner: ownerId })
    .then(card => res.status(STATUS_CODES.CREATED).send(card))
    .catch(next);
};

export const deleteCard = (req: any, res: Response, next: NextFunction ) => {

  return Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {

      if (card.owner.toString() !== req.user._id) {
        return res.status(STATUS_CODES.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
      }

      return card.deleteOne();
    })
    .then(() => res.status(STATUS_CODES.OK).send({ message: 'Карточка удалена' }))
    .catch(next);
};

export const likeCard = (req: any, res: Response, next: NextFunction) => {
  const userId = req.user._id;

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
  .orFail()
  .then(card => res.status(STATUS_CODES.CREATED).send(card))
  .catch(next);
};

export const dislikeCard = ( req: any, res: Response, next: NextFunction) => {
  const userId = req.user._id;

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true }
  )
  .orFail()
  .then(card => res.status(STATUS_CODES.OK).send(card))
  .catch(next);
};