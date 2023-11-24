import CustomError from './CustomError.js';

export default class ExistingUserError extends CustomError {
  constructor(message, statusCode = 409) {
    super(message, statusCode);
  }
}
