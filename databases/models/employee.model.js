import mongoose, { Schema } from 'mongoose';

const employeeSchema = new Schema({
    profile: { type: Schema.Types.Mixed, ref: 'User'},
    assignedApplications: [{ type: Schema.Types.Mixed, ref: 'Application' }],
    createdAt: { type: Date, default: Date.now },
});

export const EmployeeModel = mongoose.model('Employee', employeeSchema);

