"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContextElement } from "@/context/Context";
import { uploadProfilePicture } from "@/features/auth/api/authApi";

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logoutUser, isLoadingUser, setUserAndToken } = useContextElement();
  
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file");
        setTimeout(() => setError(""), 3000);
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        setTimeout(() => setError(""), 3000);
        return;
      }
      
      // Upload immediately after selection
      handleUploadProfilePicture(file);
    }
  };

  const handleUploadProfilePicture = async (file) => {
    if (!file) {
      setError("Please select an image file");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    setError("");
    setSuccess("");
    setUploadingPicture(true);
    
    const response = await uploadProfilePicture(file);
    setUploadingPicture(false);
    
    if (response.success) {
      setSuccess("Profile picture uploaded successfully!");
      // Update user in context with new avatar
      if (response.data && response.data.avatar) {
        const updatedUser = {
          ...user,
          avatar: response.data.avatar,
          profilePicture: response.data.avatar,
        };
        setUserAndToken(updatedUser, null);
      }
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } else {
      setError(response.message || "Failed to upload profile picture");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  // Loading skeleton for sidebar
  if (isLoadingUser) {
    return (
      <div className="wrap-sidebar-account">
        <div className="sidebar-account">
          <div className="account-avatar">
            <div className="image">
              <div
                className="skeleton-loader"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%'
                }}
              />
            </div>
            <h6 className="mb_4">
              <div
                className="skeleton-loader"
                style={{
                  width: '120px',
                  height: '20px',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}
              />
            </h6>
            <div className="body-text-1">
              <div
                className="skeleton-loader"
                style={{
                  width: '150px',
                  height: '16px',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
          <ul className="my-account-nav">
            {[1, 2, 3, 4].map((item) => (
              <li key={item}>
                <div
                  className="skeleton-loader"
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '4px',
                    marginBottom: '8px'
                  }}
                />
              </li>
            ))}
          </ul>
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
    <div className="wrap-sidebar-account">
      <div className="sidebar-account">
        {/* Error/Success Messages */}
        {error && (
          <div style={{ 
            padding: '8px 12px', 
            backgroundColor: '#fee', 
            color: '#c33', 
            borderRadius: '4px', 
            marginBottom: '15px',
            fontSize: '13px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ 
            padding: '8px 12px', 
            backgroundColor: '#efe', 
            color: '#3c3', 
            borderRadius: '4px', 
            marginBottom: '15px',
            fontSize: '13px',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}
        
        <div className="account-avatar">
          <div className="image" style={{ 
            position: 'relative', 
            overflow: 'unset !important', 
            borderRadius: '50%',
            width: '120px',
            height: '120px',
            aspectRatio: '1/1',
            margin: '0 auto'
          }}>
            <Image
              alt=""
              src={user?.avatar || user?.profilePicture || "/images/avatar/user-account.jpg"}
              width={120}
              height={120}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
            {/* Camera Icon Overlay */}
            <div
              onClick={handleCameraClick}
              style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: uploadingPicture ? 'not-allowed' : 'pointer',
                opacity: uploadingPicture ? 0.5 : 1,
                transition: 'all 0.3s ease',
                zIndex: 200
              }}
              onMouseEnter={(e) => {
                if (!uploadingPicture) {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                  e.target.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 4H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploadingPicture}
              style={{ display: 'none' }}
            />
            
            {/* Loading overlay */}
            {uploadingPicture && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  zIndex: 5
                }}
              >
                <div style={{ color: 'white', fontSize: '14px' }}>Uploading...</div>
              </div>
            )}
          </div>
          <h6 className="mb_4">{user?.name || 'User'}</h6>
          <div className="body-text-1">{user?.email || user?.phone || ''}</div>
        </div>
        <ul className="my-account-nav">
          <li>
            <Link
              href={`/my-account`}
              className={`my-account-nav-item ${
                pathname == "/my-account" ? "active" : ""
              } `}
            >
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  stroke="#181818"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                  stroke="#181818"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Account Details
            </Link>
          </li>
          <li>
            <Link
              href={`/my-account-orders`}
              className={`my-account-nav-item ${
                pathname == "/my-account-orders" ? "active" : ""
              } `}
            >
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5078 10.8734V6.36686C16.5078 5.17166 16.033 4.02541 15.1879 3.18028C14.3428 2.33514 13.1965 1.86035 12.0013 1.86035C10.8061 1.86035 9.65985 2.33514 8.81472 3.18028C7.96958 4.02541 7.49479 5.17166 7.49479 6.36686V10.8734M4.11491 8.62012H19.8877L21.0143 22.1396H2.98828L4.11491 8.62012Z"
                  stroke="#181818"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Your Orders
            </Link>
          </li>
          {/* My Address - Commented out as not needed */}
          {/* <li>
            <Link
              href={`/my-account-address`}
              className={`my-account-nav-item ${
                pathname == "/my-account-address" ? "active" : ""
              } `}
            >
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                  stroke="#181818"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                  stroke="#181818"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              My Address
            </Link>
          </li> */}
          <li className="mt-4">
            <button
              onClick={handleLogout}
              className="my-account-nav-item logout-btn"
              style={{
                background: '#dc3545',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#ffffff',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}
            >
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                  stroke="#ffffff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 17L21 12L16 7"
                  stroke="#ffffff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12H9"
                  stroke="#ffffff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Logout
            </button>
          </li>
        </ul>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          .sidebar-account .my-account-nav .logout-btn {
            transition: background-color 0.3s ease;
            border-radius: 8px;
            justify-content: left !important;
            background-color: #dc3545 !important;
            color: #ffffff !important;
          }
          .sidebar-account .my-account-nav .logout-btn:hover {
            background-color: #c82333 !important;
          }
          .sidebar-account .my-account-nav .logout-btn svg path {
            stroke: #ffffff !important;
          }
        `
      }} />
    </div>
  );
}
