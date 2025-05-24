import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = {
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };

    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error in GET /api/ping:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Server error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

export async function POST() {
  // Also support POST method for flexibility
  return GET();
} 