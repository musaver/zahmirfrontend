import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailsClient from './ProductDetailsClient';

// Generate dynamic metadata for product pages
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    // Fetch product data for metadata
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: 'no-store' // Ensure fresh data for metadata
    });
    
    if (!res.ok) {
      return {
        title: 'Product Not Found - Zahmir Perfumes',
        description: 'The requested product could not be found.',
      };
    }
    
    const product = await res.json();
    
    // Generate SEO-friendly metadata
    const productName = product.name || 'Product';
    const productDescription = product.shortDescription || product.description || `Discover ${productName} at Zahmir Perfumes. Premium quality fragrance with exceptional craftsmanship.`;
    const productPrice = product.price ? `Starting from Rs${product.price}` : '';
    const categoryName = product.categoryName ? ` in ${product.categoryName}` : '';
    
    // Use product's meta fields if available, otherwise generate them
    const metaTitle = product.metaTitle || `${productName} - Premium Fragrance | Zahmir Perfumes`;
    const metaDescription = product.metaDescription || `${productDescription} ${productPrice} ${categoryName}. Free shipping available. Shop now at Zahmir Perfumes.`.trim();
    
    // Generate keywords from product data
    const keywords = [
      productName,
      'Zahmir Perfumes',
      'premium fragrance',
      'luxury perfume',
      product.categoryName,
      ...(product.tags ? (Array.isArray(product.tags) ? product.tags : []) : []),
      'fragrance',
      'perfume',
      'scent',
      'cologne'
    ].filter(Boolean).join(', ');
    
    // Get first product image for Open Graph
    let productImage = '/images/logo/logo.png'; // Default fallback
    if (product.images) {
      try {
        const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
        if (Array.isArray(images) && images.length > 0) {
          productImage = images[0];
        }
      } catch (e) {
        // Use default image if parsing fails
      }
    }
    
    return {
      title: metaTitle,
      description: metaDescription,
      keywords: keywords,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        type: 'website',
        siteName: 'Zahmir Perfumes',
        images: [
          {
            url: productImage,
            width: 800,
            height: 600,
            alt: productName,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: [productImage],
      },
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `/product-details/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product - Zahmir Perfumes',
      description: 'Discover premium fragrances at Zahmir Perfumes.',
    };
  }
}

// Server component that renders the client component
export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Verify product exists (optional - for better UX)
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      notFound();
    }
  } catch (error) {
    console.error('Error checking product existence:', error);
    // Continue to render - let client handle the error
  }
  
  return <ProductDetailsClient slug={slug} />;
}