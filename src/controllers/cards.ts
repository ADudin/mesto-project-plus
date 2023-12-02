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
    .catch((err) => res.status(500).send({ message: err }));
};

export const deleteCard = (req: Request, res: Response) => {

  return Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.status(200).send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Поизошла ошибка' }));
};