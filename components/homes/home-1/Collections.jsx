"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { useHomepageCategories } from "@/features/category/hooks/useCategories";
import { formatCategoriesForDisplay } from "@/features/category/utils/formatCategory";

export default function Collections() {
  const { categories, loading, error } = useHomepageCategories(10);
  const formattedCategories = formatCategoriesForDisplay(categories);

  // Show loading state
  if (loading) {
    return (
      <section className="flat-spacing-2 pb_0">
        <div className="container">
          <div className="heading-section-2 wow fadeInUp">
            <h3>Categories you might like</h3>
            <Link href={`/shop-collection`} className="btn-line">
              View All Collection
            </Link>
          </div>
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state or empty state
  if (error || !formattedCategories || formattedCategories.length === 0) {
    return (
      <section className="flat-spacing-2 pb_0">
        <div className="container">
          <div className="heading-section-2 wow fadeInUp">
            <h3>Categories you might like</h3>
            <Link href={`/shop-collection`} className="btn-line">
              View All Collection
            </Link>
          </div>
          {error && (
            <div className="text-center py-5 text-danger">
              <p>Failed to load categories. Please try again later.</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="flat-spacing-2 pb_0">
      <div className="container">
        <div className="heading-section-2 wow fadeInUp">
          <h3>Categories you might like</h3>
          <Link href={`/shop-collection`} className="btn-line">
            View All Collection
          </Link>
        </div>
        <div
          className="flat-collection-circle wow fadeInUp"
          data-wow-delay="0.1s"
        >
          <Swiper
            dir="ltr"
            slidesPerView={5}
            spaceBetween={20}
            breakpoints={{
              1200: { slidesPerView: 5, spaceBetween: 20 },
              1000: { slidesPerView: 4, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              480: { slidesPerView: 2, spaceBetween: 15 },
              0: { slidesPerView: 2, spaceBetween: 15 },
            }}
            modules={[Pagination, Navigation]}
            pagination={{
              clickable: true,
              el: ".spd54",
            }}
            navigation={{
              prevEl: ".snbp12",
              nextEl: ".snbn12",
            }}
          >
            {formattedCategories.map((collection, index) => (
              <SwiperSlide key={collection.id || index}>
                <div className="collection-circle hover-img">
                  <Link 
                    href={collection.slug ? `/shop-collection?category=${collection.slug}` : `/shop-collection`} 
                    className="img-style"
                    style={{ aspectRatio: '1/1' }}
                  >
                    <Image
                      className="lazyload"
                      data-src={collection.imgSrc}
                      alt={collection.alt}
                      src={collection.imgSrc}
                      width={363}
                      height={363}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        // Fallback to default image if image fails to load
                        e.target.src = '/images/collections/collection-circle/cls-circle1.jpg';
                      }}
                    />
                  </Link>
                  <div className="collection-content text-center">
                    <div>
                      <Link 
                        href={collection.slug ? `/shop-collection?category=${collection.slug}` : `/shop-collection`} 
                        className="cls-title"
                      >
                        <h6 className="text">{collection.title}</h6>
                        <i className="icon icon-arrowUpRight" />
                      </Link>
                    </div>
                    <div className="count text-secondary">
                      {collection.count}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="d-flex d-lg-none sw-pagination-collection sw-dots type-circle justify-content-center spd54" />
          <div className="nav-prev-collection d-none d-lg-flex nav-sw style-line nav-sw-left snbp12">
            <i className="icon icon-arrLeft" />
          </div>
          <div className="nav-next-collection d-none d-lg-flex nav-sw style-line nav-sw-right snbn12">
            <i className="icon icon-arrRight" />
          </div>
        </div>
      </div>
    </section>
  );
}
