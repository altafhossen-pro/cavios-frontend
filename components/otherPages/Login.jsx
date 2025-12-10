"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/features/auth/api/authApi";
import { useContextElement } from "@/context/Context";

export default function Login() {
  const router = useRouter();
  const { setUserAndToken } = useContextElement();
  
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const togglePassword = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!emailOrPhone || !password) {
      setError("Email/Phone and password are required");
      return;
    }
    
    setLoading(true);
    const response = await login(emailOrPhone, password);
    setLoading(false);
    
    if (response.success && response.data) {
      const { user, token } = response.data;
      
      // Set user and token in global state
      setUserAndToken(user, token);
      
      setSuccess("Login successful!");
      
      // Redirect to home page after 1 second
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      setError(response.message || "Invalid credentials");
    }
  };

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="login-wrap">
          <div className="left">
            <div className="heading">
              <h4>Login</h4>
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

            <form
              onSubmit={handleLogin}
              className="form-login form-has-password"
            >
              <div className="wrap">
                <fieldset className="">
                  <input
                    className=""
                    type="text"
                    placeholder="Email or Phone Number*"
                    name="emailOrPhone"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    disabled={loading}
                    aria-required="true"
                    required
                  />
                </fieldset>
                <fieldset className="position-relative password-item">
                  <input
                    className="input-password"
                    type={passwordType}
                    placeholder="Password*"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    aria-required="true"
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
                <div className="d-flex align-items-center justify-content-between">
                  <div className="tf-cart-checkbox">
                    <div className="tf-checkbox-wrapp">
                      <input
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className=""
                        type="checkbox"
                        id="login-form_agree"
                        name="agree_checkbox"
                      />
                      <div>
                        <i className="icon-check" />
                      </div>
                    </div>
                    <label htmlFor="login-form_agree"> Remember me </label>
                  </div>
                  <Link
                    href={`/forget-password`}
                    className="font-2 text-button forget-password link"
                  >
                    Forgot Your Password?
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
                    {loading ? "Logging in..." : "Login"}
                  </span>
                </button>
              </div>
            </form>
          </div>
          <div className="right">
            <h4 className="mb_8">New Customer</h4>
            <p className="text-secondary">
              Be part of our growing family of new customers! Join us today and
              unlock a world of exclusive benefits, offers, and personalized
              experiences.
            </p>
            <Link href={`/register`} className="tf-btn btn-fill">
              <span className="text text-button">Register</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
