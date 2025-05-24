import { NextResponse } from 'next/server';
import { verifyMessage } from 'ethers';
import jwt from 'jsonwebtoken';

const createTokenForAddress = (address: string) => {
  const payload = { address };
  const secretKey = process.env.JWT_SECRET_KEY || 'your_secret_key'; // Secret key from environment variable

  // Generate JWT token (with 1 day expiration)
  const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });

  return token;
};

export async function POST(req: Request) {
  try {
    const { address, signature, message } = await req.json();

    // Verify the signature using ethers.js
    const recoveredAddress = verifyMessage(message, signature);

    // Check if the recovered address matches the provided address
    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      // Generate a JWT token for the verified address
      const token = createTokenForAddress(address);

      // Create a response with the token in a cookie
      const response = NextResponse.json({ address });

      // Set the JWT token in the cookie with HttpOnly flag for security
      response.cookies.set('paaskeeper_token', token, {
        httpOnly: true, // Ensure the cookie can't be accessed via JavaScript
        secure: process.env.NODE_ENV === 'production', // Only set secure cookies in production
        path: '/', // The cookie is available for the entire app
        maxAge: 60 * 60 * 24, // 1 day expiration
      });

      return response;
    } else {
      return NextResponse.json({ error: 'Signature mismatch' }, { status: 401 });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
