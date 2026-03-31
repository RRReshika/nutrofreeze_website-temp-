import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Products } from "../components/Products";
import { DietaryShowcase } from "../components/DietaryShowcase";
import { OurStory } from "../components/OurStory";
import { Recipes } from "../components/Recipes";
import { NewsSection } from "../components/NewsSection";
import { SocialMedia } from "../components/SocialMedia";
import { Newsletter } from "../components/Newsletter";
import { Footer } from "../components/Footer";

export function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <Hero />
      <Products />
      <DietaryShowcase />
      <OurStory />
      <Recipes />
      <NewsSection />
      <SocialMedia />
      <Newsletter />
      <Footer />
    </div>
  );
}