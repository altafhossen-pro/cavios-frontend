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
                {/* Dynamic Columns (First 3 columns) */}
                {footerData.dynamicColumns && footerData.dynamicColumns.length > 0 && (
                  footerData.dynamicColumns.slice(0, 3).map((column, colIndex) => (
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

                {/* Support Column */}
                {footerData.supportColumn && footerData.supportColumn.isActive && (
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="footer-col-block">
                      <div className="footer-heading text-button footer-heading-mobile" style={{ color: '#ffffff' }}>
                        {footerData.supportColumn.heading}
                      </div>
                      <div className="tf-collapse-content">
                        <ul className="footer-menu-list">
                          {footerData.supportColumn.items && footerData.supportColumn.items.map((item, itemIndex) => (
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
                )}

                {/* Company Info Column */}
                {footerData.companyInfoColumn && footerData.companyInfoColumn.isActive && (
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="footer-col-block">
                      <div className="footer-heading text-button footer-heading-mobile" style={{ color: '#ffffff' }}>
                        {footerData.companyInfoColumn.heading}
                      </div>
                      <div className="tf-collapse-content">
                        <ul className="footer-menu-list">
                          {footerData.companyInfoColumn.items && footerData.companyInfoColumn.items.map((item, itemIndex) => (
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
                )}

                {/* Follow Us Column */}
                {footerData.followUsColumn && footerData.followUsColumn.isActive && (
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="footer-col-block">
                      <div className="footer-heading text-button footer-heading-mobile" style={{ color: '#ffffff' }}>
                        {footerData.followUsColumn.heading}
                      </div>
                      <div className="tf-collapse-content">
                        <ul className={`tf-social-icon ${dark ? "style-white" : ""}`} style={{ color: '#ffffff' }}>
                          {footerData.followUsColumn.socialLinks && footerData.followUsColumn.socialLinks.map((link, linkIndex) => (
                            <li key={linkIndex}>
                              <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#ffffff', borderColor: '#ffffff' }}
                              >
                                <i className={`icon ${link.iconClass}`} style={{ color: '#ffffff' }} />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="footer-bottom-wrap">
                    <div className="left">
                      <p className="text-caption-1" style={{ color: '#ffffff' }}>
                        ©{new Date().getFullYear()} Cavios. All Rights Reserved.
                      </p>
                    </div>
                    <div className="tf-payment">
                      <p className="text-caption-1" style={{ color: '#ffffff' }}>Payment:</p>
                      <ul>
                        <li>
                          <Image
                            alt="Payment Method"
                            src="/images/payment/img-1.png"
                            width={100}
                            height={64}
                          />
                        </li>
                        <li>
                          <Image
                            alt="Payment Method"
                            src="/images/payment/img-2.png"
                            width={100}
                            height={64}
                          />
                        </li>
                        <li>
                          <Image
                            alt="Payment Method"
                            src="/images/payment/img-3.png"
                            width={100}
                            height={64}
                          />
                        </li>
                        <li>
                          <Image
                            alt="Payment Method"
                            src="/images/payment/img-4.png"
                            width={98}
                            height={64}
                          />
                        </li>
                        <li>
                          <Image
                            alt="Payment Method"
                            src="/images/payment/img-5.png"
                            width={102}
                            height={64}
                          />
                        </li>
                        <li>
                          <Image
                            alt="Payment Method"
                            src="/images/payment/img-6.png"
                            width={98}
                            height={64}
                          />
                        </li>
                      </ul>
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
