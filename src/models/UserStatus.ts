import mongoose from 'mongoose';

const userStatusSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  hasPassword: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isReVerified: {
    type: Boolean,
    default: false,
  },
  verificationTimestamp: {
    type: Date,
    default: null,
  },
  reVerificationTimestamp: {
    type: Date,
    default: null,
  },
});

export default mongoose.models.UserStatus || mongoose.model('UserStatus', userStatusSchema); 