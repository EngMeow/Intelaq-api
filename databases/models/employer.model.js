import mongoose, { Schema } from 'mongoose';


export const employerSchema = new Schema({
    profile: { type: Schema.Types.Mixed, ref: 'User'},
    createdJobs: [{ type: Schema.Types.Mixed, ref: 'Job' }],
    createdAt: { type: Date, default: Date.now },
});

export const EmployerModel = mongoose.model('Employer', employerSchema);
 
