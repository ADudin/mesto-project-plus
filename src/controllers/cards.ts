import { Request, Response} from 'express';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => {

  return Card.find({})
    .then(cards => res.status(200).send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Поизошла ошибка' }));
};

export const createCard = (req: any, res: Response) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  return Card.create({ name, link, owner: ownerId })
    .then(card => res.status(200).send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Поизошла ошибка' }));
};

export const deleteCard = (req: Request, res: Response) => {

  return Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.status(200).send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Поизошла ошибка' }));
};

export const likeCard = (req: any, res: Response) => {

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
  .then(card => res.status(200).send({ data: card }))
  .catch(() => res.status(500).send({ message: 'Поизошла ошибка' }));
};

export const dislikeCard = ( req: any, res: Response) => {

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
  .then(card => res.status(200).send({ data: card }))
  .catch(() => res.status(500).send({ message: 'Поизошла ошибка' }));
};