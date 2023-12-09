import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import STATUS_CODES from '../utils/status-codes';

const bcrypt = require('bcrypt');

export const getUsers = (req: Request, res: Response, next: NextFunction) => {

  return User.find({})
    .then(users => res.status(STATUS_CODES.OK).send(users))
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {

  return User.findById(req.params.userId)
    .orFail()
    .then(user => res.status(STATUS_CODES.OK).send(user))
    .catch(next);
};

export const getUser = (req: any, res: Response, next: NextFunction) => {

  return User.findById(req.user._id)
    .orFail()
    .then(user => res.status(STATUS_CODES.OK).send(user))
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash: string) => User.create({ name, about, avatar, email, password: hash }))
    .then((user: IUser) => res.status(STATUS_CODES.CREATED).send({ name: user.name, about: user.about, avatar: user.avatar }))
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

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {

      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' }
      );

      res.send({ token });
    })
    .catch((err) => {
      res.status(STATUS_CODES.UNAUTHORIZED).send({ message: err.message });
    });
};