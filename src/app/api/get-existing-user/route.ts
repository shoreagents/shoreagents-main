import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get the most recent user from the database
    const existingUser = await prisma.user.findFirst({
      orderBy: { created_at: 'desc' },
      select: { user_id: true }
    });

    if (existingUser) {
      console.log('Found existing user:', existingUser.user_id);
      return NextResponse.json({ 
        success: true, 
        userId: existingUser.user_id 
      });
    } else {
      console.log('No existing user found, generating new one');
      // If no user exists, we'll let the frontend generate one
      return NextResponse.json({ 
        success: true, 
        userId: null 
      });
    }
  } catch (error) {
    console.error('Error getting existing user:', error);
    return NextResponse.json({ 
      error: 'Failed to get existing user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
