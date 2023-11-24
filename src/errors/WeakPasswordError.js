import CustomError from "./CustomError.js";

export default class WeakPasswordError extends CustomError {
  constructor(message, statusCode = 400) {
    super(message, statusCode);
  }
}
