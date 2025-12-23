"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "../common/Countdown";
import { formatPrice } from "@/config/currency";
import { useContextElement } from "@/context/Context";
export default function ProductsCards6({ product }) {
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
    setQuickViewItem2,
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
      className="card-product style-list"
      data-availability="In stock"
      data-brand="gucci"
    >
      <div className={`card-product-wrapper ${!hoverImage || hoverImage === mainImage ? 'no-hover-image' : ''}`}>
        <Link href={`/product-detail/${product.id}`} className="product-img">
          <Image
            className="lazyload img-product"
            src={currentImage || defaultImage}
            alt={product.title}
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
              alt={product.title}
              width={600}
              height={800}
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
          )}
        </Link>
        {product.isOnSale && (
          <div className="on-sale-wrap">
            <span className="on-sale-item">-25%</span>
          </div>
        )}
      </div>
      <div className="card-product-info">
        <Link href={`/product/${product.slug || product.id}`} className="title link">
          {product.title}
        </Link>
        <span className="price current-price">
          {product.oldPrice && (
            <span className="old-price">{formatPrice(product.oldPrice)}</span>
          )}{" "}
          {formatPrice(product.price || 0)}
        </span>
        <p className="description text-secondary text-line-clamp-2">
          The garments labelled as Committed are products that have been
          produced using sustainable fibres or processes, reducing their
          environmental impact.
        </p>
        <div className="variant-wrap-list">
          {product.colors && (
            <ul className="list-color-product">
              {product.colors.map((color, index) => (
                <li
                  key={index}
                  className={`list-color-item color-swatch ${
                    currentImage == color.imgSrc ? "active" : ""
                  } `}
                  onMouseOver={() => setCurrentImage(color.imgSrc)}
                >
                  <span className={`swatch-value ${color.bgColor}`} />
                  <Image
                    className="lazyload"
                    src={color.imgSrc}
                    alt="color variant"
                    width={600}
                    height={800}
                  />
                </li>
              ))}
            </ul>
          )}
          {product.sizes && (
            <div className="size-box list-product-btn">
              <span className="size-item box-icon">S</span>
              <span className="size-item box-icon">M</span>
              <span className="size-item box-icon">L</span>
              <span className="size-item box-icon">XL</span>
              <span className="size-item box-icon disable">XXL</span>
            </div>
          )}
          <div className="list-product-btn">
            <a
              onClick={() => addProductToCart(product.id, 1, true, product)}
              className="btn-main-product"
            >
              {isAddedToCartProducts(product.id)
                ? "Already Added"
                : "Add To cart"}
            </a>
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
            {/* Compare feature commented out */}
            {/* <a
              href="#compare"
              data-bs-toggle="offcanvas"
              aria-controls="compare"
              onClick={() => addToCompareItem(product.id)}
              className="box-icon compare btn-icon-action"
            >
              <span className="icon icon-gitDiff" />
              <span className="tooltip">
                {" "}
                {isAddedtoCompareItem(product.id)
                  ? "Already compared"
                  : "Compare"}
              </span>
            </a> */}
            <a
              href="#quickView2"
              onClick={() => setQuickViewItem2 && setQuickViewItem2(product)}
              data-bs-toggle="modal"
              className="box-icon quickview tf-btn-loading"
            >
              <span className="icon icon-eye" />
              <span className="tooltip">Quick View</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
