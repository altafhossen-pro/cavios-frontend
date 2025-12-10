"use client";

import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/config/currency";
import { getDivisions, getDistrictsByDivision, getUpazilasByDistrict, getDhakaCityAreas } from "@/features/address/api/addressApi";
import { createOrder } from "@/features/order/api/orderApi";

export default function Checkout() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("insideDhaka"); // insideDhaka, outsideDhaka, subDhaka
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  
  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [dhakaArea, setDhakaArea] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  
  // Validation and loading states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Address data states
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [dhakaCityAreas, setDhakaCityAreas] = useState([]);
  
  // Check if district is Dhaka (ID: 65)
  const isDhakaDistrict = district === "65" || district === 65;
  
  // Find selected division and district objects
  const selectedDivisionObj = useMemo(() => {
    return divisions.find(div => div.id === division);
  }, [divisions, division]);
  
  const selectedDistrictObj = useMemo(() => {
    return districts.find(dist => dist.id === district);
  }, [districts, district]);
  
  // Check if division is Dhaka division (usually ID: "30" or name contains "Dhaka")
  const isDhakaDivision = useMemo(() => {
    if (!selectedDivisionObj) return false;
    const divisionName = selectedDivisionObj.name?.toLowerCase() || '';
    return divisionName.includes('dhaka') || selectedDivisionObj.id === "30";
  }, [selectedDivisionObj]);
  
  // Load divisions on mount
  useEffect(() => {
    const loadDivisions = async () => {
      const response = await getDivisions();
      if (response.success && response.data) {
        setDivisions(response.data);
      }
    };
    loadDivisions();
  }, []);
  
  // Load districts when division changes
  useEffect(() => {
    if (division) {
      const loadDistricts = async () => {
        const response = await getDistrictsByDivision(division);
        if (response.success && response.data) {
          setDistricts(response.data);
          setDistrict(""); // Reset district when division changes
          setUpazila(""); // Reset upazila when division changes
        }
      };
      loadDistricts();
    } else {
      setDistricts([]);
      setDistrict("");
      setUpazila("");
    }
  }, [division]);
  
  // Load upazilas or Dhaka City areas when district changes
  useEffect(() => {
    if (district) {
      // Check if district is Dhaka (ID: 65)
      if (district === "65" || district === 65) {
        // Load Dhaka City areas (no district ID needed)
        const loadDhakaAreas = async () => {
          console.log('Loading Dhaka City areas for district:', district);
          const response = await getDhakaCityAreas();
          console.log('Dhaka City areas response:', response);
          if (response.success && response.data) {
            console.log('Dhaka City areas loaded:', response.data.length, 'areas');
            setDhakaCityAreas(response.data);
            setDhakaArea(""); // Reset area when district changes
            setUpazilas([]); // Clear upazilas
            setUpazila(""); // Clear upazila
          } else {
            console.error('Failed to load Dhaka City areas:', response.message);
            setDhakaCityAreas([]);
          }
        };
        loadDhakaAreas();
      } else {
        // Load upazilas for other districts
        const loadUpazilas = async () => {
          const response = await getUpazilasByDistrict(district);
          if (response.success && response.data) {
            setUpazilas(response.data);
            setUpazila(""); // Reset upazila when district changes
            setDhakaCityAreas([]); // Clear Dhaka areas
            setDhakaArea(""); // Clear area
          }
        };
        loadUpazilas();
      }
    } else {
      setUpazilas([]);
      setUpazila("");
      setDhakaCityAreas([]);
      setDhakaArea("");
    }
  }, [district]);
  
  // Auto-set delivery charge based on address
  useEffect(() => {
    if (district) {
      // If district is Dhaka (ID: 65) -> Inside Dhaka
      if (isDhakaDistrict) {
        setSelectedLocation("insideDhaka");
      } 
      // If division is Dhaka but district is not Dhaka -> Sub Dhaka
      else if (isDhakaDivision) {
        setSelectedLocation("subDhaka");
      } 
      // Otherwise -> Outside Dhaka
      else {
        setSelectedLocation("outsideDhaka");
      }
    }
  }, [district, isDhakaDistrict, isDhakaDivision]);
  
  const { 
    cartProducts, 
    totalPrice,
    deliveryChargeSettings,
    user,
    clearCart
  } = useContextElement();

  // Calculate shipping charge based on location and delivery settings
  const shippingCharge = useMemo(() => {
    if (!deliveryChargeSettings) return 0;
    
    // Check if total price qualifies for free shipping
    if (totalPrice >= deliveryChargeSettings.shippingFreeRequiredAmount) {
      return 0;
    }

    // Calculate based on selected location
    switch (selectedLocation) {
      case "insideDhaka":
        return deliveryChargeSettings.insideDhaka || 0;
      case "outsideDhaka":
        return deliveryChargeSettings.outsideDhaka || 0;
      case "subDhaka":
        return deliveryChargeSettings.subDhaka || 0;
      default:
        return deliveryChargeSettings.insideDhaka || 0;
    }
  }, [selectedLocation, totalPrice, deliveryChargeSettings]);

  // Calculate final total
  const finalTotal = useMemo(() => {
    return Math.max(0, totalPrice + shippingCharge - appliedDiscount);
  }, [totalPrice, shippingCharge, appliedDiscount]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!name || !name.trim()) {
      newErrors.name = "Full name is required";
    }
    
    if (!phone || !phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneDigits = phone.replace(/[^0-9]/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        newErrors.phone = "Please enter a valid phone number (10-11 digits)";
      }
    }
    
    if (!division) {
      newErrors.division = "Please select a division";
    }
    
    if (!district) {
      newErrors.district = "Please select a district";
    }
    
    if (isDhakaDistrict && !dhakaArea) {
      newErrors.dhakaArea = "Please select an area";
    } else if (!isDhakaDistrict && !upazila) {
      newErrors.upazila = "Please select an upazila";
    }
    
    if (!shippingAddress || !shippingAddress.trim()) {
      newErrors.shippingAddress = "Shipping address is required";
    }
    
    if (!cartProducts || cartProducts.length === 0) {
      newErrors.cart = "Your cart is empty";
    }
    
    const isValid = Object.keys(newErrors).length === 0;
    
    // Add submit error message if validation fails
    if (!isValid) {
      const errorMessages = Object.values(newErrors).filter(msg => msg !== "Your cart is empty");
      if (errorMessages.length > 0) {
        newErrors.submit = "Please fill in all required fields correctly";
      }
    }
    
    // Set all errors at once
    setErrors(newErrors);
    
    return isValid;
  };

  // Handle order submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Place Order clicked');
    console.log('Form data:', { name, phone, division, district, upazila, dhakaArea, shippingAddress, cartProducts: cartProducts?.length });
    
    // Clear previous submit error
    setErrors({});
    
    // Validate form
    const isValid = validateForm();
    console.log('Validation result:', isValid);
    
    if (!isValid) {
      console.log('Form validation failed - showing errors');
      setIsSubmitting(false);
      // Force re-render to show errors
      setTimeout(() => {
        setErrors(prev => ({ ...prev }));
      }, 100);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare order items from cart
      const orderItems = cartProducts.map(item => ({
        product: item.productId,
        variantSku: item.variantSku || '',
        name: item.productTitle || 'Product',
        image: item.productImage || '',
        price: item.price || 0,
        quantity: item.quantity || 1,
        subtotal: (item.price || 0) * (item.quantity || 1),
        variant: {
          size: item.size || '',
          color: item.color || '',
          colorHexCode: item.colorHexCode || '',
          sku: item.variantSku || '',
          stockQuantity: item.stockQuantity || null,
          stockStatus: 'in_stock'
        }
      }));
      
      // Prepare shipping address
      const selectedDivisionName = selectedDivisionObj?.name || '';
      const selectedDistrictName = selectedDistrictObj?.name || '';
      let selectedUpazilaName = '';
      let selectedAreaName = '';
      
      if (isDhakaDistrict && dhakaArea) {
        const area = dhakaCityAreas.find(a => a.id === dhakaArea);
        selectedAreaName = area?.name || '';
      } else if (!isDhakaDistrict && upazila) {
        const upz = upazilas.find(u => u.id === upazila);
        selectedUpazilaName = upz?.name || '';
      }
      
      const shippingAddressData = {
        label: 'Home',
        street: shippingAddress,
        city: selectedDistrictName,
        state: selectedDivisionName,
        country: 'Bangladesh',
        divisionId: division,
        districtId: district,
        upazilaId: isDhakaDistrict ? '' : upazila,
        areaId: isDhakaDistrict ? dhakaArea : '',
        division: selectedDivisionName,
        district: selectedDistrictName,
        upazila: selectedUpazilaName,
        area: selectedAreaName
      };
      
      // Prepare order data
      const orderData = {
        items: orderItems,
        shippingAddress: shippingAddressData,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        total: finalTotal,
        discount: appliedDiscount,
        shippingCost: shippingCharge,
        orderNotes: notes || '',
        orderSource: 'website'
      };
      
      // Create order
      console.log('Sending order data:', orderData);
      const response = await createOrder(orderData);
      console.log('Order API response:', response);
      
      if (response.success && response.data) {
        // Clear cart after successful order
        clearCart();
        
        // Navigate to success page
        const orderId = response.data.orderId || response.data._id;
        router.push(`/order/success?orderId=${orderId}`);
      } else {
        setErrors({ submit: response.message || 'Failed to place order. Please try again.' });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
      setIsSubmitting(false);
    }
  };

  // Handle empty cart
  if (!cartProducts || cartProducts.length === 0) {
    return (
      <section>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="p-4 text-center">
                <p>Your cart is empty. Please add items to checkout.</p>
                <Link className="btn-line" href="/shop-default-grid">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div className="flat-spacing tf-page-checkout">
              {!user && (
                <div className="wrap">
                  <div className="title-login">
                    <p>Already have an account?</p>{" "}
                    <Link href={`/login`} className="text-button">
                      Login here
                    </Link>
                  </div>
                  <form
                    className="login-box"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div className="grid-2">
                      <input type="text" placeholder="Your name/Email" />
                      <input type="password" placeholder="Password" />
                    </div>
                    <button className="tf-btn" type="submit">
                      <span className="text">Login</span>
                    </button>
                  </form>
                </div>
              )}
              <div className="wrap">
                <h5 className="title">Delivery Information</h5>
                {errors.submit && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#fee',
                    color: '#c33',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    fontSize: '14px'
                  }}>
                    {errors.submit}
                  </div>
                )}
                <form className="info-box" onSubmit={(e) => e.preventDefault()} id="delivery-form">
                  <div className="grid-2">
                    <div>
                      <input 
                        type="text" 
                        placeholder="Full Name*" 
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        style={{ borderColor: errors.name ? '#dc3545' : '' }}
                        required
                      />
                      {errors.name && (
                        <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                          {errors.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <input 
                        type="tel" 
                        placeholder="Phone Number*" 
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        style={{ borderColor: errors.phone ? '#dc3545' : '' }}
                        required
                      />
                      {errors.phone && (
                        <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                          {errors.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid-2">
                    <div>
                      <div className="tf-select">
                        <select
                          className="text-title"
                          value={division}
                          onChange={(e) => {
                            setDivision(e.target.value);
                            if (errors.division) setErrors({ ...errors, division: '' });
                          }}
                          style={{ borderColor: errors.division ? '#dc3545' : '' }}
                          required
                        >
                          <option value="">Select Division*</option>
                          {divisions.map((div) => (
                            <option key={div.id} value={div.id}>
                              {div.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.division && (
                        <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                          {errors.division}
                        </div>
                      )}
                    </div>
                    {division ? (
                      <div key="district-select">
                        <div className="tf-select">
                          <select 
                            className="text-title"
                            value={district}
                            onChange={(e) => {
                              setDistrict(e.target.value);
                              if (errors.district) setErrors({ ...errors, district: '' });
                            }}
                            style={{ borderColor: errors.district ? '#dc3545' : '' }}
                            required
                          >
                            <option value="">Select District*</option>
                            {districts.map((dist) => (
                              <option key={dist.id} value={dist.id}>
                                {dist.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.district && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                            {errors.district}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div key="district-placeholder"></div>
                    )}
                  </div>
                  {district && (
                    <div className="grid-2">
                      {isDhakaDistrict ? (
                        <div key="dhaka-area-select">
                          <div className="tf-select">
                            <select 
                              className="text-title"
                              value={dhakaArea}
                              onChange={(e) => {
                                setDhakaArea(e.target.value);
                                if (errors.dhakaArea) setErrors({ ...errors, dhakaArea: '' });
                              }}
                              style={{ borderColor: errors.dhakaArea ? '#dc3545' : '' }}
                              required
                            >
                              <option value="">Select Area*</option>
                              {dhakaCityAreas.map((area,index) => (
                                <option key={index} value={area.id}>
                                  {area.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          {errors.dhakaArea && (
                            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                              {errors.dhakaArea}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div key="upazila-select">
                          <div className="tf-select">
                            <select 
                              className="text-title"
                              value={upazila}
                              onChange={(e) => {
                                setUpazila(e.target.value);
                                if (errors.upazila) setErrors({ ...errors, upazila: '' });
                              }}
                              style={{ borderColor: errors.upazila ? '#dc3545' : '' }}
                              required
                            >
                              <option value="">Select Upazila*</option>
                              {upazilas.map((upz,index) => (
                                <option key={index} value={upz.id}>
                                  {upz.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          {errors.upazila && (
                            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                              {errors.upazila}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <textarea 
                      placeholder="Shipping Address*" 
                      value={shippingAddress}
                      onChange={(e) => {
                        setShippingAddress(e.target.value);
                        if (errors.shippingAddress) setErrors({ ...errors, shippingAddress: '' });
                      }}
                      rows={3}
                      style={{ borderColor: errors.shippingAddress ? '#dc3545' : '' }}
                      required
                    />
                    {errors.shippingAddress && (
                      <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                        {errors.shippingAddress}
                      </div>
                    )}
                  </div>
                  <textarea 
                    placeholder="Additional Notes (Optional)" 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                  
                  {/* Delivery Charge Selection */}
                  <div className="delivery-charge-selection">
                    <h6 className="title" style={{ marginBottom: '15px' }}>Choose Delivery Charge:</h6>
                    <div className="grid-3" style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: '15px'
                    }}>
                      <div 
                        className={`delivery-option ${selectedLocation === 'insideDhaka' ? 'active' : ''}`}
                        onClick={() => setSelectedLocation('insideDhaka')}
                        style={{
                          padding: '15px',
                          border: `2px solid ${selectedLocation === 'insideDhaka' ? '#007bff' : '#e0e0e0'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          backgroundColor: selectedLocation === 'insideDhaka' ? '#f0f8ff' : '#fff',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Inside Dhaka</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          {deliveryChargeSettings ? formatPrice(deliveryChargeSettings.insideDhaka || 0) : '৳0.00'}
                        </div>
                      </div>
                      <div 
                        className={`delivery-option ${selectedLocation === 'subDhaka' ? 'active' : ''}`}
                        onClick={() => setSelectedLocation('subDhaka')}
                        style={{
                          padding: '15px',
                          border: `2px solid ${selectedLocation === 'subDhaka' ? '#007bff' : '#e0e0e0'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          backgroundColor: selectedLocation === 'subDhaka' ? '#f0f8ff' : '#fff',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Sub Dhaka</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          {deliveryChargeSettings ? formatPrice(deliveryChargeSettings.subDhaka || 0) : '৳0.00'}
                        </div>
                      </div>
                      <div 
                        className={`delivery-option ${selectedLocation === 'outsideDhaka' ? 'active' : ''}`}
                        onClick={() => setSelectedLocation('outsideDhaka')}
                        style={{
                          padding: '15px',
                          border: `2px solid ${selectedLocation === 'outsideDhaka' ? '#007bff' : '#e0e0e0'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          backgroundColor: selectedLocation === 'outsideDhaka' ? '#f0f8ff' : '#fff',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Outside Dhaka</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          {deliveryChargeSettings ? formatPrice(deliveryChargeSettings.outsideDhaka || 0) : '৳0.00'}
                  </div>
                  </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="wrap">
                <h5 className="title">Choose payment Option:</h5>
                <form
                  className="form-payment"
                  onSubmit={handlePlaceOrder}
                >
                  <div className="payment-box" id="payment-box">
                    <div className="payment-item payment-choose-card active">
                      <label
                        htmlFor="delivery-method"
                        className="payment-header"
                        data-bs-toggle="collapse"
                        data-bs-target="#delivery-payment"
                        aria-controls="delivery-payment"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded"
                          id="delivery-method"
                          defaultChecked
                        />
                        <span className="text-title">Cash on delivery</span>
                      </label>
                      <div
                        id="delivery-payment"
                        className="collapse show"
                        data-bs-parent="#payment-box"
                      >
                        <div className="payment-body">
                          <p className="text-secondary">
                            Pay with cash when your order is delivered.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Commented out other payment methods for now */}
                    {/* <div className="payment-item payment-choose-card">
                      <label
                        htmlFor="credit-card-method"
                        className="payment-header collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#credit-card-payment"
                        aria-controls="credit-card-payment"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded"
                          id="credit-card-method"
                        />
                        <span className="text-title">Credit Card</span>
                      </label>
                      <div
                        id="credit-card-payment"
                        className="collapse"
                        data-bs-parent="#payment-box"
                      >
                        <div className="payment-body">
                          <p className="text-secondary">
                            Make your payment directly into our bank account.
                            Your order will not be shipped until the funds have
                            cleared in our account.
                          </p>
                          <div className="input-payment-box">
                            <input type="text" placeholder="Name On Card*" />
                            <div className="ip-card">
                              <input type="text" placeholder="Card Numbers*" />
                              <div className="list-card">
                                <Image
                                  width={48}
                                  height={16}
                                  alt="card"
                                  src="/images/payment/img-7.png"
                                />
                                <Image
                                  width={21}
                                  height={16}
                                  alt="card"
                                  src="/images/payment/img-8.png"
                                />
                                <Image
                                  width={22}
                                  height={16}
                                  alt="card"
                                  src="/images/payment/img-9.png"
                                />
                                <Image
                                  width={24}
                                  height={16}
                                  alt="card"
                                  src="/images/payment/img-10.png"
                                />
                              </div>
                            </div>
                            <div className="grid-2">
                              <input type="date" />
                              <input type="text" placeholder="CVV*" />
                            </div>
                          </div>
                          <div className="check-save">
                            <input
                              type="checkbox"
                              className="tf-check"
                              id="check-card"
                              defaultChecked
                            />
                            <label htmlFor="check-card">
                              Save Card Details
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-item">
                      <label
                        htmlFor="apple-method"
                        className="payment-header collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#apple-payment"
                        aria-controls="apple-payment"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded"
                          id="apple-method"
                        />
                        <span className="text-title apple-pay-title">
                          <Image
                            alt="apple"
                            src="/images/payment/applePay.png"
                            width={13}
                            height={18}
                          />
                          Apple Pay
                        </span>
                      </label>
                      <div
                        id="apple-payment"
                        className="collapse"
                        data-bs-parent="#payment-box"
                      />
                    </div>
                    <div className="payment-item paypal-item">
                      <label
                        htmlFor="paypal-method"
                        className="payment-header collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#paypal-method-payment"
                        aria-controls="paypal-method-payment"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded"
                          id="paypal-method"
                        />
                        <span className="paypal-title">
                          <Image
                            alt="apple"
                            src="/images/payment/paypal.png"
                            width={90}
                            height={23}
                          />
                        </span>
                      </label>
                      <div
                        id="paypal-method-payment"
                        className="collapse"
                        data-bs-parent="#payment-box"
                      />
                    </div> */}
                  </div>
                  <button 
                    className="tf-btn btn-reset" 
                    type="submit"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    style={{
                      opacity: isSubmitting ? 0.6 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-xl-1">
            <div className="line-separation" />
          </div>
          <div className="col-xl-5">
            <div className="flat-spacing flat-sidebar-checkout">
              <div className="sidebar-checkout-content">
                <h5 className="title">Shopping Cart</h5>
                <div className="list-product">
                  {cartProducts.map((item, i) => {
                    const productUrl = item.productSlug 
                      ? `/product/${item.productSlug}` 
                      : `/product-detail/${item.productId}`;
                    const itemTotal = (item.price || 0) * (item.quantity || 1);
                    
                    return (
                      <div key={item.cartItemId || i} className="item-product">
                      <Link
                          href={productUrl}
                        className="img-product"
                      >
                        <Image
                            alt={item.productTitle || 'Product'}
                            src={item.productImage || '/images/default-product.jpg'}
                          width={600}
                          height={800}
                        />
                      </Link>
                      <div className="content-box">
                        <div className="info">
                          <Link
                              href={productUrl}
                            className="name-product link text-title"
                          >
                              {item.productTitle || 'Product'}
                          </Link>
                            {(item.size || item.color) && (
                          <div className="variant text-caption-1 text-secondary">
                                {item.size && <span className="size">{item.size}</span>}
                                {item.size && item.color && <span>/</span>}
                                {item.color && <span className="color">{item.color}</span>}
                              </div>
                            )}
                          </div>
                          <div className="total-price text-button">
                            <span className="count">{item.quantity || 1}</span>X
                            <span className="price">{formatPrice(item.price || 0)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="sec-total-price">
                  <div className="top">
                    <div className="item d-flex align-items-center justify-content-between text-button">
                      <span>Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="item d-flex align-items-center justify-content-between text-button">
                      <span>Shipping</span>
                      <span>
                        {shippingCharge === 0 ? (
                          <span style={{ color: 'green' }}>Free</span>
                        ) : (
                          formatPrice(shippingCharge)
                        )}
                      </span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="item d-flex align-items-center justify-content-between text-button">
                        <span>Discounts</span>
                        <span style={{ color: 'green' }}>-{formatPrice(appliedDiscount)}</span>
                      </div>
                    )}
                  </div>
                  <div className="bottom">
                    <h5 className="d-flex justify-content-between">
                      <span>Total</span>
                      <span className="total-price-checkout">
                        {formatPrice(finalTotal)}
                      </span>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .delivery-charge-selection .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }
        @media (max-width: 768px) {
          .delivery-charge-selection .grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
