import MarketingLayout from "../../components/global/MarketingLayout";
import HeroSection from "./sections/HeroSection";
import SearchBlockSection from "./sections/SearchBlockSection";
import WhyAnyHomesSection from "./sections/WhyAnyHomesSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import PersonaSection from "./sections/PersonaSection";
import WhyDirectorySection from "./sections/WhyDirectorySection";
import FaqCarouselSection from "./sections/FaqCarouselSection";
import LearningCenterSection from "./sections/LearningCenterSection";
import PreconfiguredSearchesSection from "./sections/PreconfiguredSearchesSection";

/**
 * HomeMarketing — vitrine publique AnyHomes (route `/`).
 *
 * Composée de 9 sections (le footer fait partie de MarketingLayout) :
 *  1. Hero
 *  2. Search block
 *  3. Why AnyHomes
 *  4. How it works
 *  5. Persona
 *  6. Why directory
 *  7. FAQ carousel
 *  8. Learning center
 *  9. Preconfigured searches
 *
 * Données mock pour FAQ et Learning center : à brancher au backend en Phase 4.
 */
const HomeMarketing = () => {
  return (
    <MarketingLayout>
      <HeroSection />
      <SearchBlockSection />
      <WhyAnyHomesSection />
      <HowItWorksSection />
      <PersonaSection />
      <WhyDirectorySection />
      <FaqCarouselSection />
      <LearningCenterSection />
      <PreconfiguredSearchesSection />
    </MarketingLayout>
  );
};

export default HomeMarketing;
