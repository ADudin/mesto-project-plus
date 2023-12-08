import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import STATUS_CODES from './utils/status-codes';
import ERROR_NAMES from './utils/error-names';
import router from './routes/index';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';

const { PORT = 3000, BASE_PATH = 'none' } = process.env;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestdb');

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  switch (err.name) {
    case ERROR_NAMES.CAST_ERROR:
      res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Переданный _id не найден' });
      break;
    case ERROR_NAMES.DOCUMENT_NOT_FOUND_ERROR:
      res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Указанный объект не найден' });
      break;
    case ERROR_NAMES.VALIDATION_ERROR:
      res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      break;
    default:
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
});

app.use((req, res, next) => {
  res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Указанного пути не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(BASE_PATH);
});