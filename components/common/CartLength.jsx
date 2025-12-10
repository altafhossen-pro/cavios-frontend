"use client";

import { useContextElement } from "@/context/Context";

export default function CartLength() {
  const { cartItemsCount } = useContextElement();
  return <>{cartItemsCount || 0}</>;
}
