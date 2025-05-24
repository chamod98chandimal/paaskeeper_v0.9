import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UserStatus from '@/models/UserStatus';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    await connectDB();

    let userStatus = await UserStatus.findOne({ walletAddress });
    
    if (!userStatus) {
      userStatus = await UserStatus.create({ walletAddress });
    }

    // Check if verification/re-verification has expired (1 minute)
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);

    if (userStatus.verificationTimestamp && userStatus.verificationTimestamp < oneMinuteAgo) {
      userStatus.isVerified = false;
      userStatus.verificationTimestamp = null;
      await userStatus.save();
    }

    if (userStatus.reVerificationTimestamp && userStatus.reVerificationTimestamp < oneMinuteAgo) {
      userStatus.isReVerified = false;
      userStatus.reVerificationTimestamp = null;
      await userStatus.save();
    }

    return NextResponse.json(userStatus);
  } catch (error) {
    console.error('Error in GET /api/auth/status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress, hasPassword, isVerified, isReVerified } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    await connectDB();

    const now = new Date();
    const update: any = {};

    if (typeof hasPassword !== 'undefined') {
      update.hasPassword = hasPassword;
    }
    if (typeof isVerified !== 'undefined') {
      update.isVerified = isVerified;
      update.verificationTimestamp = isVerified ? now : null;
    }
    if (typeof isReVerified !== 'undefined') {
      update.isReVerified = isReVerified;
      update.reVerificationTimestamp = isReVerified ? now : null;
    }

    const userStatus = await UserStatus.findOneAndUpdate(
      { walletAddress },
      { $set: update },
      { new: true, upsert: true }
    );

    return NextResponse.json(userStatus);
  } catch (error) {
    console.error('Error in POST /api/auth/status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 