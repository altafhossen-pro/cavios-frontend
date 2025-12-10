"use client";
import { allProducts } from "@/data/products";
import { openCartModal } from "@/utlis/openCartModal";
import { openWistlistModal } from "@/utlis/openWishlist";
import {
  getCartItems,
  addToCart as addToCartUtil,
  removeFromCart as removeFromCartUtil,
  updateCartQuantity as updateCartQuantityUtil,
  clearCart as clearCartUtil,
  getCartTotal,
  getCartItemsCount,
  isVariantInCart,
  getCartItem as getCartItemUtil,
} from "@/utils/cart";
import {
  getWishlistItems,
  addToWishlist as addToWishlistUtil,
  removeFromWishlist as removeFromWishlistUtil,
  isInWishlist as isInWishlistUtil,
  toggleWishlist as toggleWishlistUtil,
  getWishlistCount,
  clearWishlist as clearWishlistUtil,
} from "@/utils/wishlist";
import { getDeliveryChargeSettings } from "@/features/settings/api/settingsApi";
import { getProfile, logout as logoutApi } from "@/features/auth/api/authApi";

import React, { useEffect } from "react";
import { useContext, useState } from "react";
const dataContext = React.createContext();
export const useContextElement = () => {
  return useContext(dataContext);
};

export default function Context({ children }) {
  // Load cart from localStorage on mount
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [compareItem, setCompareItem] = useState([1, 2, 3]);
  const [quickViewItem, setQuickViewItem] = useState(allProducts[0]);
  const [quickViewItem2, setQuickViewItem2] = useState(null);
  const [quickAddItem, setQuickAddItem] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  
  // Delivery charge settings state - null until loaded from API
  const [deliveryChargeSettings, setDeliveryChargeSettings] = useState(null);
  
  // User authentication state
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const items = getCartItems();
    setCartProducts(items);
    setTotalPrice(getCartTotal());
    setCartItemsCount(getCartItemsCount());
  }, []);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const items = getWishlistItems();
    setWishList(items);
  }, []);

  // Load user from token on initial mount
  useEffect(() => {
    const loadUserFromToken = async () => {
      setIsLoadingUser(true);
      try {
        // Check if token exists in cookie
        if (typeof document !== 'undefined') {
          const cookies = document.cookie.split(';');
          const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith('token='));
          
          if (tokenCookie) {
            // Token exists, fetch user profile
            const response = await getProfile();
            if (response.success && response.data) {
              setUser(response.data);
            } else {
              // Token is invalid, clear it
              logoutApi();
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        logoutApi();
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUserFromToken();
  }, []);

  // Load delivery charge settings on initial mount
  useEffect(() => {
    const loadDeliveryChargeSettings = async () => {
      try {
        const response = await getDeliveryChargeSettings();
        if (response.success && response.data) {
          setDeliveryChargeSettings(response.data);
        }
      } catch (error) {
        console.error('Error loading delivery charge settings:', error);
        // Keep null on error - must come from API
      }
    };

    loadDeliveryChargeSettings();
  }, []);

  // Update total price and count when cart changes
  useEffect(() => {
    setTotalPrice(getCartTotal());
    setCartItemsCount(getCartItemsCount());
  }, [cartProducts]);

  /**
   * Add variant to cart
   * @param {Object} variantData - Variant data including product info and variant details
   * @param {boolean} isModal - Whether to open cart modal after adding
   */
  const addVariantToCart = (variantData, isModal = true) => {
    const updatedItems = addToCartUtil(variantData);
    setCartProducts(updatedItems);
    if (isModal) {
      openCartModal();
    }
  };

  /**
   * Remove item from cart
   * @param {string} cartItemId - Cart item ID
   */
  const removeCartItem = (cartItemId) => {
    const updatedItems = removeFromCartUtil(cartItemId);
    setCartProducts(updatedItems);
  };

  /**
   * Update quantity of a cart item
   * @param {string} cartItemId - Cart item ID
   * @param {number} quantity - New quantity
   */
  const updateQuantity = (cartItemId, quantity) => {
    const updatedItems = updateCartQuantityUtil(cartItemId, quantity);
    setCartProducts(updatedItems);
  };

  /**
   * Clear all items from cart
   */
  const clearCart = () => {
    clearCartUtil();
    setCartProducts([]);
  };

  /**
   * Check if a variant is in cart
   * @param {string} productId - Product ID
   * @param {string} variantSku - Variant SKU
   * @returns {boolean}
   */
  const isVariantAddedToCart = (productId, variantSku) => {
    return isVariantInCart(productId, variantSku);
  };

  /**
   * Get cart item by cart item ID
   * @param {string} cartItemId - Cart item ID
   * @returns {Object|null}
   */
  const getCartItem = (cartItemId) => {
    return getCartItemUtil(cartItemId);
  };

  // Legacy function for backward compatibility (deprecated - use addVariantToCart instead)
  const isAddedToCartProducts = (id) => {
    // Check if any variant of this product is in cart
    return cartProducts.some(item => item.productId === id || item.productId === String(id));
  };

  // Legacy function for backward compatibility (deprecated - use addVariantToCart instead)
  const addProductToCart = (id, qty, isModal = true) => {
    // This is a fallback for old components that don't use variants
    // Try to find product and use first variant
    const product = allProducts.find((elm) => elm.id == id);
    if (product && product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      const sizeAttr = firstVariant.attributes?.find(attr => attr.name.toLowerCase() === 'size');
      const colorAttr = firstVariant.attributes?.find(attr => attr.name.toLowerCase() === 'color');
      
      addVariantToCart({
        productId: String(product.id || id),
        productSlug: product.slug || '',
        productTitle: product.title || '',
        productImage: product.imgSrc || product.featuredImage || '',
        variantSku: firstVariant.sku || `${id}_default`,
        size: sizeAttr?.value || '',
        color: colorAttr?.value || colorAttr?.displayValue || '',
        colorHexCode: colorAttr?.hexCode || '',
        price: firstVariant.currentPrice || product.price || 0,
        originalPrice: firstVariant.originalPrice || product.oldPrice || null,
        quantity: qty || 1,
        stockQuantity: firstVariant.stockQuantity || null,
      }, isModal);
    }
  };

  /**
   * Add product to wishlist
   * @param {string|number} id - Product ID
   * @param {boolean} showModal - Whether to show wishlist modal (default: true)
   */
  const addToWishlist = (id, showModal = true) => {
    if (!id) {
      console.error('addToWishlist: id is required');
      return;
    }
    
    // Check if already in wishlist before adding
    const isAlreadyInWishlist = isInWishlistUtil(id);
    
    if (!isAlreadyInWishlist) {
      const updatedItems = addToWishlistUtil(id);
      setWishList(updatedItems);
      
      if (showModal) {
        openWistlistModal();
      }
    }
  };

  /**
   * Remove product from wishlist
   * @param {string|number} id - Product ID
   */
  const removeFromWishlist = (id) => {
    if (!id) {
      console.error('removeFromWishlist: id is required');
      return;
    }
    
    const updatedItems = removeFromWishlistUtil(id);
    setWishList(updatedItems);
  };

  /**
   * Toggle product in wishlist (add if not present, remove if present)
   * @param {string|number} id - Product ID
   * @param {boolean} showModal - Whether to show wishlist modal when adding (default: true)
   * @returns {boolean} True if added, false if removed
   */
  const toggleWishlist = (id, showModal = true) => {
    if (!id) {
      console.error('toggleWishlist: id is required');
      return false;
    }
    
    const { isAdded, items } = toggleWishlistUtil(id);
    setWishList(items);
    
    if (isAdded && showModal) {
      openWistlistModal();
    }
    
    return isAdded;
  };
  const addToCompareItem = (id) => {
    if (!compareItem.includes(id)) {
      setCompareItem((pre) => [...pre, id]);
    }
  };
  const removeFromCompareItem = (id) => {
    if (compareItem.includes(id)) {
      setCompareItem((pre) => [...pre.filter((elm) => elm != id)]);
    }
  };
  /**
   * Check if product is in wishlist
   * @param {string|number} id - Product ID
   * @returns {boolean} True if product is in wishlist
   */
  const isAddedtoWishlist = (id) => {
    if (!id) return false;
    return isInWishlistUtil(id);
  };
  const isAddedtoCompareItem = (id) => {
    if (compareItem.includes(id)) {
      return true;
    }
    return false;
  };
  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    // Cart is already saved in cart.js utility functions
    // This effect ensures state is in sync
  }, [cartProducts]);
  // Sync wishlist to localStorage whenever it changes
  useEffect(() => {
    // Wishlist is already saved in wishlist.js utility functions
    // This effect ensures state is in sync
  }, [wishList]);

  /**
   * Set user after login
   * @param {Object} userData - User data from login response
   * @param {string} token - JWT token
   */
  const setUserAndToken = (userData, token) => {
    setUser(userData);
    // Store token in cookie
    if (typeof document !== 'undefined' && token) {
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    }
  };

  /**
   * Logout user
   */
  const logoutUser = () => {
    logoutApi();
    setUser(null);
  };

  const contextElement = {
    // Cart state
    cartProducts,
    setCartProducts,
    totalPrice,
    cartItemsCount,
    
    // Cart functions (new variant-based)
    addVariantToCart,
    removeCartItem,
    updateQuantity,
    clearCart,
    isVariantAddedToCart,
    
    // Legacy cart functions (for backward compatibility)
    addProductToCart,
    isAddedToCartProducts,
    
    // Wishlist
    removeFromWishlist,
    addToWishlist,
    toggleWishlist,
    isAddedtoWishlist,
    wishList,
    
    // Quick View
    quickViewItem,
    setQuickViewItem,
    quickViewItem2,
    setQuickViewItem2,
    quickAddItem,
    setQuickAddItem,
    
    // Compare
    addToCompareItem,
    isAddedtoCompareItem,
    removeFromCompareItem,
    compareItem,
    setCompareItem,
    
    // Delivery Charge Settings
    deliveryChargeSettings,
    
    // User Authentication
    user,
    setUserAndToken,
    logoutUser,
    isLoadingUser,
  };
  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
