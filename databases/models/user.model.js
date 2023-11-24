import mongoose, { Schema } from 'mongoose';

const GenderEnum = ['MALE', 'FEMALE'];
const RoleEnum = ['employer', 'employee'];
const ExperienceLevelEnum = ['junior', 'midLevel', 'senior'];

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'user name is required'],
        minLength: [3, 'user name is too short']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'user email is required'],
        minLength: [3, 'user name is too short'],
        unique: [true, 'user email must be unique']
    },
    nationalID: {
        type: String,
        required: [true, 'user national ID is required'],
        length: [14, 'user national Id is 14 number']
    },
    password: {
        type: String,
        required: true,
        minLength: [6, 'minLength 6 Chars']
    },
    phone: {
        type: String,
        required: [true, 'user phone is required'],
        unique: [true, 'user phone must be unique']
    },
    profileImage: String,
    city: String,
    bio: String,
    gender: {
        type: String,
        enum: GenderEnum
    },
    role: {
        type: String,
        enum: RoleEnum
    },
    isActive: {
        type: Boolean,
        default: true
    },
    experienceLevel: {
        type: String,
        enum: ExperienceLevelEnum
    },
    progLanguage: [String],
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);

