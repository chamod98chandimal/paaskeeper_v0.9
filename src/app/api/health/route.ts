import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkDB = searchParams.get('db') === 'true';

    const healthData: any = {
      status: 'ok',
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || 'unknown',
      node_version: process.version,
      memory_usage: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(process.memoryUsage().external / 1024 / 1024)}MB`
      }
    };

    // Optional database connectivity check
    if (checkDB) {
      try {
        await connectDB();
        healthData.database = {
          status: 'connected',
          message: 'Database connection successful'
        };
      } catch (dbError) {
        healthData.database = {
          status: 'error',
          message: 'Database connection failed',
          error: dbError instanceof Error ? dbError.message : 'Unknown database error'
        };
        healthData.status = 'degraded';
      }
    }

    const statusCode = healthData.status === 'ok' ? 200 : 503;

    return NextResponse.json(healthData, { 
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error in GET /api/health:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 