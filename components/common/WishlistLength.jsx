"use client";

import { useContextElement } from "@/context/Context";

export default function WishlistLength() {
  const { wishList } = useContextElement();
  const count = wishList?.length || 0;
  
  if (count === 0) {
    return null;
  }
  
  return <>{count}</>;
}

