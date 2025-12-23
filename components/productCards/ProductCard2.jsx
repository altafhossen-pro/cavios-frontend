"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "../common/Countdown";
import { useContextElement } from "@/context/Context";
import { formatPrice } from "@/config/currency";
export default function ProductCard2({
  product,
  gridClass = "",
  parentClass = "card-product wow fadeInUp",
  isNotImageRatio = false,
  radiusClass = "",
}) {
  // Ensure we always have a valid image URL
  const defaultImage = '/images/logo/logo.svg';
  const mainImage = product.imgSrc && product.imgSrc.trim() !== '' 
    ? product.imgSrc 
    : defaultImage;
  
  // Only use hover image if it exists and is different from main image
  const hoverImage = product.imgHover && product.imgHover.trim() !== '' && product.imgHover !== product.imgSrc
    ? product.imgHover 
    : null; // null means no hover image, so same image will be shown

  const [currentImage, setCurrentImage] = useState(mainImage);

  const {
    setQuickAddItem,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
    setQuickViewItem,
    addProductToCart,
    isAddedToCartProducts,
  } = useContextElement();

  useEffect(() => {
    const newImage = product.imgSrc && product.imgSrc.trim() !== '' 
      ? product.imgSrc 
      : defaultImage;
    setCurrentImage(newImage);
  }, [product]);

  return (
    <div
      className={`${parentClass} ${gridClass} ${
        product.isOnSale ? "on-sale" : ""
      } ${product.sizes ? "card-product-size" : ""}`}
    >
      <div
        className={`card-product-wrapper ${
          isNotImageRatio ? "aspect-ratio-0" : ""
        } ${radiusClass} ${!hoverImage || hoverImage === mainImage ? 'no-hover-image' : ''}`}
      >
        <Link href={`/product-detail/${product.slug || product.id}`} className="product-img">
          <Image
            className="lazyload img-product"
            src={currentImage || defaultImage}
            alt={product.title || 'Product'}
            width={600}
            height={800}
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />

          {/* Only show hover image if it exists and is different from main image */}
          {hoverImage && hoverImage !== mainImage && (
            <Image
              className="lazyload img-hover"
              src={hoverImage}
              alt={product.title || 'Product'}
              width={600}
              height={800}
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
          )}
        </Link>
        {product.hotSale && (
          <div className="marquee-product bg-main">
            <div className="marquee-wrapper">
              <div className="initial-child-container">
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
              </div>
            </div>
            <div className="marquee-wrapper">
              <div className="initial-child-container">
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
              </div>
            </div>
          </div>
        )}
        {product.isOnSale && (
          <div className="on-sale-wrap">
            <span className="on-sale-item">-{product.salePercentage}</span>
          </div>
        )}
        {product.sizes && (
          <div className="variant-wrap size-list">
            <ul className="variant-box">
              {product.sizes.map((size) => (
                <li key={size} className="size-item">
                  {size}
                </li>
              ))}
            </ul>
          </div>
        )}
        {product.countdown && (
          <div className="variant-wrap countdown-wrap">
            <div className="variant-box">
              <div
                className="js-countdown"
                data-timer={product.countdown}
                data-labels="D :,H :,M :,S"
              >
                <CountdownTimer />
              </div>
            </div>
          </div>
        )}
        {product.oldPrice ? (
          <div className="on-sale-wrap">
            <span className="on-sale-item">-25%</span>
          </div>
        ) : (
          ""
        )}
        <div className="list-product-btn">
          <a
            onClick={() => addToWishlist(product.id)}
            className="box-icon wishlist btn-icon-action"
          >
            <span className="icon icon-heart" />
            <span className="tooltip">
              {isAddedtoWishlist(product.id)
                ? "Already Wishlished"
                : "Wishlist"}
            </span>
          </a>
          <a
            href="#compare"
            data-bs-toggle="offcanvas"
            aria-controls="compare"
            onClick={() => addToCompareItem(product.id)}
            className="box-icon compare btn-icon-action"
          >
            <span className="icon icon-gitDiff" />
            <span className="tooltip">
              {isAddedtoCompareItem(product.id)
                ? "Already compared"
                : "Compare"}
            </span>
          </a>
          <a
            href="#quickView"
            onClick={() => setQuickViewItem(product)}
            data-bs-toggle="modal"
            className="box-icon quickview tf-btn-loading"
          >
            <span className="icon icon-eye" />
            <span className="tooltip">Quick View</span>
          </a>
        </div>
        <div className="list-btn-main">
          {product.addToCart == "Quick Add" ? (
            <a
              className="btn-main-product"
              href="#quickAdd"
              onClick={() => setQuickAddItem(product.id)}
              data-bs-toggle="modal"
            >
              Quick Add
            </a>
          ) : (
            <a
              className="btn-main-product"
              onClick={() => addProductToCart(product.id)}
            >
              {isAddedToCartProducts(product.id)
                ? "Already Added"
                : "ADD TO CART"}
            </a>
          )}
        </div>
      </div>
      <div className="card-product-info">
        <Link href={`/product-detail/${product.slug || product.id}`} className="title link">
          {product.title}
        </Link>
        <span className="price">
          {product.oldPrice && (
            <span className="old-price">{formatPrice(product.oldPrice)}</span>
          )}{" "}
          {formatPrice(product.price)}
        </span>
        {product.colors && product.colors.length > 0 && (
          <ul className="list-color-product">
            {product.colors.map((color, index) => {
              const colorImage = color.imgSrc && color.imgSrc.trim() !== '' 
                ? color.imgSrc 
                : defaultImage;
              // Check if bgColor is a hex code (starts with #) or a CSS class
              const isHexCode = color.bgColor && color.bgColor.startsWith('#');
              const isHexCodeFromAttr = color.hexCode && color.hexCode.trim() !== '';
              const hexValue = isHexCodeFromAttr ? color.hexCode : (isHexCode ? color.bgColor : null);
              
              return (
                <li
                  key={index}
                  className={`list-color-item color-swatch ${
                    currentImage == colorImage ? "active" : ""
                  } ${color.bgColor == "bg-white" || hexValue === "#ffffff" || hexValue === "#fff" ? "line" : ""}`}
                  onMouseOver={() => setCurrentImage(colorImage)}
                >
                  <span 
                    className={`swatch-value ${hexValue ? '' : (color.bgColor || '')}`}
                    style={hexValue ? { backgroundColor: hexValue } : {}}
                  />
                  <Image
                    className="lazyload"
                    src={colorImage}
                    alt="color variant"
                    width={600}
                    height={800}
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
