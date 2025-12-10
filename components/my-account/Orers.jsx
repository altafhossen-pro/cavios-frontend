"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getUserOrders } from "@/features/order/api/orderApi";

export default function Orers() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUserOrders();
        if (response.success && response.data) {
          setOrders(response.data);
        } else {
          setError(response.message || "Failed to load orders");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Format date to "Nov 24, 2025 04:22 PM" format
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = hours.toString().padStart(2, "0");
    
    return `${month} ${day}, ${year} ${formattedHours}:${minutes} ${ampm}`;
  };

  // Format status to capitalize first letter
  const formatStatus = (status) => {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="my-account-content">
      <div className="account-orders">
        <div className="wrap-account-order">
          {loading ? (
            <div className="text-center" style={{ padding: "40px" }}>
              <p>Loading orders...</p>
            </div>
          ) : error ? (
            <div className="text-center" style={{ padding: "40px", color: "red" }}>
              <p>{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center" style={{ padding: "40px" }}>
              <p>No orders found</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th className="fw-6">Order ID</th>
                  <th className="fw-6">Date & Time</th>
                  <th className="fw-6">Status</th>
                  <th className="fw-6">Amount</th>
                  <th className="fw-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  return (
                    <tr key={order._id} className="tf-order-item">
                      <td>{order.orderId || order._id}</td>
                      <td>{formatDateTime(order.createdAt)}</td>
                      <td>{formatStatus(order.status)}</td>
                      <td>৳{order.total?.toLocaleString("en-US") || "0"}</td>
                      <td>
                        <Link
                          href={`/my-account-orders-details?id=${order.orderId}`}
                          className="tf-btn btn-fill radius-4"
                        >
                          <span className="text">View</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
