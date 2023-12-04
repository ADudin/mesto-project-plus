import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import STATUS_CODES from './utils/status-codes';
import ERROR_NAMES from './utils/error-names';
import router from './routes/index';

const { PORT = 3000, BASE_PATH = 'none' } = process.env;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestdb');

app.use((req: any, res, next) => {
  req.user = {
    _id: '6568d3a536fbf604553c811e'
  };

  next();
});

app.use('/', router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === ERROR_NAMES.CAST_ERROR || err.name === ERROR_NAMES.DOCUMENT_NOT_FOUND_ERROR) {
    res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Переданный _id не найден' });
  } else if (err.name === ERROR_NAMES.VALIDATION_ERROR) {
    res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
  } else {
    const { statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, message } = err;

    res
      .status(statusCode)
      .send({

        message: statusCode === STATUS_CODES.INTERNAL_SERVER_ERROR
          ? 'На сервере произошла ошибка'
          : message
      });
  }
});

app.use((req, res, next) => {
  res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Указанного пути не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(BASE_PATH);
});