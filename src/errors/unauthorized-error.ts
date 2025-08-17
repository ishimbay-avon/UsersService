import BaseError from './base-error';

class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super(message, 401);
  }
}

export default UnauthorizedError;
