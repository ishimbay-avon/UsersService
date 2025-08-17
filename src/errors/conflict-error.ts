import BaseError from './base-error';

class ConflictError extends BaseError {
  constructor(message: string) {
    super(message, 409);
  }
}

export default ConflictError;
