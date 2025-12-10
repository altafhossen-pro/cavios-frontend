"use client";
export default function QuantitySelect({
  quantity = 1,
  setQuantity = () => {},
  styleClass = "",
  maxQuantity = null, // Maximum allowed quantity (for stock limit)
}) {
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (maxQuantity === null || quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      // Apply max quantity limit if provided
      if (maxQuantity !== null && value > maxQuantity) {
        setQuantity(maxQuantity);
      } else {
        setQuantity(value);
      }
    }
  };

  const isIncreaseDisabled = maxQuantity !== null && quantity >= maxQuantity;

  return (
    <>
      <div className={`wg-quantity ${styleClass} `}>
        <span
          className="btn-quantity btn-decrease"
          onClick={handleDecrease}
          role="button"
          tabIndex={0}
        >
          -
        </span>
        <input
          className="quantity-product"
          type="number"
          name="number"
          value={quantity}
          min="1"
          max={maxQuantity || undefined}
          onChange={handleInputChange}
        />
        <span
          className={`btn-quantity btn-increase ${isIncreaseDisabled ? 'disabled' : ''}`}
          onClick={handleIncrease}
          role="button"
          tabIndex={0}
          style={isIncreaseDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          +
        </span>
      </div>
      {maxQuantity !== null && quantity >= maxQuantity && (
        <div className="text-caption-2 text-danger mt-2" style={{ fontSize: '12px' }}>
          Only {maxQuantity} available in stock
        </div>
      )}
    </>
  );
}
