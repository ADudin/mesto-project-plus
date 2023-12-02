import STATUS_CODES from '../utils/status-codes';

class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);

    this.statusCode = STATUS_CODES.BAD_REQUEST;
  }
};

export default BadRequestError;