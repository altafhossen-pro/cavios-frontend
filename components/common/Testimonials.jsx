"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import { getActiveTestimonials } from "@/features/testimonial/api/testimonialApi";
import { useContextElement } from "@/context/Context";

export default function Testimonials({ parentClass = "flat-spacing" }) {
  const { setQuickViewItem } = useContextElement();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getActiveTestimonials();
        
        if (response.success && response.data) {
          setTestimonials(response.data);
        } else {
          setError(response.message || "Failed to load testimonials");
          setTestimonials([]);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Failed to load testimonials. Please try again later.");
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Default image if profilePic is not available
  const defaultImage = "/images/logo/logo.svg";

  return (
    <section className={parentClass}>
      <div className="container">
        <div className="heading-section text-center">
          <h3 className="heading wow fadeInUp">Customer Say!</h3>
          <p className="subheading wow fadeInUp">
            Our customers adore our products, and we constantly aim to delight
            them.
          </p>
        </div>
        <div className="swiper tf-sw-testimonial">
          {loading ? (
            <div className="text-center py-5">
              <p>Loading testimonials...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5 text-danger">
              <p>{error}</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-5">
              <p>No testimonials available.</p>
            </div>
          ) : (
            <Swiper
              breakpoints={{
                // Small devices (mobile)
                0: {
                  slidesPerView: 1,
                  spaceBetween: 15,
                  pagination: { clickable: true },
                },
                // Medium devices (tablet)
                768: {
                  spaceBetween: 30,
                  slidesPerView: 1.3,
                  pagination: { clickable: true },
                },
                // Large devices (desktop)
                1024: {
                  spaceBetween: 30,
                  slidesPerView: 2,
                  pagination: { clickable: true },
                },
              }}
              modules={[Pagination]}
              pagination={{
                clickable: true,
                el: ".spd7",
              }}
              dir="ltr"
            >
              {testimonials.map((testimonial, index) => {
                // Use profilePic as main image, fallback to default
                const mainImage = testimonial.profilePic || defaultImage;
                
                return (
                  <SwiperSlide key={testimonial._id || index}>
                    <div className="testimonial-item hover-img">
                      <div className="img-style">
                        <Image
                          src={mainImage}
                          alt={testimonial.name || "Testimonial"}
                          width={468}
                          height={624}
                          onError={(e) => {
                            e.target.src = defaultImage;
                          }}
                        />
                        {testimonial.product && (
                          <a
                            href="#quickView"
                            onClick={() => setQuickViewItem(testimonial.product)}
                            data-bs-toggle="modal"
                            className="box-icon hover-tooltip center"
                          >
                            <span className="icon icon-eye" />
                            <span className="tooltip">Quick View</span>
                          </a>
                        )}
                      </div>
                      <div className="content">
                        <div className="content-top">
                          <div className="list-star-default">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`icon icon-star ${
                                  i < (testimonial.rating || 5)
                                    ? "active"
                                    : ""
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-secondary">
                            {testimonial.reviewText || testimonial.quote}
                          </p>
                          <div className="box-author">
                            <div className="text-title author">
                              {testimonial.name}
                              {testimonial.designation && (
                                <span className="text-secondary" style={{ fontSize: '14px', display: 'block', marginTop: '4px' }}>
                                  {testimonial.designation}
                                </span>
                              )}
                            </div>
                            <svg
                              className="icon"
                              width={20}
                              height={21}
                              viewBox="0 0 20 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0)">
                                <path
                                  d="M6.875 11.6255L8.75 13.5005L13.125 9.12549"
                                  stroke="#3DAB25"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M10 18.5005C14.1421 18.5005 17.5 15.1426 17.5 11.0005C17.5 6.85835 14.1421 3.50049 10 3.50049C5.85786 3.50049 2.5 6.85835 2.5 11.0005C2.5 15.1426 5.85786 18.5005 10 18.5005Z"
                                  stroke="#3DAB25"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0">
                                  <rect
                                    width={20}
                                    height={20}
                                    fill="white"
                                    transform="translate(0 0.684082)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                        </div>
                        <div className="box-avt">
                          <div className="avatar avt-60 round">
                            <Image
                              alt={testimonial.name || "avatar"}
                              src={testimonial.profilePic || defaultImage}
                              width={90}
                              height={91}
                              onError={(e) => {
                                e.target.src = defaultImage;
                              }}
                            />
                          </div>
                          {testimonial.product ? (
                            <div className="box-price">
                              <p className="text-title text-line-clamp-1">
                                {testimonial.product.title || testimonial.product.name}
                              </p>
                              <div className="text-button price">
                                ${testimonial.product.price?.toFixed(2) || "0.00"}
                              </div>
                            </div>
                          ) : (
                            <div className="box-price">
                              <p className="text-title text-line-clamp-1">
                                Verified Customer
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
              <div className="sw-pagination-testimonial sw-dots type-circle d-flex justify-content-center spd7" />
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
}
