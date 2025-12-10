"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { products as staticProducts } from "@/data/products";
import ProductCard1 from "../productCards/ProductCard1";
export default function RelatedProducts({ products = null }) {
  // Use provided products or fallback to static products
  const displayProducts = products && products.length > 0 ? products : staticProducts;
  
  return (
    <section className="flat-spacing">
      <div className="container flat-animate-tab">
        <ul
          className="tab-product justify-content-sm-center wow fadeInUp"
          data-wow-delay="0s"
          role="tablist"
        >
          <li className="nav-tab-item" role="presentation">
            <a href="#ralatedProducts" className="active" data-bs-toggle="tab">
              Related Products
            </a>
          </li>
          <li className="nav-tab-item" role="presentation">
            <a href="#recentlyViewed" data-bs-toggle="tab">
              Recently Viewed
            </a>
          </li>
        </ul>
        <div className="tab-content">
          <div
            className="tab-pane active show"
            id="ralatedProducts"
            role="tabpanel"
          >
            {displayProducts.length > 0 ? (
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
                  el: ".spd4",
                }}
              >
                {displayProducts.slice(0, 4).map((product, i) => (
                  <SwiperSlide key={product.id || i} className="swiper-slide">
                    <ProductCard1 product={product} />
                  </SwiperSlide>
                ))}

                <div className="sw-pagination-latest spd4  sw-dots type-circle justify-content-center" />
              </Swiper>
            ) : (
              <div className="text-center py-5">
                <p className="text-caption-1">No related products found</p>
              </div>
            )}
          </div>
          <div className="tab-pane" id="recentlyViewed" role="tabpanel">
            {displayProducts.length > 4 ? (
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
                  el: ".spd5",
                }}
              >
                {displayProducts.slice(4, 8).map((product, i) => (
                  <SwiperSlide key={product.id || i} className="swiper-slide">
                    <ProductCard1 product={product} />
                  </SwiperSlide>
                ))}

                <div className="sw-pagination-latest spd5  sw-dots type-circle justify-content-center" />
              </Swiper>
            ) : (
              <div className="text-center py-5">
                <p className="text-caption-1">No recently viewed products</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
