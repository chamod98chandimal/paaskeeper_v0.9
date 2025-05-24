import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { walletAddress, password } = await request.json();
    // console.log('walletAddress', walletAddress);
    // console.log('password', password);

    if (!walletAddress || !password) {
      return NextResponse.json(
        { error: 'Wallet address and password are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ walletAddress });

    if (!user) {
      return NextResponse.json(
        { error: 'Password not set. Please set a password in settings.' },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
