import type { JSX } from "react";
import Hero from "./sections/Hero";
import StatsBand from "./sections/StatsBand";
import Mission from "./sections/Mission";
import Team from "./sections/Team";
import StoryTimeline from "./sections/StoryTimeline";
import CTABanner from "../../components/CTABanner";

function About(): JSX.Element {
    return (
        <>
            <Hero />
            <StatsBand />
            <Mission />
            <Team />
            <StoryTimeline />
            <CTABanner />
        </>
    );
}

export default About;