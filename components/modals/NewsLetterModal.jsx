"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getNewsletterSettings, subscribeToNewsletter } from "@/features/newsletter/api/newsletterApi";

export default function NewsLetterModal() {
  const pathname = usePathname();
  const modalElement = useRef();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getNewsletterSettings();
        if (response.success) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Error fetching newsletter settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const showModal = async () => {
      if (pathname === "/" && settings?.isActive !== false) {
        // --- Persistence Logic ---
        const DISMISSED_KEY = "newsletter_dismissed";
        const SESSION_KEY = "newsletter_session_dismissed";
        
        const isForceShow = settings?.forceShow === true;
        const interval = settings?.showInterval || "once";

        let shouldShow = true;

        if (!isForceShow) {
          if (interval === "once") {
            if (localStorage.getItem(DISMISSED_KEY)) shouldShow = false;
          } else if (interval === "every_session") {
            if (sessionStorage.getItem(SESSION_KEY)) shouldShow = false;
          } else if (interval === "every_reload") {
            // No persistence check, show every time
            shouldShow = true;
          }
        }

        if (!shouldShow) return;

        const bootstrap = await import("bootstrap"); // dynamically import bootstrap
        const modalEl = document.getElementById("newsletterPopup");
        if (!modalEl) return;

        const myModal = new bootstrap.Modal(modalEl, {
          keyboard: false,
        });

        // Show the modal after a delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        myModal.show();

        const handleDismiss = () => {
          if (interval === "once") {
            localStorage.setItem(DISMISSED_KEY, "true");
          } else if (interval === "every_session") {
            sessionStorage.setItem(SESSION_KEY, "true");
          }
        };

        modalEl.addEventListener("hidden.bs.modal", () => {
          handleDismiss();
          myModal.hide();
        });
      }
    };

    if (settings) {
      showModal();
    }
  }, [pathname, settings]);

  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    setIsSubscribing(true);
    try {
      const response = await subscribeToNewsletter(email);

      if (response.success) {
        e.target.reset();
        setSuccess(true);
        handleShowMessage();
        // Also mark as dismissed so it doesn't show again if they subscribed
        localStorage.setItem("newsletter_dismissed", "true");
      } else {
        setSuccess(false);
        setErrorMessage(response.message || (settings?.errorMessage || "Something went wrong"));
        handleShowMessage();
      }
    } catch (error) {
      setSuccess(false);
      setErrorMessage(settings?.errorMessage || "An error occurred");
      handleShowMessage();
      e.target.reset();
    } finally {
      setIsSubscribing(false);
    }
  };

  if (!settings || !settings.isActive) return null;

  return (
    <div
      className="modal modalCentered fade auto-popup modal-newleter"
      id="newsletterPopup"
      ref={modalElement}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-top">
            <Image
              className="lazyload"
              data-src={settings?.image || "/images/section/newsletter.jpg"}
              alt="newsletter"
              src={settings?.image || "/images/section/newsletter.jpg"}
              width={660}
              height={440}
            />
            <span
              className="icon icon-close btn-hide-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="modal-bottom text-center">
            <p className="text-btn-uppercase fw-4 font-2">
              {settings?.title || "Subscribe To Our Newletter!"}
            </p>
            <h5>
              {settings?.subtitle || "Receive 10% OFF your next order, exclusive offers & more!"}
            </h5>
            <div
              className={`tfSubscribeMsg footer-sub-element ${
                showMessage || isSubscribing ? "active" : ""
              }`}
            >
              {isSubscribing ? (
                <p style={{ color: "blue" }}>Subscribing, please wait...</p>
              ) : success ? (
                <p style={{ color: "rgb(52, 168, 83)" }}>
                  {settings?.successMessage || "You have successfully subscribed."}
                </p>
              ) : (
                <p style={{ color: "red" }}>{errorMessage}</p>
              )}
            </div>
            <form
              id="subscribe-form"
              onSubmit={(e) => {
                e.preventDefault();
                sendEmail(e);
              }}
              className="form-newsletter-subscribe"
            >
              <div id="subscribe-content">
                <input
                  type="email"
                  name="email"
                  id="subscribe-email"
                  placeholder={settings?.placeholder || "Enter your e-mail"}
                  required
                  disabled={isSubscribing}
                />
                <button
                  type="submit"
                  id="subscribe-button"
                  className="btn-style-2 radius-12 w-100 justify-content-center"
                  disabled={isSubscribing}
                >
                  <span className="text text-btn-uppercase">
                    {isSubscribing ? "SUBSCRIBING..." : (settings?.buttonText || "SUBSCRIBE")}
                  </span>
                </button>
              </div>
              <div id="subscribe-msg" />
            </form>
            {settings?.showSocialIcons !== false && settings?.socialIcons && (
              <ul className="tf-social-icon style-default justify-content-center">
                {settings.socialIcons.map((social, index) => {
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
                  const iconClass = iconMap[social.platform] || "icon-share";

                  return (
                    <li key={index}>
                      <a href={social.href} className={`social-${social.platform}`}>
                        <i className={`icon ${iconClass}`} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
