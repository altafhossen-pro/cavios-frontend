/**
 * Custom Hook for Wishlist Management
 * Provides easy access to wishlist functions from Context
 * Can be used in any component
 * 
 * @example
 * const { addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, wishlistItems } = useWishlist();
 */
import { useContextElement } from "@/context/Context";

export const useWishlist = () => {
  const {
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isAddedtoWishlist,
    wishList,
  } = useContextElement();

  return {
    // Functions
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist: isAddedtoWishlist,
    
    // State
    wishlistItems: wishList,
    wishlistCount: wishList.length,
    
    // Helper functions
    isInWishlistById: (id) => isAddedtoWishlist(id),
  };
};

export default useWishlist;

