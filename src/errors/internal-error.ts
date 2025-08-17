import BaseError from './base-error';

class InternalError extends BaseError {
  constructor(message: string) {
    super(message, 500);
  }
}

export default InternalError;
