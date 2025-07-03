import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/schema';
import { eq, like, or, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchQuery = request.nextUrl.searchParams.get('q');

    if (!searchQuery || searchQuery.length < 2) {
      return NextResponse.json({ products: [] });
    }

    const searchResults = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        images: products.images,
        shortDescription: products.shortDescription,
      })
      .from(products)
      .where(
        and(
          eq(products.isActive, true),
          or(
            like(products.name, `%${searchQuery}%`),
            like(products.shortDescription, `%${searchQuery}%`),
            like(products.description, `%${searchQuery}%`)
          )
        )
      )
      .limit(10);

    return NextResponse.json({
      success: true,
      products: searchResults,
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
} 