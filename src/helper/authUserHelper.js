import generateToken from '../utils/generateToken.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { CustomError, InvalidEmailError } from '../errors/index.js';
import { UserModel } from '../../databases/models/user.model.js';

const validateAuthInputs = (email, password) => {
  if (!email || !password) {
    throw new CustomError(
      'Please provide both email and password',
      400,
      'Please provide both email and password for authentication'
    );
  }

  if (!validator.isEmail(email)) {
    throw new InvalidEmailError('Invalid email', 400);
  }
};

const findUserByEmail = async (email) => {
  return await UserModel.findOne({ email });
};

const isPasswordValid = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const formatUserResponse = (user) => {
  return {
    id: user.id,
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
};

const generateTokenAndSendCookie = (res, userId) => {
  generateToken(res, userId);
};

export {
  validateAuthInputs,
  findUserByEmail,
  isPasswordValid,
  formatUserResponse,
  generateTokenAndSendCookie,
};
