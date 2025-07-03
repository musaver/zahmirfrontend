import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { user as userTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ 
        error: 'Name is required' 
      }, { status: 400 });
    }

    // Update user profile
    await db
      .update(userTable)
      .set({
        name,
        phone: phone || null,
        updatedAt: new Date()
      })
      .where(eq(userTable.id, session.user.id));

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user profile
    const [userProfile] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, session.user.id))
      .limit(1);

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        image: userProfile.image
      }
    });

  } catch (error) {
    console.error('Fetch profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
} 