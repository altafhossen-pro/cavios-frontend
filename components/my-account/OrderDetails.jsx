"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { getOrderById } from "@/features/order/api/orderApi";
import Link from "next/link";

// Inner component that uses useSearchParams
function OrderDetailsContent() {
  const [activeTab, setActiveTab] = useState(1);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getOrderById(orderId);
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          setError(response.message || "Failed to load order details");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Format date to "04 September 2024, 13:30:23" format
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = hours.toString().padStart(2, "0");
    
    return `${day} ${month} ${year}, ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };

  // Format date to "17/07/2024, 02:34pm" format
  const formatDateShort = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = hours.toString().padStart(2, "0");
    
    return `${day}/${month}/${year}, ${formattedHours}:${minutes}${ampm}`;
  };

  // Format status to display text
  const formatStatus = (status) => {
    if (!status) return "";
    const statusMap = {
      pending: "Pending",
      confirmed: "Confirmed",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      returned: "Returned"
    };
    return statusMap[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    const statusMap = {
      pending: "",
      confirmed: "success",
      processing: "warning",
      shipped: "info",
      delivered: "success",
      cancelled: "danger",
      returned: "secondary"
    };
    return statusMap[status?.toLowerCase()] || "";
  };

  // Format address
  const formatAddress = (address) => {
    if (!address) return "N/A";
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.area) parts.push(address.area);
    if (address.upazila) parts.push(address.upazila);
    if (address.district) parts.push(address.district);
    if (address.division) parts.push(address.division);
    if (address.postalCode) parts.push(address.postalCode);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  // Format payment method
  const formatPaymentMethod = (method) => {
    if (!method) return "N/A";
    const methodMap = {
      cod: "Cash on Delivery",
      card: "Card",
      bkash: "bKash",
      nagad: "Nagad",
      rocket: "Rocket"
    };
    return methodMap[method.toLowerCase()] || method;
  };

  // Get first product image
  const getFirstProductImage = () => {
    if (order?.items && order.items.length > 0) {
      const firstItem = order.items[0];
      if (firstItem.image) return firstItem.image;
      if (firstItem.product?.featuredImage) return firstItem.product.featuredImage;
    }
    return "/images/logo/logo.svg";
  };

  // Calculate total items
  const getTotalItems = () => {
    if (!order?.items) return 0;
    return order.items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  // Calculate total discount
  const getTotalDiscount = () => {
    if (!order) return 0;
    return (order.discount || 0) + 
           (order.couponDiscount || 0) + 
           (order.upsellDiscount || 0) + 
           (order.loyaltyDiscount || 0);
  };

  if (loading) {
    return (
      <div className="my-account-content">
        <div className="account-order-details">
          <div className="text-center" style={{ padding: "40px" }}>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="my-account-content">
        <div className="account-order-details">
          <div className="text-center" style={{ padding: "40px", color: "red" }}>
            <p>{error || "Order not found"}</p>
            <Link href="/my-account-orders" className="tf-btn btn-fill radius-4 mt-4">
              <span className="text">Back to Orders</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-account-content">
      <div className="account-order-details">
        <div className="wd-form-order">
          <div className="order-head">
            <figure className="img-product">
              <Image
                alt="product"
                src={getFirstProductImage()}
                width={600}
                height={800}
                onError={(e) => {
                  e.target.src = "/images/logo/logo.svg";
                }}
              />
            </figure>
            <div className="content">
              <div className={`badge ${getStatusBadgeClass(order.status)}`}>
                {formatStatus(order.status)}
              </div>
              <h6 className="mt-8 fw-5">Order #{order.orderId || order._id}</h6>
            </div>
          </div>
          <div className="tf-grid-layout md-col-2 gap-15">
            <div className="item">
              <div className="text-2 text_black-2">Items</div>
              <div className="text-2 mt_4 fw-6">{getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""}</div>
            </div>
            <div className="item">
              <div className="text-2 text_black-2">Payment Method</div>
              <div className="text-2 mt_4 fw-6">{formatPaymentMethod(order.paymentMethod)}</div>
            </div>
            <div className="item">
              <div className="text-2 text_black-2">Order Date</div>
              <div className="text-2 mt_4 fw-6">
                {formatDateTime(order.createdAt)}
              </div>
            </div>
            <div className="item">
              <div className="text-2 text_black-2">Shipping Address</div>
              <div className="text-2 mt_4 fw-6">
                {formatAddress(order.shippingAddress)}
              </div>
            </div>
          </div>
          <div className="widget-tabs style-3 widget-order-tab">
            <ul className="widget-menu-tab">
              <li
                className={`item-title ${activeTab == 1 ? "active" : ""} `}
                onClick={() => setActiveTab(1)}
              >
                <span className="inner">Order History</span>
              </li>
              <li
                className={`item-title ${activeTab == 2 ? "active" : ""} `}
                onClick={() => setActiveTab(2)}
              >
                <span className="inner">Item Details</span>
              </li>
              <li
                className={`item-title ${activeTab == 3 ? "active" : ""} `}
                onClick={() => setActiveTab(3)}
              >
                <span className="inner">Courier</span>
              </li>
              <li
                className={`item-title ${activeTab == 4 ? "active" : ""} `}
                onClick={() => setActiveTab(4)}
              >
                <span className="inner">Receiver</span>
              </li>
            </ul>
            <div className="widget-content-tab">
              {/* Order History Tab */}
              <div
                className={`widget-content-inner ${
                  activeTab == 1 ? "active" : ""
                } `}
              >
                <div className="widget-timeline">
                  <ul className="timeline">
                    {order.tracking && order.tracking.length > 0 ? (
                      order.tracking.map((track, index) => (
                        <li key={index}>
                          <div className={`timeline-badge ${track.status === "delivered" || track.status === "shipped" ? "success" : ""}`} />
                          <div className="timeline-box">
                            <a className="timeline-panel" href="#">
                              <div className="text-2 fw-6">{formatStatus(track.status)}</div>
                              <span>{formatDateShort(track.date)}</span>
                            </a>
                            {track.note && (
                              <p>
                                <strong>Note : </strong>{track.note}
                              </p>
                            )}
                          </div>
                        </li>
                      ))
                    ) : (
                      <>
                        {order.statusTimestamps?.delivered && (
                          <li>
                            <div className="timeline-badge success" />
                            <div className="timeline-box">
                              <a className="timeline-panel" href="#">
                                <div className="text-2 fw-6">Delivered</div>
                                <span>{formatDateShort(order.statusTimestamps.delivered)}</span>
                              </a>
                            </div>
                          </li>
                        )}
                        {order.statusTimestamps?.shipped && (
                          <li>
                            <div className="timeline-badge success" />
                            <div className="timeline-box">
                              <a className="timeline-panel" href="#">
                                <div className="text-2 fw-6">Shipped</div>
                                <span>{formatDateShort(order.statusTimestamps.shipped)}</span>
                              </a>
                            </div>
                          </li>
                        )}
                        {order.statusTimestamps?.processing && (
                          <li>
                            <div className="timeline-badge" />
                            <div className="timeline-box">
                              <a className="timeline-panel" href="#">
                                <div className="text-2 fw-6">Processing</div>
                                <span>{formatDateShort(order.statusTimestamps.processing)}</span>
                              </a>
                            </div>
                          </li>
                        )}
                        {order.statusTimestamps?.confirmed && (
                          <li>
                            <div className="timeline-badge" />
                            <div className="timeline-box">
                              <a className="timeline-panel" href="#">
                                <div className="text-2 fw-6">Confirmed</div>
                                <span>{formatDateShort(order.statusTimestamps.confirmed)}</span>
                              </a>
                            </div>
                          </li>
                        )}
                        <li>
                          <div className="timeline-badge" />
                          <div className="timeline-box">
                            <a className="timeline-panel" href="#">
                              <div className="text-2 fw-6">Order Placed</div>
                              <span>{formatDateShort(order.createdAt)}</span>
                            </a>
                          </div>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Item Details Tab */}
              <div
                className={`widget-content-inner ${
                  activeTab == 2 ? "active" : ""
                } `}
              >
                {order.items && order.items.length > 0 ? (
                  <>
                    {order.items.map((item, index) => (
                      <div key={index} className="order-head mb-4">
                        <figure className="img-product">
                          <Image
                            alt={item.name || "product"}
                            src={item.image || item.product?.featuredImage || "/images/logo/logo.svg"}
                            width={600}
                            height={800}
                            onError={(e) => {
                              e.target.src = "/images/logo/logo.svg";
                            }}
                          />
                        </figure>
                        <div className="content">
                          <div className="text-2 fw-6">{item.name || item.product?.title || "Product"}</div>
                          <div className="mt_4">
                            <span className="fw-6">Price :</span> ৳{item.price?.toLocaleString("en-US") || "0"}
                          </div>
                          <div className="mt_4">
                            <span className="fw-6">Quantity :</span> {item.quantity || 0}
                          </div>
                          {item.variant?.size && (
                            <div className="mt_4">
                              <span className="fw-6">Size :</span> {item.variant.size}
                            </div>
                          )}
                          {item.variant?.color && (
                            <div className="mt_4">
                              <span className="fw-6">Color :</span> {item.variant.color}
                            </div>
                          )}
                          <div className="mt_4">
                            <span className="fw-6">Subtotal :</span> ৳{item.subtotal?.toLocaleString("en-US") || "0"}
                          </div>
                        </div>
                      </div>
                    ))}
                    <ul>
                      <li className="d-flex justify-content-between text-2">
                        <span>Subtotal</span>
                        <span className="fw-6">৳{((order.total || 0) - (order.shippingCost || 0) + getTotalDiscount()).toLocaleString("en-US")}</span>
                      </li>
                      {getTotalDiscount() > 0 && (
                        <li className="d-flex justify-content-between text-2 mt_4 pb_8 line-bt">
                          <span>Total Discounts</span>
                          <span className="fw-6">-৳{getTotalDiscount().toLocaleString("en-US")}</span>
                        </li>
                      )}
                      {order.shippingCost > 0 && (
                        <li className="d-flex justify-content-between text-2 mt_4 pb_8 line-bt">
                          <span>Shipping Cost</span>
                          <span className="fw-6">৳{order.shippingCost.toLocaleString("en-US")}</span>
                        </li>
                      )}
                      <li className="d-flex justify-content-between text-2 mt_8">
                        <span>Order Total</span>
                        <span className="fw-6">৳{order.total?.toLocaleString("en-US") || "0"}</span>
                      </li>
                    </ul>
                  </>
                ) : (
                  <p>No items found</p>
                )}
              </div>

              {/* Courier Tab */}
              <div
                className={`widget-content-inner ${
                  activeTab == 3 ? "active" : ""
                } `}
              >
                <p>
                  {order.tracking && order.tracking.length > 0 ? (
                    <>
                      {order.tracking.map((track, index) => (
                        <div key={index} className="mb-3">
                          <strong>{formatStatus(track.status)}</strong> - {formatDateTime(track.date)}
                          {track.note && <p className="mt-2">{track.note}</p>}
                        </div>
                      ))}
                    </>
                  ) : (
                    "Tracking information will be updated once your order is shipped. Our courier service is dedicated to providing fast, reliable, and secure delivery solutions tailored to meet your needs. Whether you're sending documents, parcels, or larger shipments, our team ensures that your items are handled with the utmost care and delivered on time."
                  )}
                </p>
              </div>

              {/* Receiver Tab */}
              <div
                className={`widget-content-inner ${
                  activeTab == 4 ? "active" : ""
                } `}
              >
                <p className="text-2 text-success">
                  Thank you! Your order has been received
                </p>
                <ul className="mt_20">
                  <li>
                    Order Number : <span className="fw-7">#{order.orderId || order._id}</span>
                  </li>
                  <li>
                    Date :<span className="fw-7"> {formatDateShort(order.createdAt)}</span>
                  </li>
                  <li>
                    Total : <span className="fw-7">৳{order.total?.toLocaleString("en-US") || "0"}</span>
                  </li>
                  <li>
                    Payment Method :
                    <span className="fw-7"> {formatPaymentMethod(order.paymentMethod)}</span>
                  </li>
                  <li>
                    Payment Status :
                    <span className="fw-7"> {formatStatus(order.paymentStatus)}</span>
                  </li>
                  {order.shippingAddress && (
                    <li>
                      Shipping Address :
                      <span className="fw-7"> {formatAddress(order.shippingAddress)}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper component with Suspense boundary
export default function OrderDetails() {
  return (
    <Suspense fallback={
      <div className="my-account-content">
        <div className="account-order-details">
          <div className="text-center" style={{ padding: "40px" }}>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    }>
      <OrderDetailsContent />
    </Suspense>
  );
}

