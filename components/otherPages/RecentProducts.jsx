"use client";

import { useState, useEffect } from "react";
import { products } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard1 from "../productCards/ProductCard1";
import { Pagination } from "swiper/modules";
import { getSimilarProducts } from "@/features/product/api/productApi";
import { formatProductsForDisplay } from "@/features/product/utils/formatProduct";
import { useContextElement } from "@/context/Context";

export default function RecentProducts() {
  const { cartProducts } = useContextElement();
  const [displayProducts, setDisplayProducts] = useState(products.slice(4));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      // Only fetch if we have cart products
      if (!cartProducts || cartProducts.length === 0) {
        // Fallback to static products if no cart products
        setDisplayProducts(products.slice(4));
        return;
      }

      setIsLoading(true);
      try {
        // Pick a random product from cart
        const randomIndex = Math.floor(Math.random() * cartProducts.length);
        const randomProduct = cartProducts[randomIndex];
        
        // Use productId from cart item
        const productId = randomProduct.productId;
        
        if (productId) {
          // Fetch similar products
          const response = await getSimilarProducts(productId, {
            limit: 8,
            minRequired: 4
          });
          
          if (response.success && response.data && response.data.length > 0) {
            const formattedProducts = formatProductsForDisplay(response.data);
            setDisplayProducts(formattedProducts);
          } else {
            // Fallback to static products if API returns empty
            setDisplayProducts(products.slice(4));
          }
        } else {
          // Fallback to static products if no productId
          setDisplayProducts(products.slice(4));
        }
      } catch (error) {
        console.error('Error fetching similar products:', error);
        // Fallback to static products on error
        setDisplayProducts(products.slice(4));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [cartProducts]);

  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="heading-section text-center wow fadeInUp">
          <h4 className="heading">You may also like</h4>
        </div>
        {isLoading ? (
          <div className="text-center py-5">
            <p className="text-caption-1">Loading products...</p>
          </div>
        ) : (
          <Swiper
            className="swiper tf-sw-latest"
            dir="ltr"
            spaceBetween={15}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 15 },
              768: { slidesPerView: 3, spaceBetween: 30 },
              1200: { slidesPerView: 4, spaceBetween: 30 },
            }}
            modules={[Pagination]}
            pagination={{
              clickable: true,
              el: ".spd79",
            }}
          >
            {displayProducts.map((product, i) => (
              <SwiperSlide key={product.id || i} className="swiper-slide">
                <ProductCard1 product={product} />
              </SwiperSlide>
            ))}

            <div className="sw-pagination-latest sw-dots type-circle justify-content-center spd79" />
          </Swiper>
        )}
      </div>
    </section>
  );
}
