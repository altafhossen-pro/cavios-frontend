"use client";

import React, { useState, useEffect, useRef } from "react";

export default function ColorSelect2({
  activeColor = "",
  setActiveColor,
  productColors = [],
}) {
  const [activeColorDefault, setActiveColorDefault] = useState("");

  // Map product colors to color options
  const colorOptions = productColors.map((color, index) => {
    const colorValue = color.value || color.name || color.bgColor || `color-${index}`;
    const displayValue = color.displayValue || colorValue;
    const colorKey = colorValue.toLowerCase().replace(/\s+/g, '-');
    
    return {
      id: `values-${colorKey}-${index}`,
      value: displayValue,
      color: colorKey,
      hexCode: color.hexCode || null,
      bgColor: color.bgColor || null,
    };
  });

  // Track if we've initialized to prevent resetting on productColors change
  const hasInitializedRef = useRef(false);
  const previousColorOptionsRef = useRef([]);
  
  useEffect(() => {
    // Check if colorOptions actually changed (by comparing length and first color)
    const optionsChanged = 
      previousColorOptionsRef.current.length !== colorOptions.length ||
      (colorOptions.length > 0 && previousColorOptionsRef.current.length > 0 &&
       previousColorOptionsRef.current[0]?.color !== colorOptions[0]?.color);
    
    // Only set initial color if:
    // 1. We have color options
    // 2. No active color is set
    // 3. We haven't initialized yet (to prevent resetting when user selects)
    // 4. Options actually changed (not just a re-render with same options)
    if (colorOptions.length > 0 && !activeColor && !hasInitializedRef.current && optionsChanged) {
      const firstColor = colorOptions[0].color;
      if (setActiveColor) {
        setActiveColor(firstColor);
      } else {
        setActiveColorDefault(firstColor);
      }
      hasInitializedRef.current = true;
    }
    
    // Reset initialization flag if productColors changes significantly (new product)
    // This allows re-initialization for new products
    if (colorOptions.length === 0) {
      hasInitializedRef.current = false;
    }
    
    // Update previous options reference
    previousColorOptionsRef.current = colorOptions;
  }, [productColors, colorOptions.length, activeColor]);

  const handleSelectColor = (value, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Prevent multiple rapid clicks
    if (setActiveColor) {
      setActiveColor(value);
    } else {
      setActiveColorDefault(value);
    }
  };

  if (colorOptions.length === 0) {
    return null;
  }

  return (
    <div className="variant-picker-item">
      <div className="variant-picker-label mb_12">
        Colors:
        <span
          className="text-title variant-picker-label-value value-currentColor"
          style={{ textTransform: "capitalize" }}
        >
          {activeColor || activeColorDefault || colorOptions[0]?.value}
        </span>
      </div>
      <div className="variant-picker-values">
        {colorOptions.map(({ id, value, color, hexCode, bgColor }) => {
          const isHexCode = hexCode && hexCode.trim() !== '';
          const isBgColorHex = bgColor && bgColor.startsWith('#');
          const hexValue = isHexCode ? hexCode : (isBgColorHex ? bgColor : null);
          
          // Check if color is white or close to white
          const isWhiteColor = () => {
            if (!hexValue) {
              // Check if color name contains "white"
              return color.toLowerCase().includes('white');
            }
            // Normalize hex value
            const normalizedHex = hexValue.replace('#', '').toLowerCase();
            // Check for white variations: #ffffff, #fff, #fefefe, etc.
            if (normalizedHex === 'fff' || normalizedHex === 'ffffff') {
              return true;
            }
            // Check if it's very close to white (RGB values all > 240)
            if (normalizedHex.length === 6) {
              const r = parseInt(normalizedHex.substring(0, 2), 16);
              const g = parseInt(normalizedHex.substring(2, 4), 16);
              const b = parseInt(normalizedHex.substring(4, 6), 16);
              return r > 240 && g > 240 && b > 240;
            }
            return false;
          };
          
          const isWhite = isWhiteColor();
          
          return (
            <React.Fragment key={id}>
              <input
                id={id}
                type="radio"
                readOnly
                checked={
                  activeColor ? activeColor === color : activeColorDefault === color
                }
              />
              <label
                onClick={(e) => {
                  handleSelectColor(color, e);
                }}
                className={`hover-tooltip tooltip-bot radius-60 color-btn ${
                  activeColor
                    ? activeColor === color
                      ? "active"
                      : ""
                    : activeColorDefault === color
                    ? "active"
                    : ""
                }`}
                htmlFor={id}
              >
                <span 
                  className={`btn-checkbox ${hexValue ? '' : `bg-color-${color}`}`}
                  style={hexValue ? { 
                    backgroundColor: hexValue,
                    ...(isWhite ? { border: '1px solid #999' } : {})
                  } : (isWhite ? { border: '1px solid #999' } : {})}
                />
                <span className="tooltip">{value}</span>
              </label>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
