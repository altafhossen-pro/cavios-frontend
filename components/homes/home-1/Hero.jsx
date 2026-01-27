"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { slides } from "@/data/heroSlides";
import { getHeroBanners } from "@/features/heroBanner/api/heroBannerApi";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const [heroBanners, setHeroBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroBanners = async () => {
      try {
        setLoading(true);
        const response = await getHeroBanners();
        if (response.success && response.data && response.data.length > 0) {
          // Transform API data to match component structure
          const transformedBanners = response.data.map((banner) => ({
            id: banner._id,
            imgSrc: banner.imgSrc || banner.modelImage || "",
            alt: banner.alt || "hero-slideshow",
            subheading: banner.subheading || "",
            heading: banner.heading || banner.title || "",
            btnText: banner.btnText || banner.button1Text || "Explore Collection",
            buttonLink: banner.buttonLink || banner.button1Link || "/shop",
          }));
          setHeroBanners(transformedBanners);
        } else {
          // Fallback to static data if API fails or no data
          setHeroBanners(slides);
        }
      } catch (error) {
        console.error("Error fetching hero banners:", error);
        // Fallback to static data on error
        setHeroBanners(slides);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroBanners();
  }, []);

  // Use API data if available, otherwise fallback to static data
  const displaySlides = heroBanners.length > 0 ? heroBanners : slides;

  if (loading) {
    return (
      <section className="tf-slideshow slider-default slider-effect-fade">
        <div className="wrap-slider" style={{ position: 'relative', width: '100%', paddingBottom: '41.82%', minHeight: '500px' }}>
          {/* Image skeleton */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#f0f0f0',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
          {/* Content skeleton */}
          <div className="box-content" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', zIndex: 1 }}>
            <div className="content-slider" style={{ width: '100%' }}>
              <div className="box-title-slider" style={{ padding: '0 20px' }}>
                {/* Subheading skeleton */}
                <div
                  style={{
                    width: '200px',
                    maxWidth: '100%',
                    height: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                  }}
                />
                {/* Heading skeleton */}
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '400px',
                      maxWidth: '100%',
                      height: '40px',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '4px',
                      marginBottom: '12px',
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite',
                    }}
                  />
                  <div
                    style={{
                      width: '350px',
                      maxWidth: '100%',
                      height: '40px',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '4px',
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite',
                    }}
                  />
                </div>
                {/* Button skeleton */}
                <div
                  style={{
                    width: '180px',
                    maxWidth: '100%',
                    height: '48px',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '4px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="tf-slideshow slider-default slider-effect-fade">
      <Swiper
        effect="fade"
        spaceBetween={0}
        centeredSlides={false}
        slidesPerView={1}
        loop={displaySlides.length > 1}
        modules={[EffectFade, Autoplay, Pagination]}
        // autoplay={{ delay: 3000 }}
        dir="ltr"
        pagination={{
          clickable: true,
          el: ".spd55",
        }}
        className="swiper tf-sw-slideshow"
      >
        {displaySlides.map((slide, index) => (
          <SwiperSlide key={slide.id || index}>
            <div className="wrap-slider">
              <Image
                alt={slide.alt}
                src={slide.imgSrc}
                width={1920}
                height={803}
                priority={index === 0}
              />
              <div className="box-content">
                <div className="content-slider">
                  <div className="box-title-slider">
                    {slide.subheading && (
                      <p className="fade-item fade-item-1 subheading text-btn-uppercase text-white">
                        {slide.subheading}
                      </p>
                    )}
                    <div className="fade-item fade-item-2 heading text-white title-display">
                      {slide.heading.split("\n").map((line, idx) => (
                        <span key={idx}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="fade-item fade-item-3 box-btn-slider">
                    <Link
                      href={slide.buttonLink || "/shop"}
                      className="tf-btn btn-fill btn-white"
                    >
                      <span className="text">{slide.btnText}</span>
                      <i className="icon icon-arrowUpRight" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="wrap-pagination">
        <div className="container">
          <div className="sw-dots sw-pagination-slider type-circle white-circle justify-content-center spd55" />
        </div>
      </div>
    </section>
  );
}
