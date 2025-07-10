import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import BuyerStories from "../components/BuyerStories";
import Pricing from "../components/Pricing";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className=" bg-black w-full">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <BuyerStories />
      <Pricing />
    </div>
  );
}
