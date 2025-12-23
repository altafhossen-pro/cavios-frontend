"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getActiveBannerCollections } from "@/features/bannerCollection/api/bannerCollectionApi";

export default function BannerCollection() {
  const [bannerCollections, setBannerCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBannerCollections = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getActiveBannerCollections();
        
        if (response.success && response.data) {
          setBannerCollections(response.data);
        } else {
          setError(response.message || "Failed to load banner collections");
        }
      } catch (err) {
        console.error("Error fetching banner collections:", err);
        setError("Failed to load banner collections. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBannerCollections();
  }, []);

  if (loading) {
    return (
      <section className="flat-spacing pt-0">
        <div className="container">
          <div className="tf-grid-layout md-col-2">
            {[1, 2].map((index) => (
              <div key={index} className="collection-default hover-img">
                <div className="img-style" style={{ 
                  width: '100%', 
                  height: index === 1 ? '709px' : '945px',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !bannerCollections || bannerCollections.length === 0) {
    return null; // Don't show section if no banners
  }

  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="tf-grid-layout md-col-2">
          {bannerCollections.slice(0, 2).map((banner, index) => {
            const isPositionStyle = banner.style === 'position';
            const className = isPositionStyle ? 'collection-position hover-img' : 'collection-default hover-img';
            const titleClassName = isPositionStyle ? 'link text-white wow fadeInUp' : 'link';
            const descClassName = isPositionStyle ? 'desc text-white wow fadeInUp' : 'desc wow fadeInUp';
            const buttonClassName = isPositionStyle ? 'btn-line style-white' : 'btn-line';

            return (
              <div key={banner._id || index} className={className}>
                <a className="img-style">
                  <Image
                    className="lazyload"
                    data-src={banner.image}
                    alt={banner.title || "banner-collection"}
                    src={banner.image}
                    width={945}
                    height={index === 0 && !isPositionStyle ? 709 : 945}
                    onError={(e) => {
                      e.target.src = '/images/collections/banner-collection/banner-cls1.jpg';
                    }}
                  />
                </a>
                <div className="content">
                  <h3 className="title wow fadeInUp">
                    <Link href={banner.buttonLink || '/shop-collection'} className={titleClassName}>
                      {banner.title}
                    </Link>
                  </h3>
                  {banner.description && (
                    <p className={descClassName}>
                      {banner.description}
                    </p>
                  )}
                  <div className="wow fadeInUp">
                    <Link href={banner.buttonLink || '/shop-collection'} className={buttonClassName}>
                      {banner.buttonText || 'Shop Now'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
