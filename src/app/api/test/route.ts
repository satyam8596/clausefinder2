import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      status: 'ok',
      message: 'POST request received',
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      message: 'Invalid JSON in request body',
      timestamp: new Date().toISOString()
    }, { status: 400 });
  }
} 