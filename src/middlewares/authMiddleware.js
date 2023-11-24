import jwt from 'jsonwebtoken';
import tryCatch from '../utils/tryCatch.js';
import CustomError from '../errors/CustomError.js';
import { UserModel } from '../../databases/models/user.model.js';

const protect = tryCatch(async (req, res, next) => {
  let token;

  // Check if the token exists in the cookies
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      // Verify the token using the JWT secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Retrieve the user from the database using the decoded user ID
      const user = await UserModel.findById(decoded.userId);

      if (!user) {
        throw new CustomError('No user found', 404);
      }

      // Attach the user to the request object
      req.user = user;
      // Proceed to the next middleware or controller
      next();
    } catch (error) {
      // Handle any errors during token verification or user retrieval
      console.error(error);
      res.status(401).json({ message: 'Invalid token or unauthorized access' });
    }
  } else {
    // If no token is found, throw an error
    throw new CustomError('Not authorized, no token', 401);
  }
});

const checkEmployer = tryCatch(async (req, res, next) => {
  if (req.user.role === 'employer') {
    next();
  } else {
    throw new CustomError('Not authorized, you are not an Employer', 401);
  }
});

const checkEmployee = tryCatch(async (req, res, next) => {
  if (req.user.role === 'employee') {
    next();
  } else {
    throw new CustomError('Not authorized, you are not an Employee', 401);
  }
});

export { protect , checkEmployer, checkEmployee };
