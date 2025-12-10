"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { useHomepageCategories } from "@/features/category/hooks/useCategories";
import { formatCategoriesForDisplay } from "@/features/category/utils/formatCategory";

// Global CSS to ensure all collection circles maintain 1:1 aspect ratio
if (typeof document !== 'undefined') {
  const styleId = 'collection-circle-aspect-ratio-fix';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .flat-collection-circle .collection-circle .img-style {
        aspect-ratio: 1/1 !important;
        height: auto !important;
      }
      .flat-collection-circle .collection-circle .img-style img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `;
    document.head.appendChild(style);
  }
}

export default function Collections() {
  const { categories, loading, error } = useHomepageCategories(10);
  const formattedCategories = formatCategoriesForDisplay(categories);

  // Show loading state with custom skeleton (no Swiper)
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
          {/* Custom skeleton grid - no Swiper */}
          <div
            className="flat-collection-circle skeleton-loading wow fadeInUp"
            data-wow-delay="0.1s"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '20px',
              width: '100%',
            }}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="collection-circle hover-img">
                {/* Image skeleton */}
                <div
                  className="img-style"
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '100%',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '50%',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite',
                    }}
                  />
                </div>
                {/* Content skeleton */}
                <div className="collection-content text-center">
                  <div>
                    {/* Title skeleton */}
                    <div
                      style={{
                        width: '70%',
                        height: '18px',
                        margin: '0 auto 8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                      }}
                    />
                  </div>
                  {/* Count skeleton */}
                  <div className="count text-secondary">
                    <div
                      style={{
                        width: '40px',
                        height: '16px',
                        margin: '0 auto',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <style jsx global>{`
            @keyframes shimmer {
              0% {
                background-position: -200% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
            .flat-collection-circle.skeleton-loading {
              display: grid !important;
              grid-template-columns: repeat(5, 1fr) !important;
              gap: 20px !important;
              width: 100% !important;
              max-width: 100% !important;
            }
            .flat-collection-circle.skeleton-loading .collection-circle {
              min-width: 0 !important;
              width: 100% !important;
            }
            .flat-collection-circle.skeleton-loading .collection-circle .img-style {
              width: 100% !important;
              height: 0 !important;
              padding-bottom: 100% !important;
              aspect-ratio: 1/1 !important;
            }
            /* Fix for real categories too - ensure 1:1 aspect ratio */
            .flat-collection-circle .collection-circle .img-style {
              aspect-ratio: 1/1 !important;
              height: auto !important;
            }
            @media (max-width: 1200px) {
              .flat-collection-circle.skeleton-loading {
                grid-template-columns: repeat(4, 1fr) !important;
              }
            }
            @media (max-width: 1000px) {
              .flat-collection-circle.skeleton-loading {
                grid-template-columns: repeat(4, 1fr) !important;
              }
            }
            @media (max-width: 768px) {
              .flat-collection-circle.skeleton-loading {
                grid-template-columns: repeat(3, 1fr) !important;
              }
            }
            @media (max-width: 480px) {
              .flat-collection-circle.skeleton-loading {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 15px !important;
              }
            }
          `}</style>
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
          <style jsx global>{`
            /* Ensure all collection circles maintain 1:1 aspect ratio */
            .flat-collection-circle .collection-circle .img-style {
              aspect-ratio: 1/1 !important;
              height: auto !important;
            }
            .flat-collection-circle .collection-circle .img-style img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          `}</style>
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
