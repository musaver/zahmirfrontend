import { Metadata } from 'next';

export interface PageMetadata {
  title: string;
  description: string;
  keywords: string;
  pageTitle: string;
}

export const staticPagesMetadata: Record<string, PageMetadata> = {
  homepage: {
    title: "Zahmir Perfumes | Luxury Designer-Inspired Perfumes in Pakistan",
    description: "Discover Zahmir Perfumes, Pakistan’s premier destination for luxury designer-inspired fragrances at PKR 2,999. Shop Vibe, Impact, Miraal, Impulse, and Sublime online in Karachi, Lahore, and Islamabad!",
    keywords: "designer perfumes Pakistan, luxury fragrances Pakistan, affordable perfumes Karachi, designer-inspired perfumes Lahore, premium perfumes Islamabad, Zahmir Perfumes.",
    pageTitle: "Zahmir Perfumes | Luxury Designer-Inspired Perfumes in Pakistan"
  },
  faq: {
    title: "Frequently Asked Questions - Zahmir Perfumes",
    description: "Find answers to common questions about Zahmir Perfumes products, shipping, returns, and more. Get help with your fragrance shopping experience.",
    keywords: "FAQ, frequently asked questions, Zahmir Perfumes help, perfume questions, shipping info, returns policy, customer support",
    pageTitle: "Frequently Asked Questions"
  },
  aboutUs: {
    title: "About Zahmir Perfumes | Luxury Designer-Inspired Perfumes in Pakistan",
    description: "Discover Zahmir Perfumes, offering premium designer-inspired fragrances made in Dubai. Shop 50ml bottles of Vibe, Impact, Miraal, and Impulse for PKR 2,999 in Pakistan!",
    keywords: "about Zahmir Perfumes, designer perfumes Pakistan, luxury fragrances Dubai, affordable perfumes Karachi, designer-inspired perfumes Lahore, premium perfumes Islamabad, 50ml perfumes Pakistan.",
    pageTitle: "About Zahmir Perfumes | Luxury Designer-Inspired Perfumes in Pakistan"
  },
  privacyPolicy: {
    title: "Privacy Policy - Zahmir Perfumes",
    description: "",
    keywords: "",
    pageTitle: "Privacy Policy"
  },
  deliveryReturn: {
    title: "Delivery & Returns - Zahmir Perfumes Shipping Information",
    description: "Learn about Zahmir Perfumes' delivery options, shipping policies, and return procedures. Free shipping available on orders over specified amount.",
    keywords: "delivery information, shipping policy, returns, refunds, Zahmir Perfumes shipping, free shipping, return policy",
    pageTitle: "Delivery & Returns Information"
  }
};

// Helper function to generate Next.js metadata object
export function generateStaticMetadata(pageKey: keyof typeof staticPagesMetadata): Metadata {
  const pageMetadata = staticPagesMetadata[pageKey];
  
  return {
    title: pageMetadata.title,
    description: pageMetadata.description,
    keywords: pageMetadata.keywords,
    openGraph: {
      title: pageMetadata.title,
      description: pageMetadata.description,
      type: 'website',
      siteName: 'Zahmir Perfumes',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageMetadata.title,
      description: pageMetadata.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Helper function to get page title for display
export function getPageTitle(pageKey: keyof typeof staticPagesMetadata): string {
  return staticPagesMetadata[pageKey].pageTitle;
} 