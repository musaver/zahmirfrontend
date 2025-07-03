import React from 'react';

interface PriceNumberProps {
  amount: number | string;
  className?: string;
}

const PriceNumber: React.FC<PriceNumberProps> = ({
  amount,
  className = '',
}) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return <span className={className}>N/A</span>;
  }

  // Round to whole number and format with thousands separator
  const formattedAmount = Math.round(numericAmount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return (
    <span className={`price-number ${className}`}>
      {formattedAmount}
    </span>
  );
};

export default PriceNumber; 