import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = (req: Request, res: Response) => {

  return User.find({})
    .then(users => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const getUser = (req: Request, res: Response) => {

  return User.findById(req.params.userId)
    .then(user => res.status(200).send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then(user => res.status(200).send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const updateUser = (req: any, res: Response) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { $set: { name: name, about: about } },
    {
      new: true,
      runValidators: true
    })
    .then(card => res.status(200).send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const updateAvatar = (req: any, res: Response) => {

  return User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: req.body.avatar } },
    {
      new: true,
      runValidators: true
    })
    .then(card => res.status(200).send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};