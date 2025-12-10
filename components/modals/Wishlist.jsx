"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useContextElement } from "@/context/Context";
import { formatPrice } from "@/config/currency";
import { getProductById } from "@/features/product/api/productApi";
import { formatProductForDisplay } from "@/features/product/utils/formatProduct";

export default function Wishlist() {
  const { removeFromWishlist, wishList } = useContextElement();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!wishList || wishList.length === 0) {
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        // Fetch all products by IDs
        const productPromises = wishList.map(async (productId) => {
          try {
            const response = await getProductById(productId);
            if (response.success && response.data) {
              return formatProductForDisplay(response.data);
            }
            return null;
          } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
            return null;
          }
        });

        const products = await Promise.all(productPromises);
        // Filter out null values (failed fetches)
        const validProducts = products.filter(product => product !== null);
        setItems(validProducts);
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishList]);
  return (
    <div className="modal fullRight fade modal-wishlist" id="wishlist">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="header">
            <h5 className="title">Wish List</h5>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="wrap">
            <div className="tf-mini-cart-wrap">
              <div className="tf-mini-cart-main">
                <div className="tf-mini-cart-sroll">
                  {loading ? (
                    <div className="p-4 text-center">
                      <p>Loading wishlist items...</p>
                    </div>
                  ) : items.length ? (
                    <div className="tf-mini-cart-items">
                      {items.map((elm, i) => (
                        <div key={elm.id || i} className="tf-mini-cart-item file-delete">
                          <div className="tf-mini-cart-image">
                            <Image
                              className="lazyload"
                              alt={elm.title || "Product"}
                              src={elm.imgSrc || elm.featuredImage || "/images/logo/logo.svg"}
                              width={600}
                              height={800}
                              onError={(e) => {
                                e.target.src = "/images/logo/logo.svg";
                              }}
                            />
                          </div>
                          <div className="tf-mini-cart-info flex-grow-1">
                            <div className="mb_12 d-flex align-items-center justify-content-between flex-wrap gap-12">
                              <div className="text-title">
                                <Link
                                  href={`/product/${elm.slug || elm.id}`}
                                  className="link text-line-clamp-1"
                                >
                                  {elm.title}
                                </Link>
                              </div>
                              <div
                                className="text-button tf-btn-remove remove"
                                onClick={() => removeFromWishlist(elm.id)}
                              >
                                Remove
                              </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-12">
                              <div className="text-secondary-2">
                                {elm.variants && elm.variants.length > 0 ? 'Multiple variants' : 'Standard'}
                              </div>
                              <div className="text-button">
                                {elm.priceRange 
                                  ? `${formatPrice(elm.priceRange.min)} - ${formatPrice(elm.priceRange.max)}`
                                  : formatPrice(elm.price || 0)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4">
                      Your wishlist is empty. Start adding your favorite
                      products to save them for later!{" "}
                      <Link className="btn-line" href="/shop">
                        Explore Products
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="tf-mini-cart-bottom">
                <Link
                  href={`/wish-list`}
                  className="btn-style-2 w-100 radius-4 view-all-wishlist"
                >
                  <span className="text-btn-uppercase">View All Wish List</span>
                </Link>
                <Link
                  href={`/shop`}
                  className="text-btn-uppercase"
                >
                  Or continue shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
