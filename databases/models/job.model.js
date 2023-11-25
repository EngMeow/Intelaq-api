import mongoose, { Schema } from 'mongoose';

const ExperienceLevelEnum = ['junior', 'midLevel', 'senior'];

const jobSchema = new Schema({
    title: String,
    jobDescription: String,
    location: String,
    programmingLanguages: [String],
    experienceLevel: { type: String, enum: ExperienceLevelEnum },
    status: String,
    employer: { type: Schema.Types.Mixed, ref: 'Employer', required: true },
    jobApplication: [{ type: Schema.Types.Mixed, ref: 'Application' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const JobModel = mongoose.model('Job', jobSchema);

