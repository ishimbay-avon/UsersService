import BaseError from './base-error';

class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, 404);
  }
}

export default NotFoundError;
