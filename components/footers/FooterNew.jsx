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
    // Always show footer content on all devices (mobile and desktop)
    const showAllContent = () => {
      const contents = document.querySelectorAll(".tf-collapse-content");
      contents.forEach((content) => {
        content.style.display = "block";
        content.style.height = "auto";
      });
      // Remove any open classes as they're not needed anymore
      document.querySelectorAll(".footer-col-block").forEach((block) => {
        block.classList.remove("open");
      });
    };

    // Show content initially
    showAllContent();

    // Handle window resize - always show content
    const handleResize = () => {
      showAllContent();
    };

    window.addEventListener("resize", handleResize);

    return () => {
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
          <div className="footer-body pt-4 pb-4">
            <div className="container">
              <div className="row">
                {/* Dynamic Columns (Up to 6 columns) */}
                {footerData.dynamicColumns && footerData.dynamicColumns.length > 0 && (
                  footerData.dynamicColumns.map((column, colIndex) => (
                    <div key={colIndex} className="col-lg-2 col-md-4 col-sm-6 col-6">
                      <div className="footer-col-block">
                        <div className="footer-heading text-button footer-heading-mobile" style={{ color: '#ffffff' }}>
                          {column.heading}
                        </div>
                        <div className="tf-collapse-content">
                          <ul className={`footer-menu-list ${column.items.some(i => i.socialEnabled) ? 'd-flex flex-row flex-wrap gap-3' : ''}`}>
                            {column.items && column.items.map((item, itemIndex) => {
                              const iconMap = {
                                facebook: "icon-fb",
                                youtube: "icon-youtube",
                                instagram: "icon-instagram",
                                twitter: "icon-x",
                                linkedin: "icon-in",
                                whatsapp: "icon-whatsapp",
                                tiktok: "icon-tiktok",
                                pinterest: "icon-pinterest",
                                amazon: "icon-amazon"
                              };
                              const iconClass = item.socialEnabled ? (iconMap[item.socialType] || "icon-share") : null;

                              return (
                                <li className={`text-caption-1 ${item.socialEnabled ? 'mb-0' : ''}`} key={itemIndex}>
                                  {item.target === '_blank' ? (
                                    <a
                                      href={item.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="footer-menu_item d-flex align-items-center gap-2"
                                      style={{ color: '#ffffff' }}
                                    >
                                      {item.socialEnabled ? (
                                        <i className={`${iconClass}`} style={{ fontSize: '18px' }}></i>
                                      ) : (
                                        item.label
                                      )}
                                    </a>
                                  ) : (
                                    <Link href={item.href} className="footer-menu_item d-flex align-items-center gap-2" style={{ color: '#ffffff' }}>
                                      {item.socialEnabled ? (
                                        <i className={`${iconClass}`} style={{ fontSize: '18px' }}></i>
                                      ) : (
                                        item.label
                                      )}
                                    </Link>
                                  )}
                                </li>
                              );
                            })}
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
                  <div className="footer-bottom-wrap" style={{ textAlign: 'center' }}>
                    <p className="text-caption-1 " style={{ color: '#ffffff', margin: 0, width: '100%' }}>
                      {(footerData.bottomSection?.copyright || `© Cavios® ${new Date().getFullYear()}. Designed for performance.`).replace('{year}', new Date().getFullYear().toString())}
                    </p>
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
