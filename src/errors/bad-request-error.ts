import BaseError from './base-error';

class BadRequestError extends BaseError {
  constructor(message: string) {
    super(message, 400);
  }
}

export default BadRequestError;
