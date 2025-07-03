import React from 'react';
import PriceNumber from './PriceNumber';

interface CurrencyProps {
  amount: number | string;
  className?: string;
  showSymbol?: boolean;
  showDecimals?: boolean;
}

const Currency: React.FC<CurrencyProps> = ({
  amount,
  className = '',
  showSymbol = true,
  showDecimals = false,
}) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return <span className={className}>N/A</span>;
  }

  return (
    <span className={`currency-amount ${className}`}>
      {showSymbol && <span className="currency-symbol">Rs. </span>}
      <PriceNumber amount={numericAmount} />
    </span>
  );
};

export default Currency; 