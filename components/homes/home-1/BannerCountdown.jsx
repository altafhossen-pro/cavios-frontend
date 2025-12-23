"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "@/components/common/Countdown";
import { getActiveBannerCountdown } from "@/features/bannerCountdown/api/bannerCountdownApi";

export default function BannerCountdown() {
  const [bannerCountdown, setBannerCountdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBannerCountdown = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getActiveBannerCountdown();
        
        if (response.success && response.data) {
          setBannerCountdown(response.data);
        } else {
          setError(response.message || "Failed to load banner countdown");
        }
      } catch (err) {
        console.error("Error fetching banner countdown:", err);
        setError("Failed to load banner countdown. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBannerCountdown();
  }, []);

  if (loading) {
    return (
      <section className="bg-surface flat-spacing flat-countdown-banner">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4 col-md-6 col-12">
              <div className="banner-left" style={{ paddingRight: '20px', paddingBottom: '30px', paddingLeft: '15px', paddingTop: '15px' }}>
                <div className="box-title">
                  <div className="wow fadeInUp" style={{ height: '30px', backgroundColor: '#f0f0f0', width: '200px', marginBottom: '10px', borderRadius: '4px' }}></div>
                  <div className="wow fadeInUp" style={{ height: '20px', backgroundColor: '#f0f0f0', width: '300px', marginBottom: '20px', borderRadius: '4px' }}></div>
                </div>
                <div className="btn-banner wow fadeInUp" style={{ marginTop: '20px' }}>
                  <div style={{ height: '40px', backgroundColor: '#f0f0f0', width: '120px', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 d-lg-block d-none">
              <div className="banner-img" style={{ position: 'relative', width: '100%', height: 'auto', padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '500px', height: '500px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <div className="banner-right" style={{ paddingLeft: '30px', paddingTop: '30px', paddingRight: '30px', paddingBottom: '15px' }}>
                <div className="tf-countdown-lg" style={{ fontSize: '0.9em' }}>
                  <div style={{ height: '100px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
            <div className="col-12 d-lg-none" style={{ marginTop: '30px', marginBottom: '30px', padding: '0 15px' }}>
              <div className="banner-img" style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                <div style={{ width: '100%', maxWidth: '500px', height: '400px', backgroundColor: '#f0f0f0', borderRadius: '4px', margin: '0 auto' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !bannerCountdown) {
    return null; // Don't show section if no banner countdown
  }

  // Format endDate for CountdownTimer component
  const endDate = bannerCountdown.endDate ? new Date(bannerCountdown.endDate).toISOString() : null;

  return (
    <section className="bg-surface flat-spacing flat-countdown-banner">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4 col-md-6 col-12">
            <div className="banner-left" style={{ paddingRight: '20px', paddingBottom: '30px', paddingLeft: '15px', paddingTop: '15px' }}>
              <div className="box-title">
                <h3 className="wow fadeInUp">{bannerCountdown.title}</h3>
                {bannerCountdown.description && (
                  <p className="text-secondary wow fadeInUp">
                    {bannerCountdown.description}
                  </p>
                )}
              </div>
              <div className="btn-banner wow fadeInUp" style={{ marginTop: '20px' }}>
                <Link href={bannerCountdown.buttonLink || '/shop-default-grid'} className="tf-btn btn-fill">
                  <span className="text">{bannerCountdown.buttonText || 'Shop Now'}</span>
                  <i className="icon icon-arrowUpRight" />
                </Link>
              </div>
            </div>
          </div>
          {/* Desktop Image - Only show on large screens */}
          <div className="col-lg-4 d-lg-block d-none">
            <div className="banner-img" style={{ position: 'relative', width: '100%', height: 'auto', padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                className="lazyload"
                data-src={bannerCountdown.image}
                alt={bannerCountdown.title || "banner"}
                src={bannerCountdown.image}
                width={607}
                height={655}
                style={{ width: '100%', maxWidth: '500px', height: 'auto', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.src = '/images/banner/img-countdown1.png';
                }}
              />
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-12">
            <div className="banner-right" style={{ paddingLeft: '10px', paddingTop: '30px', paddingRight: '10px', paddingBottom: '15px' }}>
              <div className="tf-countdown-lg" style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}>
                <div
                  className="js-countdown"
                  data-timer={1007500}
                  data-labels="Days,Hours,Mins,Secs"
                >
                  {endDate && <CountdownTimer style={2} targetDate={endDate} />}
                </div>
              </div>
            </div>
          </div>
          {/* Mobile/Tablet Image - Show on mobile and tablet, hidden on desktop */}
          <div className="col-12 d-lg-none" style={{ marginTop: '30px', marginBottom: '30px', padding: '0 15px' }}>
            <div className="banner-img" style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
              <Image
                className="lazyload"
                data-src={bannerCountdown.image}
                alt={bannerCountdown.title || "banner"}
                src={bannerCountdown.image}
                width={607}
                height={655}
                style={{ width: '100%', maxWidth: '500px', height: 'auto', objectFit: 'contain', margin: '0 auto' }}
                onError={(e) => {
                  e.target.src = '/images/banner/img-countdown1.png';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
