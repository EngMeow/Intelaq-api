import mongoose, { Schema } from 'mongoose';
const StatusEnum = ['pending', 'accepted', 'rejected'];

const applicationSchema = new Schema({
  status: {
    type: String,
    enum: StatusEnum,
    default: 'pending',
  },
  job: { type: Schema.Types.ObjectId, ref: 'Job' },
  employee: { type: Schema.Types.Mixed, ref: 'Employee' },
});

export const ApplicationModel = mongoose.model('Application', applicationSchema);
