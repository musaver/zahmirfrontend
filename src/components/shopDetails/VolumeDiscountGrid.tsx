"use client";
import React, { useState } from "react";
import Currency from "@/components/common/Currency";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Props {
  product: Product;
  onQuantityChange: (quantity: number) => void;
}

const VolumeDiscountGrid: React.FC<Props> = ({ product, onQuantityChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const discountsGrid = [
    {
      quantity: 1,
      price: product.price,
      savings: 0
    },
    {
      quantity: 3,
      price: product.price * 0.95, // 5% discount
      savings: product.price * 0.05 * 3
    },
    {
      quantity: 5,
      price: product.price * 0.90, // 10% discount
      savings: product.price * 0.10 * 5
    },
    {
      quantity: 10,
      price: product.price * 0.85, // 15% discount
      savings: product.price * 0.15 * 10
    }
  ];

  const handleDiscountClick = (index: number) => {
    setActiveIndex(index);
    onQuantityChange(discountsGrid[index].quantity);
  };

  return (
    <div className="tf-volume-discount-grid">
      <h4>Volume Discount</h4>
      <div className="discount-grid">
        {discountsGrid.map((discount, index) => (
          <div
            key={index}
            className={`discount-option ${activeIndex === index ? 'active' : ''}`}
            onClick={() => handleDiscountClick(index)}
          >
            <div className="quantity">Buy {discount.quantity}</div>
            <div className="price">
              <Currency amount={discount.price} /> each
            </div>
            {discount.savings > 0 && (
              <div className="savings">
                Save <Currency amount={discount.savings} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolumeDiscountGrid;
