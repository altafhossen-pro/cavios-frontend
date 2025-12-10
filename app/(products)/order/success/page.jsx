"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import MainHeader from "@/components/headers/MainHeader";
import Footer from "@/components/footers/Footer";
import { getOrderById } from "@/features/order/api/orderApi";
import { formatPrice } from "@/config/currency";

// Inner component that uses useSearchParams
function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await getOrderById(orderId);
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          setError(response.message || "Order not found");
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

  if (loading) {
    return (
      <>
        <MainHeader />
        <section className="flat-spacing">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center" style={{ padding: '60px 0' }}>
                <div style={{ fontSize: '18px' }}>Loading order details...</div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <MainHeader />
        <section className="flat-spacing">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div style={{
                  maxWidth: '600px',
                  margin: '0 auto',
                  padding: '40px',
                  textAlign: 'center',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    fontSize: '48px',
                    color: '#dc3545',
                    marginBottom: '20px'
                  }}>⚠️</div>
                  <h2 style={{ marginBottom: '15px', color: '#333' }}>Order Not Found</h2>
                  <p style={{ color: '#666', marginBottom: '30px' }}>
                    {error || "We couldn't find your order. Please check your order ID or contact support."}
                  </p>
                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <Link href="/my-account-orders" className="tf-btn btn-fill">
                      <span className="text text-button">View My Orders</span>
                    </Link>
                    <Link href="/" className="tf-btn btn-white">
                      <span className="text text-button">Continue Shopping</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <MainHeader />
      <section className="flat-spacing">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div style={{
                maxWidth: '700px',
                margin: '0 auto',
                padding: '50px 40px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                {/* Success Icon */}
                <div style={{
                  width: '100px',
                  height: '100px',
                  margin: '0 auto 30px',
                  borderRadius: '50%',
                  backgroundColor: '#d4edda',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '50px'
                }}>
                  ✓
                </div>

                {/* Success Message */}
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#28a745',
                  marginBottom: '15px'
                }}>
                  Order Placed Successfully!
                </h1>
                
                <p style={{
                  fontSize: '18px',
                  color: '#666',
                  marginBottom: '40px',
                  lineHeight: '1.6'
                }}>
                  Thank you for your order. We've received your order and will begin processing it right away.
                </p>

                {/* Order Details */}
                <div style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '25px',
                  marginBottom: '30px',
                  textAlign: 'left'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '20px',
                    color: '#333',
                    borderBottom: '2px solid #e0e0e0',
                    paddingBottom: '10px'
                  }}>
                    Order Details
                  </h3>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#666', display: 'inline-block', width: '140px' }}>Order ID:</strong>
                    <span style={{ color: '#333', fontWeight: '600' }}>{order.orderId || order._id}</span>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#666', display: 'inline-block', width: '140px' }}>Total Amount:</strong>
                    <span style={{ color: '#28a745', fontWeight: '600', fontSize: '18px' }}>
                      {formatPrice(order.total || 0)}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#666', display: 'inline-block', width: '140px' }}>Payment Method:</strong>
                    <span style={{ color: '#333', textTransform: 'capitalize' }}>
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod || 'N/A'}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#666', display: 'inline-block', width: '140px' }}>Status:</strong>
                    <span style={{
                      color: order.status === 'pending' ? '#ffc107' : '#28a745',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {order.status || 'Pending'}
                    </span>
                  </div>

                  {order.shippingAddress && (
                    <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e0e0e0' }}>
                      <strong style={{ color: '#666', display: 'block', marginBottom: '10px' }}>Delivery Address:</strong>
                      <div style={{ color: '#333', lineHeight: '1.8' }}>
                        {order.shippingAddress.street && <div>{order.shippingAddress.street}</div>}
                        {order.shippingAddress.area && <div>{order.shippingAddress.area}</div>}
                        {order.shippingAddress.upazila && <div>{order.shippingAddress.upazila}</div>}
                        {order.shippingAddress.district && <div>{order.shippingAddress.district}</div>}
                        {order.shippingAddress.division && <div>{order.shippingAddress.division}</div>}
                        {order.shippingAddress.country && <div>{order.shippingAddress.country}</div>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  <Link href="/my-account-orders" className="tf-btn btn-fill">
                    <span className="text text-button">View My Orders</span>
                  </Link>
                  <Link href="/" className="tf-btn btn-white">
                    <span className="text text-button">Continue Shopping</span>
                  </Link>
                </div>

                {/* Additional Info */}
                <div style={{
                  marginTop: '40px',
                  padding: '20px',
                  backgroundColor: '#e7f3ff',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#0066cc',
                  lineHeight: '1.6'
                }}>
                  <strong>What's Next?</strong>
                  <div style={{ marginTop: '10px' }}>
                    You will receive an email confirmation shortly. We'll notify you once your order has been shipped.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

// Wrapper component with Suspense boundary
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <>
        <MainHeader />
        <section className="flat-spacing">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center" style={{ padding: '60px 0' }}>
                <div style={{ fontSize: '18px' }}>Loading order details...</div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}

