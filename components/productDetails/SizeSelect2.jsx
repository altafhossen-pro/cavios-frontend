"use client";

import { useState, useEffect } from "react";

export default function SizeSelect2({ 
  productSizes = [],
  selectedSize: propSelectedSize = "",
  setSelectedSize: propSetSelectedSize = null,
  onSizeChange = null,
}) {
  const [selectedSize, setSelectedSize] = useState("");

  // Map product sizes to size options
  const sizes = productSizes.map((size, index) => {
    const sizeValue = typeof size === 'string' ? size : (size.value || size.name || `size-${index}`);
    return {
      id: `values-${sizeValue.toLowerCase()}-${index}`,
      value: sizeValue,
      price: typeof size === 'object' ? (size.price || 0) : 0,
      disabled: typeof size === 'object' ? (size.disabled || false) : false,
    };
  });

  useEffect(() => {
    if (propSelectedSize) {
      // Use prop value if provided
      if (propSetSelectedSize) {
        // Parent controls state
        return;
      } else {
        setSelectedSize(propSelectedSize);
      }
    } else if (sizes.length > 0 && !selectedSize) {
      // Find first non-disabled size, or first size if all disabled
      const firstAvailable = sizes.find(s => !s.disabled) || sizes[0];
      if (firstAvailable) {
        const value = firstAvailable.value;
        if (propSetSelectedSize) {
          propSetSelectedSize(value);
        } else {
          setSelectedSize(value);
        }
      }
    }
  }, [productSizes, propSelectedSize]);

  const handleChange = (value) => {
    // Call onSizeChange callback if provided (to notify parent of manual selection)
    if (onSizeChange) {
      onSizeChange(value);
    }
    if (propSetSelectedSize) {
      propSetSelectedSize(value);
    } else {
      setSelectedSize(value);
    }
  };
  
  const displaySize = propSelectedSize || selectedSize;

  if (sizes.length === 0) {
    return null;
  }

  return (
    <div className="variant-picker-item">
      <div className="d-flex justify-content-between mb_12">
        <div className="variant-picker-label">
          selected size:
          <span className="text-title variant-picker-label-value">
            {displaySize || sizes[0]?.value}
          </span>
        </div>
        <a
          href="#size-guide"
          data-bs-toggle="modal"
          className="size-guide text-title link"
        >
          Size Guide
        </a>
      </div>
      <div className="variant-picker-values gap12">
        {sizes.map(({ id, value, price, disabled }) => (
          <div key={id} onClick={() => !disabled && handleChange(value)}>
            <input
              type="radio"
              id={id}
              checked={displaySize === value}
              disabled={disabled}
              readOnly
            />
            <label
              className={`style-text size-btn ${
                disabled ? "type-disable" : ""
              }`}
              htmlFor={id}
              data-value={value}
              data-price={price}
            >
              <span className="text-title">{value}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
