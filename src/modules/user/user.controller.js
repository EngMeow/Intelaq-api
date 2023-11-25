import tryCatch from '../../utils/tryCatch.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { UserModel } from '../../../databases/models/user.model.js';
import {
  CustomError,
  InvalidEmailError,
  NotFoundError,
  WeakPasswordError,
} from '../../errors/index.js';


// create User Profile 
  
async function createUserProfile(user_id, model,userRole) {
  const UserObj = await UserModel.findById(user_id);
  const profile = new model({
      profile: UserObj,
  });
  
   await profile.save();
   const updateObject = {};
  updateObject[userRole] = profile._id;

  const updatedProfile = await UserModel.findOneAndUpdate(
    { _id: user_id },
    { $set: updateObject },
    { new: true }
  );

  if (!profile) {
    throw new CustomError(`${model} not created`, 400);
  }
}

// get all User Profile

const allUsers = tryCatch(async (req, res) => {

  const users = await UserModel.find({},{ id:true ,name: true, email: true, nationalID: true, phone: true, role: true })

  if (!users) throw new NotFoundError('Users not found', 404);
  res.status(200).json(users);
});

// get User Profile
const getUserProfile = tryCatch(async (req, res) => {
  const userId = req.user.id;

  const user = await UserModel.findById(userId)
    .select('-password')
    .populate({
      path: 'employee',
      select: 'assignedApplications ',
    })
    .populate({
      path: 'employer',
      select: 'createdJobs',
    })

  if (!user) {
    throw new NotFoundError('User not found', 404);
  }

  res.status(200).json({
    message: 'Detailed user profile retrieved successfully',
    user,
  });
});

// update User Profile

const updateUserProfile = tryCatch(async (req, res) => {
  const {
    name,
    email,
    nationalID,
    password,
    phone,
    profileImage,
    city,
    bio,
    experienceLevel,
    progLanguage,
  } = req.body;

  const userId = req.user.id;
  const userRole = req.user.role;

  const updatedData = {
    name,
    email,
    nationalID,
    password,
    phone,
    experienceLevel,
    progLanguage,
    bio,
    city,
    profileImage,
  };

  // validation on E-mail & phone number & password

  const handleEmail = async (email) => {
    if (!validator.isEmail(email)) {
      throw new InvalidEmailError('Invalid email address.', 400);
    }
    const existingUserWithEmail = await UserModel.findOne({
      email,
      _id: { $ne: userId },
    });
    if (existingUserWithEmail) {
      throw new CustomError('Email is already in use', 400);
    }
    updatedData.email = email;
  };

  const handlePhoneNumber = async (phone) => {
    if (!validator.isMobilePhone(phone, 'ar-EG')) {
      throw new CustomError('Invalid phone number', 400);
    }
    const existingUserWithPhoneNumber = await UserModel.findOne({
      phone,
      _id: { $ne: userId },
    });
    if (existingUserWithPhoneNumber) {
      throw new CustomError('Phone number is already in use', 400);
    }
    updatedData.phone = phone;
  };

  if (email) {
    await handleEmail(req.user.email);
  }
  if (phone) {
    await handlePhoneNumber(req.user.phone);
  }

  if (password) {
    const isStrongPassword = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });

    if (isStrongPassword) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    } else {
      throw new WeakPasswordError('Password is too weak', 400);
    }
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    updatedData,
    { new: true, select: '-password' }
  );

  res.status(200).json({
    message: 'Profile updated successfully',
    user: updatedUser,
  });
});

// delete user profile 

const deleteUserProfile = tryCatch(async (req, res) => {
  const { id } = req.params;

  const deletedUser = await UserModel.findByIdAndDelete(id).exec();

  if (!deletedUser) {
    throw new NotFoundError('User not found', 404);
  }

  res.status(200).json({
    message: 'User deleted successfully',
  });
});


export {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  allUsers,
  deleteUserProfile,
};
