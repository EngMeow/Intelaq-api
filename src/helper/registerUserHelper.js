import generateToken from '../utils/generateToken.js';
import validateRegisterInputs from '../utils/validateRegisterInputs.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { UserModel } from '../../databases/models/user.model.js';
import {
  CustomError,
  InvalidEmailError,
  WeakPasswordError,
  InvalidRoleError,
} from '../errors/index.js';

const validateUserInput = (userData) => {
  validateRegisterInputs(userData);

  if (!validator.isEmail(userData.email)) {
    throw new InvalidEmailError();
  }

  if (!validator.isMobilePhone(userData.phone, 'ar-EG')) {
    throw new CustomError(
      'Invalid phone number.',
      400,
      'Please provide a valid mobile phone number for Egypt.'
    );
  }

  const isStrongPassword = validator.isStrongPassword(userData.password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

  if (!isStrongPassword) {
    throw new WeakPasswordError(
      'Password is too weak. It should include at least 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol.',
      400
    );
  }

  if (userData.role !== 'employee' && userData.role !== 'employer') {
    throw new InvalidRoleError(
      "Role is invalid. It should be either 'employee' or 'employer'",
      400
    );
  }
};

const checkExistingUser = async (userData) => {
  return await UserModel.findOne({
    $or: [
      {
        email: userData.email,
      },
      {
        nationalID: userData.nationalID,
      },
      {
        phone: userData.phone,
      },
    ],
  });
};

const hashUserPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const createUserRecord = async (userData, hashedPassword) => {
  return await UserModel.create({
    ...userData,
    password: hashedPassword,
  });
};

const formatUserResponse = (user) => {
  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    nationalID: user.nationalID,
    phone: user.phone,
    lastName: user.lastName,
    gender: user.gender,
    city: user.city,
    birthdate: user.birthdate,
    role: user.role,
    status: user.status,
    bio: user.bio,
    isActive: user.isActive,
    experienceLevel: user.experienceLevel,
    profileImage: user.profileImage,
    progLanguage: user.progLanguage,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  return userResponse;
};

const generateTokenAndSendCookie = (res, userId) => {
  generateToken(res, userId);
};

export {
  generateTokenAndSendCookie,
  formatUserResponse,
  createUserRecord,
  hashUserPassword,
  checkExistingUser,
  validateUserInput,
};
