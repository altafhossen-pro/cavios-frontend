"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Grid6({
  activeColor = "",
  setActiveColor = () => {},
  firstItem = null,
  productImages = [],
  productColors = [],
}) {
  const defaultImage = '/images/logo/logo.svg';
  
  // Get images from productImages array (already ordered: featured → variants → gallery)
  let images = [];
  if (productImages && productImages.length > 0) {
    images = productImages.map((img, index) => {
      // Handle both object format {url, altText, colorValue} and string format
      const imgSrc = typeof img === 'string' ? img : (img.url || img.src || defaultImage);
      
      // Use colorValue from image object if available (set in QuickView2)
      let colorValue = `image-${index}`;
      
      if (typeof img === 'object' && img.colorValue) {
        // Use the colorValue from the image object (set by variant)
        colorValue = img.colorValue;
      } else if (productColors && productColors.length > 0) {
        // Fallback: try to match with color based on index
        const colorIndex = Math.min(index - 1, productColors.length - 1); // -1 because first is featured
        if (colorIndex >= 0) {
          const colorData = productColors[colorIndex];
          colorValue = colorData?.value || colorData?.name || colorData?.bgColor || `image-${index}`;
        } else {
          // Featured image - use first color or default
          colorValue = productColors[0]?.value || productColors[0]?.name || productColors[0]?.bgColor || 'default';
        }
      }
      
      // Normalize color value for data-scroll attribute
      const normalizedColorValue = typeof colorValue === 'string' 
        ? colorValue.toLowerCase().replace(/\s+/g, '-')
        : `image-${index}`;
      
      return {
        src: imgSrc,
        dataScroll: normalizedColorValue,
      };
    });
  } else if (firstItem) {
    images = [{ src: firstItem, dataScroll: 'default' }];
  } else {
    images = [{ src: defaultImage, dataScroll: 'default' }];
  }

  const observerRef = useRef(null);

  const scrollToTarget = () => {
    const scrollContainerElemt = document.querySelector(".wrap-quick-view-2");
    if (!scrollContainerElemt || !activeColor) return;
    
    // Normalize activeColor for matching
    const normalizedColor = activeColor.toLowerCase().replace(/\s+/g, '-');
    
    const heightScroll = scrollContainerElemt.scrollTop;
    const targetElement = scrollContainerElemt.querySelector(
      `[data-scroll='${normalizedColor}']`
    );

    if (targetElement) {
      setTimeout(() => {
        // Only scroll if container hasn't been scrolled by user or other code
        // Check if scroll position hasn't changed significantly (within 10px)
        if (Math.abs(scrollContainerElemt.scrollTop - heightScroll) < 10) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 200);
    }
  };

  useEffect(() => {
    // Add a small delay to ensure images are rendered
    const timeoutId = setTimeout(() => {
      scrollToTarget();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [activeColor]);

  // Track if user is manually selecting color (to prevent IntersectionObserver from resetting)
  const isUserSelectingRef = useRef(false);
  const userSelectionTimeoutRef = useRef(null);
  
  useEffect(() => {
    const options = {
      rootMargin: "-50% 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const scrollValue = entry.target.getAttribute("data-scroll");
          
          // Only update if user is not manually selecting
          if (!isUserSelectingRef.current) {
            setActiveColor(scrollValue);
          }
        }
      });
    }, options);

    const elements = document.querySelectorAll(".item-scroll-quickview-2");
    elements.forEach((el) => observer.observe(el));
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (userSelectionTimeoutRef.current) {
        clearTimeout(userSelectionTimeoutRef.current);
      }
    };
  }, [images]);
  
  // Expose function to temporarily disable IntersectionObserver
  // This will be called from QuickView2 when user selects a color
  useEffect(() => {
    // Store the disable function on window for QuickView2 to access
    if (typeof window !== 'undefined') {
      window.__grid6DisableObserver = () => {
        isUserSelectingRef.current = true;
        
        // Clear any existing timeout
        if (userSelectionTimeoutRef.current) {
          clearTimeout(userSelectionTimeoutRef.current);
        }
        
        // Re-enable after scroll completes
        userSelectionTimeoutRef.current = setTimeout(() => {
          isUserSelectingRef.current = false;
        }, 2000); // 2 second delay to allow scroll to complete
      };
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.__grid6DisableObserver;
      }
    };
  }, []);

  return (
    <div className="tf-quick-view-image">
      <div className="wrap-quick-view wrap-quick-view-2 wrapper-scroll-quickview">
        {images.map((link, index) => (
          <a
            className="quickView-item item-scroll-quickview-2"
            data-scroll={link.dataScroll}
            key={index}
          >
            <Image
              className="lazyload"
              alt=""
              src={link.src}
              width={600}
              height={800}
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
          </a>
        ))}
      </div>
    </div>
  );
}

