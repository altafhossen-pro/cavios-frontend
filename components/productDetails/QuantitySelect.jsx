"use client";
export default function QuantitySelect({
  quantity = 1,
  setQuantity = () => {},
  styleClass = "",
  maxQuantity = null, // Maximum allowed quantity (for stock limit)
  disabled = false, // Disable all controls if out of stock
}) {
  const handleDecrease = () => {
    if (disabled) return;
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (disabled) return;
    if (maxQuantity === null || quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleInputChange = (e) => {
    if (disabled) return;
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

  const isIncreaseDisabled = disabled || (maxQuantity !== null && quantity >= maxQuantity);

  return (
    <>
      <div className={`wg-quantity ${styleClass} ${disabled ? 'disabled' : ''}`}>
        <span
          className={`btn-quantity btn-decrease ${disabled ? 'disabled' : ''}`}
          onClick={handleDecrease}
          onMouseDown={(e) => e.preventDefault()}
          role="button"
          tabIndex={0}
          style={{
            ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
          }}
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
          disabled={disabled}
          style={disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        />
        <span
          className={`btn-quantity btn-increase ${isIncreaseDisabled ? 'disabled' : ''}`}
          onClick={handleIncrease}
          onMouseDown={(e) => e.preventDefault()}
          role="button"
          tabIndex={0}
          style={{
            ...(isIncreaseDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
          }}
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
