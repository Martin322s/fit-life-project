import type { JSX } from "react";
import HeroSection from "../../components/HomeSections/HeroSection";
import FeaturesSection from "../../components/HomeSections/FeaturesSection";
import HowItWorksSection from "../../components/HomeSections/HowItWorksSection";
import TestimonialsSection from "../../components/HomeSections/TestimonialsSection";
import CTABanner from "../../components/HomeSections/CTABannerSection";

function Home(): JSX.Element {
    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <CTABanner />
        </>
    )
}

export default Home;