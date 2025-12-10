"use client";

import { useContextElement } from "@/context/Context";
import { useEffect, useState } from "react";
import ProductCard1 from "../productCards/ProductCard1";
import Pagination from "../common/Pagination";
import Link from "next/link";
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
        setLoading(false);
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
    <section className="flat-spacing">
      <div className="container">
        {loading ? (
          <div className="text-center py-5">
            <p>Loading wishlist items...</p>
          </div>
        ) : items.length ? (
          <div className="tf-grid-layout tf-col-2 md-col-3 xl-col-4">
            {/* card product 1 */}
            {items.map((product, i) => (
              <ProductCard1 key={product.id || i} product={product} />
            ))}

            {/* pagination */}
            {items.length > 12 && (
              <ul className="wg-pagination justify-content-center">
                <Pagination />
              </ul>
            )}
          </div>
        ) : (
          <div className="p-5 text-center">
            <h4 className="mb-3">Your wishlist is empty</h4>
            <p className="mb-4">
              Start adding your favorite products to save them for later!
            </p>
            <Link className="btn-line" href="/shop">
              Explore Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
