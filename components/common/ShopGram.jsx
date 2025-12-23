"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Pagination } from "swiper/modules";
import { getProducts } from "@/features/product/api/productApi";
import { formatProductsForDisplay } from "@/features/product/utils/formatProduct";
import { products2 } from "@/data/products"; // Fallback static data

export default function ShopGram({ parentClass = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      setLoading(true);
      try {
        // Fetch more products to randomize
        const response = await getProducts({
          limit: 20, // Fetch more to randomize
          page: 1,
          isActive: true,
        });

        if (response.success && response.data && response.data.length > 0) {
          // Format products
          const formattedProducts = formatProductsForDisplay(response.data);
          
          // Randomize and take first 5
          const shuffled = [...formattedProducts].sort(() => Math.random() - 0.5);
          const randomProducts = shuffled.slice(0, 5);
          
          setProducts(randomProducts);
        } else {
          // Fallback to static data
          setProducts(products2.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching random products:', error);
        // Fallback to static data on error
        setProducts(products2.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  // Show loading skeleton or static data while loading
  const displayProducts = loading ? products2.slice(0, 5) : products;

  return (
    <section className={parentClass}>
      <div className="container">
        <div className="heading-section text-center">
          <h3 className="heading wow fadeInUp">Shop Instagram</h3>
          <p className="subheading text-secondary wow fadeInUp">
            Elevate your wardrobe with fresh finds today!
          </p>
        </div>
        <Swiper
          dir="ltr"
          className="swiper tf-sw-shop-gallery"
          spaceBetween={10}
          breakpoints={{
            1200: { slidesPerView: 5 },
            768: { slidesPerView: 3 },
            0: { slidesPerView: 2 },
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spb222",
          }}
        >
          {displayProducts.map((item, i) => {
            // Handle both API format and static format
            const productId = item.id || item._id;
            const productSlug = item.slug || productId;
            const imageSrc = item.imgSrc || item.featuredImage || item.thumbnail;
            const delay = item.delay || `${(i * 0.1).toFixed(1)}s`;
            const altText = item.title || item.name || "image-gallery";

            return (
              <SwiperSlide key={productId || i}>
                <div
                  className="gallery-item hover-overlay hover-img wow fadeInUp"
                  data-wow-delay={delay}
                >
                  <div className="img-style" style={{ position: 'relative', width: '100%', paddingBottom: '100%', overflow: 'hidden' }}>
                    <Image
                      className="lazyload img-hover"
                      data-src={imageSrc}
                      alt={altText}
                      src={imageSrc}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <Link
                    href={`/product/${productSlug}`}
                    className="box-icon hover-tooltip"
                  >
                    <span className="icon icon-eye" />
                    <span className="tooltip">View Product</span>
                  </Link>
                </div>
              </SwiperSlide>
            );
          })}
          <div className="sw-pagination-gallery sw-dots type-circle justify-content-center spb222"></div>
        </Swiper>
      </div>
    </section>
  );
}
