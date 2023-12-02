import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import STATUS_CODES from '../utils/status-codes';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {

  return User.find({})
    .then(users => res.status(STATUS_CODES.OK).send(users))
    .catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {

  return User.findById(req.params.userId)
    .then((user) => {
      if(!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }

      res.status(STATUS_CODES.OK).send(user)
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    throw new BadRequestError('Переданы некорректные данные для создания пользователя');
  }

  return User.create({ name, about, avatar })
    .then(user => res.status(STATUS_CODES.CREATED).send(user))
    .catch(next);
};

export const updateUser = (req: any, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  if (!name || !about) {
    throw new BadRequestError('Переданы некорректные данные при обновлении профиля');
  }

  return User.findByIdAndUpdate(
    req.user._id,
    { $set: { name: name, about: about } },
    {
      new: true,
      runValidators: true
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }

      res.status(STATUS_CODES.OK).send(user)
    })
    .catch(next);
};

export const updateAvatar = (req: any, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  if (!avatar) {
    throw new BadRequestError('Переданы некорректные данные при обновлении аватара');
  }

  return User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar } },
    {
      new: true,
      runValidators: true
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }

      res.status(STATUS_CODES.OK).send(user)
    })
    .catch(next);
};