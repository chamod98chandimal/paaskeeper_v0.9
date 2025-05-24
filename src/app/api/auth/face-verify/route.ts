import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FaceData from '@/models/FaceData';

const SIMILARITY_THRESHOLD = 0.6;

// Helper function to calculate Euclidean distance between face embeddings
function calculateSimilarity(embedding1: number[], embedding2: number[]): number {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same length');
  }

  const squaredDifferences = embedding1.map((val, i) => {
    const diff = val - embedding2[i];
    return diff * diff;
  });

  const sumSquaredDiff = squaredDifferences.reduce((sum, diff) => sum + diff, 0);
  const distance = Math.sqrt(sumSquaredDiff);
  
  // Convert distance to similarity score (0 to 1)
  // Using exponential decay: similarity = e^(-distance)
  return Math.exp(-distance);
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { walletAddress, faceEmbedding, livenessScore } = await request.json();

    if (!walletAddress || !faceEmbedding || !livenessScore) {
      return NextResponse.json(
        { error: 'Wallet address, face embedding, and liveness score are required' },
        { status: 400 }
      );
    }

    // Check liveness score
    if (livenessScore < 0.9) {
      return NextResponse.json(
        { error: 'Liveness check failed. Please ensure you are a real person.' },
        { status: 400 }
      );
    }

    // Find existing face data for the wallet address
    const existingFaceData = await FaceData.findOne({ walletAddress });

    if (!existingFaceData) {
      // First time verification - store the face embedding
      const newFaceData = new FaceData({
        walletAddress,
        faceEmbedding,
        verificationCount: 1,
        lastVerification: new Date()
      });
      await newFaceData.save();

      return NextResponse.json({
        success: true,
        message: 'Face data stored successfully',
        isFirstTime: true
      });
    }

    // Calculate similarity with stored embedding
    const similarity = calculateSimilarity(faceEmbedding, existingFaceData.faceEmbedding);

    if (similarity >= SIMILARITY_THRESHOLD) {
      // Update verification stats
      existingFaceData.verificationCount += 1;
      existingFaceData.lastVerification = new Date();
      await existingFaceData.save();

      return NextResponse.json({
        success: true,
        message: 'Face verification successful',
        similarity
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Face verification failed',
        similarity
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Error in face verification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 