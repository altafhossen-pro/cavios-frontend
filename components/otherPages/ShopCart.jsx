"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "../common/Countdown";
import { useContextElement } from "@/context/Context";
import { formatPrice } from "@/config/currency";

const discounts = [
  {
    discount: "10% OFF",
    details: "For all orders from 200$",
    code: "Mo234231",
  },
  {
    discount: "10% OFF",
    details: "For all orders from 200$",
    code: "Mo234231",
  },
  {
    discount: "10% OFF",
    details: "For all orders from 200$",
    code: "Mo234231",
  },
];

const shippingOptions = [
  {
    id: "free",
    label: "Free Shipping",
    price: 0.0,
  },
  {
    id: "local",
    label: "Local:",
    price: 35.0,
  },
  {
    id: "rate",
    label: "Flat Rate:",
    price: 35.0,
  },
];

// Free shipping threshold
const FREE_SHIPPING_THRESHOLD = 200;

export default function ShopCart() {
  const [activeDiscountIndex, setActiveDiscountIndex] = useState(1);
  const [selectedOption, setSelectedOption] = useState(shippingOptions[0]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    cartProducts, 
    totalPrice, 
    updateQuantity, 
    removeCartItem 
  } = useContextElement();

  // Set loading to false once cart products are loaded from localStorage
  useEffect(() => {
    // Check if cart is loaded (not just empty, but actually loaded)
    // If cartProducts is an array (even if empty), it means it's loaded
    if (Array.isArray(cartProducts)) {
      // Small delay for smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [cartProducts]);

  // Calculate free shipping progress
  const freeShippingProgress = useMemo(() => {
    if (totalPrice >= FREE_SHIPPING_THRESHOLD) {
      return 100;
    }
    return Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);
  }, [totalPrice]);

  const remainingForFreeShipping = useMemo(() => {
    if (totalPrice >= FREE_SHIPPING_THRESHOLD) {
      return 0;
    }
    return Math.max(FREE_SHIPPING_THRESHOLD - totalPrice, 0);
  }, [totalPrice]);

  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity >= 1) {
      // Find the cart item to check stock limit
      const cartItem = cartProducts.find(item => item.cartItemId === cartItemId);
      if (cartItem) {
        // Respect stock quantity limit if available
        const maxQuantity = cartItem.stockQuantity;
        if (maxQuantity !== null && maxQuantity !== undefined && newQuantity > maxQuantity) {
          updateQuantity(cartItemId, maxQuantity);
        } else {
          updateQuantity(cartItemId, newQuantity);
        }
      } else {
        updateQuantity(cartItemId, newQuantity);
      }
    }
  };

  const handleRemoveItem = (cartItemId) => {
    removeCartItem(cartItemId);
  };

  const handleOptionChange = (elm) => {
    setSelectedOption(elm);
  };

  // Update free shipping progress bar
  useEffect(() => {
    const progressElement = document.querySelector(".progress-cart .value");
    if (progressElement) {
      progressElement.style.width = `${freeShippingProgress}%`;
    }
  }, [freeShippingProgress]);

  return (
    <>
      <section style={{paddingTop: "20px"}} className="flat-spacing">
        <div className="container">
          <div className="row">
            <div className="col-xl-8">
              <div className="tf-cart-sold">
                {/* <div className="notification-sold bg-surface">
                  <Image
                    className="icon"
                    alt="img"
                    src="/images/logo/icon-fire.png"
                    width={48}
                    height={49}
                  />
                  <div className="count-text">
                    Your cart will expire in
                    <div
                      className="js-countdown time-count"
                      data-timer={600}
                      data-labels=":,:,:,"
                    >
                      <CountdownTimer
                        style={4}
                        targetDate={new Date(new Date().getTime() - 30 * 60000)}
                      />
                    </div>
                    minutes! Please checkout now before your items sell out!
                  </div>
                </div> */}
                  {/* <div className="notification-progress">
                  <div className="text">
                    {remainingForFreeShipping > 0 ? (
                      <>
                        Buy
                        <span className="fw-semibold text-primary">
                          {formatPrice(remainingForFreeShipping)}
                        </span>{" "}
                        more to get <span className="fw-semibold">Freeship</span>
                      </>
                    ) : (
                      <span className="fw-semibold text-primary">
                        Congratulations! You've got free shipping!
                      </span>
                    )}
                  </div>
                  <div className="progress-cart">
                    <div
                      className="value"
                      style={{ width: `${freeShippingProgress}%` }}
                      data-progress={freeShippingProgress}
                    >
                      <span className="round" />
                    </div>
                  </div>
                </div> */}
              </div>
              {isLoading ? (
                <>
                  <div className="cart-loading-skeleton">
                    <div className="skeleton-table">
                      <div className="skeleton-header">
                        <div className="skeleton-cell"></div>
                        <div className="skeleton-cell"></div>
                        <div className="skeleton-cell"></div>
                        <div className="skeleton-cell"></div>
                        <div className="skeleton-cell"></div>
                      </div>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton-row">
                          <div className="skeleton-cell skeleton-product">
                            <div className="skeleton-image"></div>
                            <div className="skeleton-text">
                              <div className="skeleton-line"></div>
                              <div className="skeleton-line short"></div>
                            </div>
                          </div>
                          <div className="skeleton-cell"></div>
                          <div className="skeleton-cell"></div>
                          <div className="skeleton-cell"></div>
                          <div className="skeleton-cell"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <style jsx>{`
                    .cart-loading-skeleton {
                      width: 100%;
                    }
                    .skeleton-table {
                      width: 100%;
                    }
                    .skeleton-header {
                      display: flex;
                      gap: 20px;
                      padding: 16px 0;
                      border-bottom: 1px solid var(--line, #e0e0e0);
                      margin-bottom: 20px;
                    }
                    .skeleton-row {
                      display: flex;
                      gap: 20px;
                      padding: 20px 0;
                      border-bottom: 1px solid var(--line, #e0e0e0);
                      align-items: center;
                    }
                    .skeleton-cell {
                      flex: 1;
                      height: 20px;
                      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                      background-size: 200% 100%;
                      animation: shimmer 1.5s infinite;
                      border-radius: 4px;
                    }
                    .skeleton-product {
                      flex: 2;
                      display: flex;
                      gap: 16px;
                      align-items: center;
                    }
                    .skeleton-image {
                      width: 100px;
                      height: 100px;
                      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                      background-size: 200% 100%;
                      animation: shimmer 1.5s infinite;
                      border-radius: 8px;
                      flex-shrink: 0;
                    }
                    .skeleton-text {
                      flex: 1;
                      display: flex;
                      flex-direction: column;
                      gap: 8px;
                    }
                    .skeleton-line {
                      height: 16px;
                      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                      background-size: 200% 100%;
                      animation: shimmer 1.5s infinite;
                      border-radius: 4px;
                    }
                    .skeleton-line.short {
                      width: 60%;
                    }
                    @keyframes shimmer {
                      0% {
                        background-position: -200% 0;
                      }
                      100% {
                        background-position: 200% 0;
                      }
                    }
                    @media (max-width: 768px) {
                      .skeleton-header,
                      .skeleton-row {
                        flex-direction: column;
                        gap: 12px;
                      }
                      .skeleton-cell {
                        width: 100%;
                      }
                      .skeleton-product {
                        flex-direction: row;
                      }
                    }
                  `}</style>
                </>
              ) : cartProducts.length ? (
                <form onSubmit={(e) => e.preventDefault()}>
                  <table className="tf-table-page-cart">
                    <thead>
                      <tr>
                        <th>Products</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {cartProducts.map((item, i) => {
                        const itemTotal = (item.price || 0) * (item.quantity || 1);
                        const productUrl = item.productSlug 
                          ? `/product-detail/${item.productSlug}` 
                          : `/product-detail/${item.productId}`;
                        
                        return (
                          <tr key={item.cartItemId || i} className="tf-cart-item file-delete">
                            <td className="tf-cart-item_product">
                              <Link
                                href={productUrl}
                                className="img-box"
                              >
                                <Image
                                  alt={item.productTitle || 'Product'}
                                  src={item.productImage || '/images/default-product.jpg'}
                                  width={600}
                                  height={800}
                                />
                              </Link>
                              <div className="cart-info">
                                <Link
                                  href={productUrl}
                                  className="cart-title link"
                                >
                                  {item.productTitle || 'Product'}
                                </Link>
                                {(item.size || item.color) && (
                                  <div className="variant-box">
                                    {item.size && (
                                      <div className="variant-info text-caption-1 text-secondary">
                                        Size: <span className="fw-semibold">{item.size}</span>
                                      </div>
                                    )}
                                    {item.color && (
                                      <div className="variant-info text-caption-1 text-secondary">
                                        Color: <span className="fw-semibold">{item.color}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td
                              data-cart-title="Price"
                              className="tf-cart-item_price text-center"
                            >
                              <div className="cart-price text-button price-on-sale">
                                {formatPrice(item.price || 0)}
                              </div>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <div className="cart-price-compare text-caption-1 text-secondary">
                                  {formatPrice(item.originalPrice)}
                                </div>
                              )}
                            </td>
                            <td
                              data-cart-title="Quantity"
                              className="tf-cart-item_quantity"
                            >
                              <div className="wg-quantity mx-md-auto">
                                <span
                                  className="btn-quantity btn-decrease"
                                  onClick={() =>
                                    handleQuantityChange(item.cartItemId, (item.quantity || 1) - 1)
                                  }
                                >
                                  -
                                </span>
                                <input
                                  type="text"
                                  className="quantity-product"
                                  name="number"
                                  value={item.quantity || 1}
                                  readOnly
                                />
                                <span
                                  className={`btn-quantity btn-increase ${
                                    item.stockQuantity !== null && 
                                    item.stockQuantity !== undefined && 
                                    (item.quantity || 1) >= item.stockQuantity 
                                      ? 'disabled' : ''
                                  }`}
                                  onClick={() => {
                                    if (
                                      item.stockQuantity === null || 
                                      item.stockQuantity === undefined || 
                                      (item.quantity || 1) < item.stockQuantity
                                    ) {
                                      handleQuantityChange(item.cartItemId, (item.quantity || 1) + 1);
                                    }
                                  }}
                                >
                                  +
                                </span>
                              </div>
                              {item.stockQuantity !== null && 
                               item.stockQuantity !== undefined && 
                               (item.quantity || 1) >= item.stockQuantity && (
                                <div className="text-caption-1 text-secondary mt-2">
                                  Max quantity: {item.stockQuantity}
                                </div>
                              )}
                            </td>
                            <td
                              data-cart-title="Total"
                              className="tf-cart-item_total text-center"
                            >
                              <div className="cart-total text-button total-price">
                                {formatPrice(itemTotal)}
                              </div>
                            </td>
                            <td
                              data-cart-title="Remove"
                              className="remove-cart"
                              onClick={() => handleRemoveItem(item.cartItemId)}
                            >
                              <span className="remove icon icon-close" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {/* <div className="ip-discount-code">
                    <input type="text" placeholder="Add voucher discount" />
                    <button className="tf-btn">
                      <span className="text">Apply Code</span>
                    </button>
                  </div>
                  <div className="group-discount">
                    {discounts.map((item, index) => (
                      <div
                        key={index}
                        className={`box-discount ${
                          activeDiscountIndex === index ? "active" : ""
                        }`}
                        onClick={() => setActiveDiscountIndex(index)}
                      >
                        <div className="discount-top">
                          <div className="discount-off">
                            <div className="text-caption-1">Discount</div>
                            <span className="sale-off text-btn-uppercase">
                              {item.discount}
                            </span>
                          </div>
                          <div className="discount-from">
                            <p className="text-caption-1">{item.details}</p>
                          </div>
                        </div>
                        <div className="discount-bot">
                          <span className="text-btn-uppercase">
                            {item.code}
                          </span>
                          <button className="tf-btn">
                            <span className="text">Apply Code</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div> */}
                </form>
              ) : (
                <div className="empty-cart-message">
                  <p>Your cart is empty. Start adding your favorite products to your cart!</p>
                  <Link className="btn-line" href="/shop-default-grid">
                    Explore Products
                  </Link>
                </div>
              )}
            </div>
            <div className="col-xl-4">
              <div className="fl-sidebar-cart">
                <div className="box-order bg-surface">
                  <h5 className="title">Order Summary</h5>
                  <div className="subtotal text-button d-flex justify-content-between align-items-center">
                    <span>Subtotal</span>
                    <span className="total">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="discount text-button d-flex justify-content-between align-items-center">
                    <span>Discounts</span>
                    <span className="total">{formatPrice(0)}</span>
                  </div>
                  <div className="ship">
                    <span className="text-button">Shipping</span>
                    <div className="flex-grow-1">
                      {shippingOptions.map((option) => (
                        <fieldset key={option.id} className="ship-item">
                          <input
                            type="radio"
                            name="ship-check"
                            className="tf-check-rounded"
                            id={option.id}
                            checked={selectedOption === option}
                            onChange={() => handleOptionChange(option)}
                          />
                            <label htmlFor={option.id}>
                            <span>{option.label}</span>
                            <span className="price">
                              {formatPrice(option.price)}
                            </span>
                          </label>
                        </fieldset>
                      ))}
                    </div>
                  </div>
                  <h5 className="total-order d-flex justify-content-between align-items-center">
                    <span>Total</span>
                    <span className="total">
                      {formatPrice(totalPrice + selectedOption.price)}
                    </span>
                  </h5>
                  <div className="box-progress-checkout">
                    <fieldset className="check-agree">
                      <input
                        type="checkbox"
                        id="check-agree"
                        className="tf-check-rounded"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                      />
                      <label htmlFor="check-agree">
                        I agree with the
                        <Link href={`/term-of-use`}>terms and conditions</Link>
                      </label>
                    </fieldset>
                    {agreeToTerms ? (
                      <Link href={`/checkout`} className="tf-btn btn-reset">
                        Process To Checkout
                      </Link>
                    ) : (
                      <button 
                        className="tf-btn btn-reset" 
                        disabled
                        style={{ cursor: 'not-allowed', opacity: 0.6 }}
                      >
                        Process To Checkout
                      </button>
                    )}
                    <p className="text-button text-center">
                      Or continue shopping
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
