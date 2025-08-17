import BaseError from './base-error';

class ForbiddenError extends BaseError {
  constructor(message: string) {
    super(message, 403);
  }
}

export default ForbiddenError;
