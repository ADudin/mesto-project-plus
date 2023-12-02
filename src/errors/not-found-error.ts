import STATUS_CODES from '../utils/status-codes';

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);

    this.statusCode = STATUS_CODES.NOT_FOUND;
  }
};

export default NotFoundError;