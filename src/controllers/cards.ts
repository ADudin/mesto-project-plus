import { NextFunction, Request, Response} from 'express';
import Card from '../models/card';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import STATUS_CODES from '../utils/status-codes';

export const getCards = (req: Request, res: Response, next: NextFunction) => {

  return Card.find({})
    .then(cards => res.status(STATUS_CODES.OK).send(cards))
    .catch(next);
};

export const createCard = (req: any, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  if (!name || !link) {
    throw new BadRequestError('Переданы некорректные данные при создании карточки');
  }

  return Card.create({ name, link, owner: ownerId })
    .then(card => res.status(STATUS_CODES.CREATED).send(card))
    .catch(next);
};

export const deleteCard = (req: Request, res: Response, next: NextFunction ) => {

  return Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }

      res.status(STATUS_CODES.OK).send(card)
    })
    .catch(next);
};

export const likeCard = (req: any, res: Response, next: NextFunction) => {
  const userId = req.user._id;

  if(!userId) {
    throw new BadRequestError('Переданы некорректные данные для постановки лайка');
  }

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }

    res.status(STATUS_CODES.CREATED).send(card)
  })
  .catch(next);
};

export const dislikeCard = ( req: any, res: Response, next: NextFunction) => {
  const userId = req.user._id;

  if(!userId) {
    throw new BadRequestError('Переданы некорректные данные для снятия лайка');
  }

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true }
  )
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }

    res.status(STATUS_CODES.OK).send(card)
  })
  .catch(next);
};