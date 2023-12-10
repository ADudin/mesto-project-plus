import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { errors } from 'celebrate';
import { rateLimit } from 'express-rate-limit';

import STATUS_CODES from './utils/status-codes';
import RequestError from './errors/request-error';
import router from './routes/index';
import errorHandler from './middlewares/errors';
import { requestLogger, errorLogger } from './middlewares/logger';

const { PORT = 3000, BASE_PATH = 'none' } = process.env;
const app = express();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestdb');

app.use(helmet());
app.use(limiter);

app.use(requestLogger);

app.use('/', router);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new RequestError(STATUS_CODES.NOT_FOUND, 'Указанного пути не существует'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(BASE_PATH);
});