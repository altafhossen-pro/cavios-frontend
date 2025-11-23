import Footer from "@/components/footers/Footer";
import Header1 from "@/components/headers/Header1";

import ShopProducts from "@/components/products/ShopProducts";
import Link from "next/link";
import React from "react";

export default function ShopPage() {
    return (
        <>
            <Header1 />
            
            <ShopProducts />
            <Footer />
        </>
    );
}

