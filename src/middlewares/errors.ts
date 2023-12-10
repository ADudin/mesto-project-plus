import { ErrorRequestHandler } from 'express';
import STATUS_CODES from '../utils/status-codes';

// eslint-disable-next-line no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const { statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === STATUS_CODES.INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошабка'
        : message,
    });
};

export default errorHandler;
