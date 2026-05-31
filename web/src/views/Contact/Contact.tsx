import type { JSX } from "react";
import ContactHero from "./sections/ContactHero";
import ContactInfoPanel from "./sections/ContactInfoPanel";
import ContactForm from "./sections/ContactForm";
import FaqTeaserBanner from "./sections/FaqTeaserBanner";

function Contact(): JSX.Element {
    return (
        <>
            <ContactHero />
            <div className="container">
                <div className="contact-grid">
                    <ContactInfoPanel />
                    <ContactForm />
                </div>
            </div>
            <FaqTeaserBanner />
        </>
    );
}

export default Contact;
