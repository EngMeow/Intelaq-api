import CustomError from './CustomError.js';

export default class InvalidRoleError extends CustomError {
  constructor(message, statusCode = 400) {
    super(message, statusCode);
  }
}
