import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import STATUS_CODES from '../utils/status-codes';
import ERROR_NAMES from '../utils/error-names';
import RequestError from '../errors/request-error';

const bcrypt = require('bcrypt');

const DB_CONFLICT_ERR_CODE = 11000;

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.status(STATUS_CODES.OK).send(users))
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new RequestError(STATUS_CODES.NOT_FOUND, 'Пользователь по указанному _id не найден');
      }

      res.status(STATUS_CODES.OK).send(user);
    })
    .catch((err) => {
      if (err.name === ERROR_NAMES.CAST_ERROR) {
        next(new RequestError(STATUS_CODES.BAD_REQUEST, 'Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const getUser = (req: any, res: Response, next: NextFunction) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new RequestError(STATUS_CODES.NOT_FOUND, 'Пользователь по указанному _id не найден');
      }

      res.status(STATUS_CODES.OK).send(user);
    })
    .catch((err) => {
      if (err.name === ERROR_NAMES.CAST_ERROR) {
        next(new RequestError(STATUS_CODES.BAD_REQUEST, 'Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash: string) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user: IUser) => {
          res.status(STATUS_CODES.CREATED).send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          });
        })
        .catch((err: any) => {
          if (err.name === ERROR_NAMES.VALIDATION_ERROR) {
            next(new RequestError(STATUS_CODES.BAD_REQUEST, 'Переданы некорректные данные'));
          } else if (err.code === DB_CONFLICT_ERR_CODE) {
            next(new RequestError(STATUS_CODES.CONFLICT, 'Пользователь с указанным адресом электронной почты уже существует'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

export const updateUser = (req: any, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new RequestError(STATUS_CODES.NOT_FOUND, 'Пользователь по указанному _id не найден');
      }

      res.status(STATUS_CODES.OK).send(user);
    })
    .catch((err) => {
      if (err.name === ERROR_NAMES.VALIDATION_ERROR) {
        next(new RequestError(STATUS_CODES.BAD_REQUEST, 'Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const updateAvatar = (req: any, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new RequestError(STATUS_CODES.NOT_FOUND, 'Пользователь по указанному _id не найден');
      }

      res.status(STATUS_CODES.OK).send(user);
    })
    .catch((err) => {
      if (err.name === ERROR_NAMES.VALIDATION_ERROR) {
        next(new RequestError(STATUS_CODES.BAD_REQUEST, 'Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};
