import { CustomError } from "../errors/index.js";

const validateRegisterInputs = (data) => {
  const {
    name,
    email,
    nationalID,
    phone,
    profileImage,
    city,
    bio,
    gender,
    role,
    isActive,
    experienceLevel,
    progLanguage,
    password,
  } = data;

  if (!email || !password || !name || !nationalID || !gender || !experienceLevel) {
    throw new CustomError("Please provide a valid required fields", 400);
  }

};

export default validateRegisterInputs;
