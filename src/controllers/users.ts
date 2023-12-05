import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import STATUS_CODES from '../utils/status-codes';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {

  return User.find({})
    .then(users => res.status(STATUS_CODES.OK).send(users))
    .catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {

  return User.findById(req.params.userId)
    .orFail()
    .then(user => res.status(STATUS_CODES.OK).send(user))
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then(user => res.status(STATUS_CODES.CREATED).send(user))
    .catch(next);
};

export const updateUser = (req: any, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { $set: { name: name, about: about } },
    {
      new: true,
      runValidators: true
    })
    .orFail()
    .then(user => res.status(STATUS_CODES.OK).send(user))
    .catch(next);
};

export const updateAvatar = (req: any, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar } },
    {
      new: true,
      runValidators: true
    })
    .orFail()
    .then(user => res.status(STATUS_CODES.OK).send(user))
    .catch(next);
};