import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  shortDescription: string;
}

interface SearchResultsProps {
  results: Product[];
  isLoading: boolean;
  onClose: () => void;
}

export default function SearchResults({ results, isLoading, onClose }: SearchResultsProps) {
  if (!results.length && !isLoading) return null;

  return (
    <div className="search-results-dropdown">
      {isLoading ? (
        <div className="search-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="search-results-list">
          {results.map((product) => (
            <Link
              href={`/product-details/${product.slug}`}
              key={product.id}
              className="search-result-item"
              onClick={onClose}
            >
              <div className="product-image">
                {product.images?.[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded"
                  />
                )}
              </div>
              <div className="product-info">
                <h6 className="product-name">{product.name}</h6>
                <p className="product-price">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        .search-results-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
        }

        .search-loading {
          padding: 20px;
          text-align: center;
        }

        .search-results-list {
          padding: 10px 0;
        }

        .search-result-item {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          text-decoration: none;
          color: inherit;
          transition: background-color 0.2s;
        }

        .search-result-item:hover {
          background-color: #f5f5f5;
        }

        .product-image {
          margin-right: 15px;
        }

        .product-info {
          flex: 1;
        }

        .product-name {
          margin: 0;
          font-size: 14px;
          color: #333;
        }

        .product-price {
          margin: 5px 0 0;
          font-size: 13px;
          color: #666;
        }
      `}</style>
    </div>
  );
} 