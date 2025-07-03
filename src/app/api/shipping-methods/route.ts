import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { shippingMethods } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const methods = await db.select().from(shippingMethods).where(eq(shippingMethods.isActive, true));
    
    return NextResponse.json({
      success: true,
      methods: methods.map(method => ({
        id: method.id,
        name: method.name,
        code: method.code,
        description: method.description,
        price: parseFloat(method.price.toString()),
        estimatedDays: method.estimatedDays,
      }))
    });
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipping methods' },
      { status: 500 }
    );
  }
} 