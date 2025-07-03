import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/schema';
import { desc, eq, and, sql } from 'drizzle-orm';
import { normalizeProductImages } from '@/utils/jsonUtils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching products...');
    
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    console.log('📊 Query params:', { page, limit, offset });

    // Get total count of active products
    const [{ total }] = await db
      .select({
        total: sql<number>`count(*)`
      })
      .from(products)
      .where(eq(products.isActive, true));

    console.log('📈 Total active products:', total);

    // Get paginated products
    const productsList = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        shortDescription: products.shortDescription,
        sku: products.sku,
        price: products.price,
        comparePrice: products.comparePrice,
        images: products.images,
        isFeatured: products.isFeatured,
        isActive: products.isActive,
        productType: products.productType,
        requiresShipping: products.requiresShipping,
        isDigital: products.isDigital,
        weight: products.weight,
        dimensions: products.dimensions,
        categoryId: products.categoryId,
        subcategoryId: products.subcategoryId,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt
      })
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    console.log(`📦 Found ${productsList.length} products for page ${page}`);

    // Transform the products to ensure images are properly handled
    const transformedProducts = productsList.map(product => {
      const normalizedImages = normalizeProductImages(product.images);
      console.log(`🖼️ Product "${product.name}":`, {
        originalImages: product.images,
        normalizedImages: normalizedImages,
        firstImage: normalizedImages[0] || 'No images'
      });
      
      return {
        ...product,
        images: normalizedImages
      };
    });

    console.log('✅ Returning products response');
    return NextResponse.json({
      products: transformedProducts,
      total: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit)
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 