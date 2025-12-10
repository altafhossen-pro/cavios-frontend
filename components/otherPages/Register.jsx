"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { sendRegisterOTP, verifyRegisterOTPOnly, verifyRegisterOTPAndCreateAccount } from "@/features/auth/api/otpApi";

export default function Register() {
  const router = useRouter();
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  
  // Form states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  
  // UI states
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // OTP timer
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const togglePassword = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  const toggleConfirmPassword = () => {
    setConfirmPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!email) {
      setError("Email is required");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    const response = await sendRegisterOTP(email);
    setLoading(false);
    
    if (response.success) {
      setSuccess("OTP sent successfully to your email");
      setCurrentStep(2);
      // Start timer (assuming 5 minutes expiry)
      setOtpTimer(300); // 5 minutes in seconds
      setCanResend(false);
    } else {
      setError(response.message || "Failed to send OTP");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    
    setLoading(true);
    const response = await verifyRegisterOTPOnly(email, otp);
    setLoading(false);
    
    if (response.success) {
      setSuccess("OTP verified successfully");
      setCurrentStep(3);
    } else {
      setError(response.message || "Invalid or expired OTP");
    }
  };

  // Step 3: Create Account
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validation
    if (!name || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    const registrationData = {
      email,
      otp,
      name,
      password,
      ...(phone && phone.trim() && { phone: phone.trim() })
    };
    
    const response = await verifyRegisterOTPAndCreateAccount(registrationData);
    setLoading(false);
    
    if (response.success && response.data) {
      // Store token in cookie
      if (response.data.token) {
        document.cookie = `token=${response.data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      }
      
      setSuccess("Account created successfully!");
      // Redirect to home or dashboard after 1 second
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      setError(response.message || "Failed to create account");
    }
  };

  // OTP Timer - using useEffect to handle timer
  const timerRef = useRef(null);
  
  useEffect(() => {
    if (otpTimer > 0 && currentStep === 2) {
      timerRef.current = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [otpTimer, currentStep]);

  // Resend OTP
  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setError("");
    setLoading(true);
    const response = await sendRegisterOTP(email);
    setLoading(false);
    
    if (response.success) {
      setSuccess("OTP resent successfully");
      setOtpTimer(300);
      setCanResend(false);
    } else {
      setError(response.message || "Failed to resend OTP");
    }
  };

  // Format timer
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="login-wrap">
          <div className="left">
            <div className="heading">
              <h4>Register</h4>
              {/* Step Indicator */}
              <div className="step-indicator" style={{ display: 'flex', gap: '10px', marginTop: '15px', marginBottom: '20px' }}>
                <div style={{ 
                  flex: 1, 
                  height: '4px', 
                  backgroundColor: currentStep >= 1 ? '#007bff' : '#e0e0e0',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease'
                }}></div>
                <div style={{ 
                  flex: 1, 
                  height: '4px', 
                  backgroundColor: currentStep >= 2 ? '#007bff' : '#e0e0e0',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease'
                }}></div>
                <div style={{ 
                  flex: 1, 
                  height: '4px', 
                  backgroundColor: currentStep >= 3 ? '#007bff' : '#e0e0e0',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease'
                }}></div>
              </div>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                Step {currentStep} of 3
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#fee', 
                color: '#c33', 
                borderRadius: '4px', 
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#efe', 
                color: '#3c3', 
                borderRadius: '4px', 
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                {success}
              </div>
            )}

            {/* Step 1: Email */}
            {currentStep === 1 && (
              <form
                onSubmit={handleSendOTP}
                className="form-login"
              >
                <div className="wrap">
                  <fieldset>
                    <input
                      type="email"
                      placeholder="Email address*"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </fieldset>
                </div>
                <div className="button-submit">
                  <button 
                    className="tf-btn btn-fill" 
                    type="submit"
                    disabled={loading}
                  >
                    <span className="text text-button">
                      {loading ? "Sending..." : "Send OTP"}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 2 && (
              <form
                onSubmit={handleVerifyOTP}
                className="form-login"
              >
                <div className="wrap">
                  <fieldset>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP*"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(value);
                      }}
                      maxLength={6}
                      disabled={loading}
                      required
                      style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '18px', fontWeight: 'bold' }}
                    />
                  </fieldset>
                  <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    OTP sent to: <strong>{email}</strong>
                  </div>
                  {otpTimer > 0 && (
                    <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                      Resend OTP in: <strong>{formatTimer(otpTimer)}</strong>
                    </div>
                  )}
                  {canResend && otpTimer === 0 && (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading}
                      style={{
                        marginTop: '10px',
                        background: 'none',
                        border: 'none',
                        color: '#007bff',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: '14px'
                      }}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
                <div className="button-submit">
                  <button 
                    className="tf-btn btn-fill" 
                    type="submit"
                    disabled={loading || otp.length !== 6}
                  >
                    <span className="text text-button">
                      {loading ? "Verifying..." : "Verify OTP"}
                    </span>
                  </button>
                </div>
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      setOtp("");
                      setError("");
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '14px',
                      textDecoration: 'underline'
                    }}
                  >
                    Change Email
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Password & Details */}
            {currentStep === 3 && (
              <form
                onSubmit={handleRegister}
                className="form-login form-has-password"
              >
                <div className="wrap">
                  <fieldset>
                    <input
                      type="text"
                      placeholder="Full Name*"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </fieldset>
                  <fieldset className="position-relative password-item">
                    <input
                      className="input-password"
                      type={passwordType}
                      placeholder="Password*"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                    <span
                      className={`toggle-password ${
                        !(passwordType === "text") ? "unshow" : ""
                      }`}
                      onClick={togglePassword}
                    >
                      <i
                        className={`icon-eye-${
                          !(passwordType === "text") ? "hide" : "show"
                        }-line`}
                      />
                    </span>
                  </fieldset>
                  <fieldset className="position-relative password-item">
                    <input
                      className="input-password"
                      type={confirmPasswordType}
                      placeholder="Confirm Password*"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                    <span
                      className={`toggle-password ${
                        !(confirmPasswordType === "text") ? "unshow" : ""
                      }`}
                      onClick={toggleConfirmPassword}
                    >
                      <i
                        className={`icon-eye-${
                          !(confirmPasswordType === "text") ? "hide" : "show"
                        }-line`}
                      />
                    </span>
                  </fieldset>
                  <fieldset>
                    <input
                      type="tel"
                      placeholder="Phone Number (Optional)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={loading}
                    />
                  </fieldset>
                  <div className="d-flex align-items-center">
                    <div className="tf-cart-checkbox">
                      <div className="tf-checkbox-wrapp">
                        <input
                          defaultChecked
                          className=""
                          type="checkbox"
                          id="login-form_agree"
                          name="agree_checkbox"
                        />
                        <div>
                          <i className="icon-check" />
                        </div>
                      </div>
                      <label
                        className="text-secondary-2"
                        htmlFor="login-form_agree"
                      >
                        I agree to the&nbsp;
                      </label>
                    </div>
                    <Link href={`/term-of-use`} title="Terms of Service">
                      Terms of User
                    </Link>
                  </div>
                </div>
                <div className="button-submit">
                  <button 
                    className="tf-btn btn-fill" 
                    type="submit"
                    disabled={loading}
                  >
                    <span className="text text-button">
                      {loading ? "Creating Account..." : "Register"}
                    </span>
                  </button>
                </div>
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(2);
                      setError("");
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '14px',
                      textDecoration: 'underline'
                    }}
                  >
                    Back to OTP Verification
                  </button>
                </div>
              </form>
            )}
          </div>
          <div className="right">
            <h4 className="mb_8">Already have an account?</h4>
            <p className="text-secondary">
              Welcome back. Sign in to access your personalized experience,
              saved preferences, and more. We're thrilled to have you with us
              again!
            </p>
            <Link href={`/login`} className="tf-btn btn-fill">
              <span className="text text-button">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
