import type { JSX } from "react";
import HeroSection from "./sections/Hero";
import FeaturesSection from "./sections/Features";
import HowItWorksSection from "./sections/HowItWorks";
import TestimonialsSection from "./sections/Testimonials";
import CTABanner from "./sections/CTABanner";

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