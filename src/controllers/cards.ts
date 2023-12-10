import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import STATUS_CODES from '../utils/status-codes';
import ERROR_NAMES from '../utils/error-names';
import RequestError from '../errors/request-error';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.status(STATUS_CODES.OK).send(cards))
    .catch(next);
};

export const createCard = (req: any, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(STATUS_CODES.CREATED).send(card))
    .catch((err) => {
      if (err.name === ERROR_NAMES.VALIDATION_ERROR) {
        next(new RequestError(STATUS_CODES.BAD_REQUEST, 'Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: any, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new RequestError(STATUS_CODES.NOT_FOUND, 'Карточка с указанным _id не найдена');
      }

      if (card.owner.toString() !== req.user._id) {
        throw new RequestError(STATUS_CODES.FORBIDDEN, 'Недастаточно прав');
      }

      return card.deleteOne();
    })
    .then(() => res.status(STATUS_CODES.OK).send({ message: 'Карточка удалена' }))
    .catch(next);
};

export const likeCard = (req: any, res: Response, next: NextFunction) => {
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new RequestError(STATUS_CODES.NOT_FOUND, 'Карточка с указанным _id не найдена');
      }

      res.status(STATUS_CODES.CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === ERROR_NAMES.CAST_ERROR) {
        next(new RequestError(STATUS_CODES.BAD_REQUEST, 'Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (req: any, res: Response, next: NextFunction) => {
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new RequestError(STATUS_CODES.NOT_FOUND, 'Карточка с указанным _id не найдена');
      }

      res.status(STATUS_CODES.OK).send(card);
    })
    .catch((err) => {
      if (err.name === ERROR_NAMES.CAST_ERROR) {
        next(new RequestError(STATUS_CODES.BAD_REQUEST, 'Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
