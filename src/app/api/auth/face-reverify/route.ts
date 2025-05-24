import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FaceData from '@/models/FaceData';

const SIMILARITY_THRESHOLD = 0.6;

// Helper function to calculate similarity (same as in face-verify)
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
  
  return Math.exp(-distance);
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { walletAddress, currentFaceEmbedding, newFaceEmbedding, livenessScore } = await request.json();

    if (!walletAddress || !currentFaceEmbedding || !newFaceEmbedding || !livenessScore) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Find existing face data
    const existingFaceData = await FaceData.findOne({ walletAddress });

    if (!existingFaceData) {
      return NextResponse.json(
        { error: 'No existing face data found. Please complete initial verification first.' },
        { status: 404 }
      );
    }

    // Verify current face matches stored data
    const similarity = calculateSimilarity(currentFaceEmbedding, existingFaceData.faceEmbedding);

    if (similarity >= SIMILARITY_THRESHOLD) {
      // Update with new face embedding
      existingFaceData.faceEmbedding = newFaceEmbedding;
      existingFaceData.verificationCount += 1;
      existingFaceData.lastVerification = new Date();
      await existingFaceData.save();

      return NextResponse.json({
        success: true,
        message: 'Face data updated successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Current face verification failed. Cannot update face data.',
        similarity
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Error in face re-verification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 