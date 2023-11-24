import express from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
import { upload } from '../../utils/multer.js';
import imageProcessing from '../../middlewares/imageProcessing.js';
import {
  getUserProfile,
  updateUserProfile,
  allUsers,
  deleteUserProfile
} from './user.controller.js';


//router object
const userRouter = express.Router();

// Routes for all users
userRouter.get('/', protect, allUsers);

// Routes for getting and updating user profile
userRouter
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload('profileImage'), imageProcessing, updateUserProfile);


// Routes for updating user status and deleting user profile
userRouter
  .route('/:id')
  .delete(protect, deleteUserProfile);

export default userRouter;
