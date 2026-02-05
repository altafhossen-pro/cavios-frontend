"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getFooterConfig } from "@/features/footer/api/footerApi";
import ToolbarBottom from "../headers/ToolbarBottom";
import ScrollTop from "../common/ScrollTop";

export default function FooterNew({
  border = true,
  dark = false,
  hasPaddingBottom = false,
}) {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterConfig = async () => {
      try {
        setLoading(true);
        const response = await getFooterConfig();
        if (response.success) {
          setFooterData(response.data);
        }
      } catch (error) {
        console.error('Error fetching footer config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterConfig();
  }, []);

  useEffect(() => {
    // Only add mobile toggle on mobile devices
    const isMobile = window.innerWidth <= 767;
    
    if (!isMobile) {
      // On desktop, ensure content is always visible
      const contents = document.querySelectorAll(".tf-collapse-content");
      contents.forEach((content) => {
        content.style.display = "block";
        content.style.height = "auto";
      });
      return;
    }

    const headings = document.querySelectorAll(".footer-heading-mobile");

    const toggleOpen = (event) => {
      const parent = event.target.closest(".footer-col-block");
      if (!parent) return;
      
      const content = parent.querySelector(".tf-collapse-content");
      if (!content) return;

      if (parent.classList.contains("open")) {
        parent.classList.remove("open");
        content.style.height = "0px";
        content.style.display = "none";
      } else {
        // Close other open items
        document.querySelectorAll(".footer-col-block.open").forEach((openItem) => {
          if (openItem !== parent) {
            openItem.classList.remove("open");
            const openContent = openItem.querySelector(".tf-collapse-content");
            if (openContent) {
              openContent.style.height = "0px";
              openContent.style.display = "none";
            }
          }
        });
        
        parent.classList.add("open");
        content.style.display = "block";
        content.style.height = content.scrollHeight + 10 + "px";
      }
    };

    headings.forEach((heading) => {
      heading.addEventListener("click", toggleOpen);
    });

    // Handle window resize
    const handleResize = () => {
      const isMobileNow = window.innerWidth <= 767;
      const contents = document.querySelectorAll(".tf-collapse-content");
      
      if (!isMobileNow) {
        // Desktop: show all content
        contents.forEach((content) => {
          content.style.display = "block";
          content.style.height = "auto";
        });
        document.querySelectorAll(".footer-col-block").forEach((block) => {
          block.classList.remove("open");
        });
      } else {
        // Mobile: hide all content initially
        contents.forEach((content) => {
          if (!content.closest(".footer-col-block")?.classList.contains("open")) {
            content.style.display = "none";
            content.style.height = "0px";
          }
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("click", toggleOpen);
      });
      window.removeEventListener("resize", handleResize);
    };
  }, [footerData]);


  if (loading) {
    return null; // Or a loading spinner
  }

  if (!footerData) {
    return null;
  }

  return (
    <>
      <footer
        id="footer"
        className={`footer ${dark ? "bg-main" : ""} ${hasPaddingBottom ? "has-pb" : ""}`}
      >
        <div className={`footer-wrap ${!border ? "border-0" : ""}`}>
          <div className="footer-body pt-4">
            <div className="container">
              <div className="row">
                {/* Dynamic Columns (Up to 6 columns) */}
                {footerData.dynamicColumns && footerData.dynamicColumns.length > 0 && (
                  footerData.dynamicColumns.map((column, colIndex) => (
                    <div key={colIndex} className="col-lg-2 col-md-4 col-sm-6">
                      <div className="footer-col-block">
                        <div className="footer-heading text-button footer-heading-mobile" style={{ color: '#ffffff' }}>
                          {column.heading}
                        </div>
                        <div className="tf-collapse-content">
                          <ul className="footer-menu-list">
                            {column.items && column.items.map((item, itemIndex) => (
                              <li className="text-caption-1" key={itemIndex}>
                                {item.target === '_blank' ? (
                                  <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-menu_item"
                                    style={{ color: '#ffffff' }}
                                  >
                                    {item.label}
                                  </a>
                                ) : (
                                  <Link href={item.href} className="footer-menu_item" style={{ color: '#ffffff' }}>
                                    {item.label}
                                  </Link>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="footer-bottom" style={{ padding: '20px 0' }}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="footer-bottom-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div className="left" style={{ flex: '1', minWidth: '200px' }}>
                      {footerData.bottomSection?.privacyPolicy?.href ? (
                        <Link href={footerData.bottomSection.privacyPolicy.href} style={{ color: '#ffffff', textDecoration: 'none' }}>
                          {footerData.bottomSection.privacyPolicy.label || 'Privacy Policy'}
                        </Link>
                      ) : (
                        <span style={{ color: '#ffffff' }}>
                          {footerData.bottomSection?.privacyPolicy?.label || 'Privacy Policy'}
                        </span>
                      )}
                    </div>
                    <div className="center" style={{ flex: '1', textAlign: 'center', minWidth: '200px' }}>
                      {footerData.bottomSection?.termsAndConditions?.href ? (
                        <Link href={footerData.bottomSection.termsAndConditions.href} style={{ color: '#ffffff', textDecoration: 'none' }}>
                          {footerData.bottomSection.termsAndConditions.label || 'Terms & Conditions'}
                        </Link>
                      ) : (
                        <span style={{ color: '#ffffff' }}>
                          {footerData.bottomSection?.termsAndConditions?.label || 'Terms & Conditions'}
                        </span>
                      )}
                    </div>
                    <div className="right" style={{ flex: '1', textAlign: 'right', minWidth: '200px' }}>
                      <p className="text-caption-1" style={{ color: '#ffffff', margin: 0 }}>
                        {(footerData.bottomSection?.copyright || `© Cavios® ${new Date().getFullYear()}. Designed for performance. Built to last.`).replace('{year}', new Date().getFullYear().toString())}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ScrollTop hasPaddingBottom={hasPaddingBottom} />
      <ToolbarBottom />
    </>
  );
}
