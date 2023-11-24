import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from './auth.Controller.js';

//router object
const authRouter = express.Router();

authRouter.post('/signup', registerUser );
authRouter.post('/login', authUser);
authRouter.post('/logout', logoutUser);
authRouter.post('/forgotPassword', forgotPassword);
authRouter.put('/resetPassword/:token', resetPassword);

export default authRouter;
