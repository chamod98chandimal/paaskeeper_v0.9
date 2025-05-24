import mongoose from 'mongoose';

const FaceDataSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  faceEmbedding: {
    type: [Number], // Store face embedding as array of numbers
    required: true,
  },
  verifiedAt: {
    type: Date,
    default: Date.now,
  },
  lastVerification: {
    type: Date,
    default: null,
  },
  verificationCount: {
    type: Number,
    default: 0,
  }
});

export default mongoose.models.FaceData || mongoose.model('FaceData', FaceDataSchema); 