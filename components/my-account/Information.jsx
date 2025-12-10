"use client";
import React, { useState, useEffect } from "react";
import { useContextElement } from "@/context/Context";
import { updateProfile, changePassword } from "@/features/auth/api/authApi";

export default function Information() {
  const { user, setUserAndToken, isLoadingUser } = useContextElement();
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Password validation states
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSuccess, setPasswordSuccess] = useState("");
  
  // UI states
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");
  
  // Loading and messages
  const [loading, setLoading] = useState(false);
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Load user data on mount
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

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
  const toggleNewPassword = () => {
    setNewPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  // Real-time validation for new password
  const validateNewPassword = (value) => {
    if (!value) {
      return "";
    }
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  // Real-time validation for confirm password
  const validateConfirmPassword = (value) => {
    if (!value) {
      return "";
    }
    if (value !== newPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  // Handle new password change with validation
  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    
    // Validate new password
    const newPasswordError = validateNewPassword(value);
    setPasswordErrors((prev) => ({
      ...prev,
      newPassword: newPasswordError,
    }));

    // Re-validate confirm password if it has value
    if (confirmPassword) {
      const confirmPasswordError = validateConfirmPassword(confirmPassword);
      setPasswordErrors((prev) => ({
        ...prev,
        confirmPassword: confirmPasswordError,
      }));
    }
  };

  // Handle confirm password change with validation
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    // Validate confirm password
    const confirmPasswordError = validateConfirmPassword(value);
    setPasswordErrors((prev) => ({
      ...prev,
      confirmPassword: confirmPasswordError,
    }));
  };

  // Check if password form is valid
  const isPasswordFormValid = () => {
    return (
      currentPassword &&
      newPassword &&
      confirmPassword &&
      !passwordErrors.newPassword &&
      !passwordErrors.confirmPassword &&
      newPassword.length >= 6 &&
      newPassword === confirmPassword
    );
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!name) {
      setError("Name is required");
      return;
    }
    
    setUpdateProfileLoading(true);
    const response = await updateProfile({
      name,
      ...(phone && { phone }),
    });
    setUpdateProfileLoading(false);
    
    if (response.success && response.data) {
      setSuccess("Profile updated successfully!");
      // Update user in context
      setUserAndToken(response.data, null); // Token remains same
      // Clear form
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } else {
      setError(response.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validate all fields
    if (!currentPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        currentPassword: "Current password is required",
      }));
      return;
    }
    
    if (!newPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        newPassword: "New password is required",
      }));
      return;
    }
    
    if (!confirmPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        confirmPassword: "Please confirm your password",
      }));
      return;
    }
    
    // Check if form is valid
    if (!isPasswordFormValid()) {
      setError("Please fix the errors before submitting");
      setPasswordSuccess("");
      return;
    }
    
    setPasswordSuccess("");
    setChangePasswordLoading(true);
    const response = await changePassword(currentPassword, newPassword);
    setChangePasswordLoading(false);
    
    if (response.success) {
      setSuccess("Password changed successfully!");
      setPasswordSuccess("Password changed successfully!");
      // Clear password fields and errors
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setSuccess("");
        setPasswordSuccess("");
      }, 5000);
    } else {
      setError(response.message || "Failed to change password");
      setPasswordSuccess("");
      // If current password is wrong, show error
      if (response.message?.toLowerCase().includes("current password") || 
          response.message?.toLowerCase().includes("incorrect")) {
        setPasswordErrors((prev) => ({
          ...prev,
          currentPassword: response.message || "Current password is incorrect",
        }));
      }
    }
  };

  // Loading skeleton for information
  if (isLoadingUser) {
    return (
      <div className="my-account-content">
        <div className="account-details">
          <div className="account-info">
            <h5 className="title">Information</h5>
            <div className="cols mb_20">
              <fieldset>
                <div
                  className="skeleton-loader"
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '4px'
                  }}
                />
              </fieldset>
              <fieldset>
                <div
                  className="skeleton-loader"
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '4px'
                  }}
                />
              </fieldset>
            </div>
            <div className="cols mb_20">
              <fieldset>
                <div
                  className="skeleton-loader"
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '4px'
                  }}
                />
              </fieldset>
            </div>
          </div>
          <div className="button-submit">
            <div
              className="skeleton-loader"
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
        <div className="account-details" style={{ marginTop: '30px' }}>
          <div className="account-password">
            <h5 className="title">Change Password</h5>
            {[1, 2, 3].map((item) => (
              <fieldset key={item} className="position-relative password-item mb_20">
                <div
                  className="skeleton-loader"
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '4px'
                  }}
                />
              </fieldset>
            ))}
          </div>
          <div className="button-submit">
            <div
              className="skeleton-loader"
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `
            .skeleton-loader {
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: shimmer 1.5s infinite;
            }
            @keyframes shimmer {
              0% {
                background-position: -200% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
          `
        }} />
      </div>
    );
  }

  return (
    <div className="my-account-content">
      {/* Error/Success Messages */}
      {error && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#fee', 
          color: '#c33', 
          borderRadius: '4px', 
          marginBottom: '20px',
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
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {success}
        </div>
      )}

      <div className="account-details">
        <form
          onSubmit={handleUpdateProfile}
          className="form-account-details form-has-password"
          style={{ gap: '0px' }}
        >
          <div className="account-info">
            <h5 className="title">Information</h5>
            <div className="cols mb_20">
              <fieldset className="">
                <input
                  className=""
                  type="text"
                  placeholder="Full Name*"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={updateProfileLoading}
                  aria-required="true"
                  required
                />
              </fieldset>
              <fieldset className="">
                <input
                  className=""
                  type="email"
                  placeholder="Email address*"
                  name="email"
                  value={email}
                  disabled
                  aria-required="true"
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                />
              </fieldset>
            </div>
            <div className="cols" style={{ marginBottom: '0' }}>
              <fieldset className="" style={{ marginBottom: '0' }}>
                <input
                  className=""
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={updateProfileLoading}
                />
              </fieldset>
            </div>
          </div>
          <div className="button-submit" style={{ marginTop: '16px' }}>
            <button 
              className="tf-btn btn-fill" 
              type="submit"
              disabled={updateProfileLoading}
            >
              <span className="text text-button">
                {updateProfileLoading ? "Updating..." : "Update Account"}
              </span>
            </button>
          </div>
        </form>
      </div>

      <div className="account-details mt-5">
        <form
          onSubmit={handleChangePassword}
          className="form-account-details form-has-password"
          style={{ gap: '16px' }}
        >
          <div className="account-password">
            <h5 className="title">Change Password</h5>
            {passwordSuccess && (
              <div style={{
                padding: '12px',
                backgroundColor: '#d4edda',
                color: '#155724',
                borderRadius: '4px',
                marginBottom: '16px',
                fontSize: '14px',
                border: '1px solid #c3e6cb',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#155724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {passwordSuccess}
              </div>
            )}
            <fieldset className="position-relative password-item mb_20">
              <input
                className={`input-password ${passwordErrors.currentPassword ? 'error' : ''}`}
                type={passwordType}
                placeholder="Current Password*"
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (passwordErrors.currentPassword) {
                    setPasswordErrors((prev) => ({
                      ...prev,
                      currentPassword: "",
                    }));
                  }
                }}
                disabled={changePasswordLoading}
                aria-required="true"
                required
                style={{
                  borderColor: passwordErrors.currentPassword ? '#dc3545' : '',
                }}
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
              {passwordErrors.currentPassword && (
                <div style={{
                  color: '#dc3545',
                  fontSize: '12px',
                  marginTop: '4px',
                  marginLeft: '4px'
                }}>
                  {passwordErrors.currentPassword}
                </div>
              )}
            </fieldset>
            <fieldset className="position-relative password-item mb_20">
              <input
                className={`input-password ${passwordErrors.newPassword ? 'error' : ''}`}
                type={newPasswordType}
                placeholder="New Password*"
                name="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
                disabled={changePasswordLoading}
                aria-required="true"
                required
                style={{
                  borderColor: passwordErrors.newPassword ? '#dc3545' : (newPassword && !passwordErrors.newPassword ? '#28a745' : ''),
                }}
              />
              <span
                className={`toggle-password ${
                  !(newPasswordType === "text") ? "unshow" : ""
                }`}
                onClick={toggleNewPassword}
              >
                <i
                  className={`icon-eye-${
                    !(newPasswordType === "text") ? "hide" : "show"
                  }-line`}
                />
              </span>
              {passwordErrors.newPassword && (
                <div style={{
                  color: '#dc3545',
                  fontSize: '12px',
                  marginTop: '4px',
                  marginLeft: '4px'
                }}>
                  {passwordErrors.newPassword}
                </div>
              )}
              {newPassword && !passwordErrors.newPassword && (
                <div style={{
                  color: '#28a745',
                  fontSize: '12px',
                  marginTop: '4px',
                  marginLeft: '4px'
                }}>
                  ✓ Password is valid
                </div>
              )}
            </fieldset>
            <fieldset className="position-relative password-item" style={{ marginBottom: '0' }}>
              <input
                className={`input-password ${passwordErrors.confirmPassword ? 'error' : ''}`}
                type={confirmPasswordType}
                placeholder="Confirm Password*"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                disabled={changePasswordLoading}
                aria-required="true"
                required
                style={{
                  borderColor: passwordErrors.confirmPassword ? '#dc3545' : (confirmPassword && !passwordErrors.confirmPassword ? '#28a745' : ''),
                }}
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
              {passwordErrors.confirmPassword && (
                <div style={{
                  color: '#dc3545',
                  fontSize: '12px',
                  marginTop: '4px',
                  marginLeft: '4px'
                }}>
                  {passwordErrors.confirmPassword}
                </div>
              )}
              {confirmPassword && !passwordErrors.confirmPassword && newPassword === confirmPassword && (
                <div style={{
                  color: '#28a745',
                  fontSize: '12px',
                  marginTop: '4px',
                  marginLeft: '4px'
                }}>
                  ✓ Passwords match
                </div>
              )}
            </fieldset>
          </div>
          <div className="button-submit" style={{ marginTop: '16px' }}>
            <button 
              className="tf-btn btn-fill" 
              type="submit"
              disabled={changePasswordLoading || !isPasswordFormValid()}
              style={{
                opacity: changePasswordLoading || !isPasswordFormValid() ? 0.6 : 1,
                cursor: changePasswordLoading || !isPasswordFormValid() ? 'not-allowed' : 'pointer'
              }}
            >
              <span className="text text-button">
                {changePasswordLoading ? "Changing..." : "Change Password"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}