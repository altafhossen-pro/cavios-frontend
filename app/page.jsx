import Footer from "@/components/footers/Footer";
import Header1 from "@/components/headers/Header1";
import MainHeader from "@/components/headers/MainHeader";
import BannerCollection from "@/components/homes/home-1/BannerCollection";
import BannerCountdown from "@/components/homes/home-1/BannerCountdown";
import Blogs from "@/components/common/Blogs";
import Collections from "@/components/homes/home-1/Collections";
import Features from "@/components/common/Features";
import Hero from "@/components/homes/home-1/Hero";
import Products from "@/components/common/Products3";
import Products4 from "@/components/common/Products4";
import ShopGram from "@/components/common/ShopGram";
import Testimonials from "@/components/common/Testimonials";

export const metadata = {
  title: "Home || Cavios",
  description: "Cavios",
};

export default function HomePage() {
  return (
    <>
      {/* <Header1 /> */}
      <MainHeader />
      <Hero />
      <Collections />
      {/* <Products /> */}
      <Products4 />
      {/* <BannerCollection /> */}
      {/* <BannerCountdown /> */}
      <Testimonials />
      {/* <Blogs /> */}
      {/* <ShopGram /> */}
      <Features />
      <Footer />
    </>
  );
}
