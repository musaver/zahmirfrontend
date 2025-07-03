import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { normalizeProductImages } from '@/utils/jsonUtils';

export async function GET() {
  try {
    console.log('🔍 Fetching featured products...');
    
    const featuredProducts = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        shortDescription: products.shortDescription,
        price: products.price,
        comparePrice: products.comparePrice,
        images: products.images,
        isFeatured: products.isFeatured,
        isActive: products.isActive,
      })
      .from(products)
      .where(
        and(
          eq(products.isFeatured, true),
          eq(products.isActive, true)
        )
      )
      .limit(8); // Limit to 8 featured products

    console.log(`🔍 Found ${featuredProducts.length} featured products`);
    
    // Transform the products to ensure images are properly handled
    const transformedProducts = featuredProducts.map(product => {
      const normalizedImages = normalizeProductImages(product.images);
      console.log(`🔍 Product "${product.name}":`, {
        originalImages: product.images,
        normalizedImages: normalizedImages,
        firstImage: normalizedImages[0] || 'No images'
      });
      
      return {
        ...product,
        images: normalizedImages
      };
    });

    console.log('✅ Returning transformed products');
    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('❌ Error fetching featured products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured products' },
      { status: 500 }
    );
  }
} 