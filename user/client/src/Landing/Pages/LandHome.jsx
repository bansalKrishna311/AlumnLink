import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "../Components/Hero";
import WhatIsAlumnLink from "../Components/WhatIsAlumnLink";
import WhosItFor from "../Components/WhosItFor";
import WhyInstitutionsLoveUs from "../Components/WhyInstitutionsLoveUs";
import WhyYouLoveUs from "../Components/WhyYouLoveUs";
import ObviousChoice from "../Components/ObviousChoice";
import HowItWorks from "../Components/HowItWorks";
import Benefits from "../Components/Benefits";
import Pricing from "../Components/Pricing";
import FAQSection from "../Components/FAQSection";
import CallToAction from "../Components/CallToAction";
import FeatureGrid from "../Components/FeatureGrid";
import Testimonials from "../Components/TestimonialsClean";
import AlumnGPT from "../Components/AlumnGPT";


const LandHome = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative bg-gradient-to-br from-white via-[#fff8f5] to-[#ffe8de] overflow-hidden min-h-screen"
      >
        {/* Abstract shapes */}
        <div className="fixed top-20 right-0 w-96 h-96 bg-gradient-to-br from-[#fe6019]/20 to-[#fe6019]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="fixed -bottom-32 -left-40 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="fixed top-1/2 -left-20 w-72 h-72 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
        
        <motion.div 
          className="relative z-10"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {/* Hero section */}
          <Hero />

          {/* What is AlumnLink section */}
          <WhatIsAlumnLink />

          {/* Who's it For section */}
          <WhosItFor />

          {/* Why Institutions Love Us section */}
          <WhyInstitutionsLoveUs />

          {/* Why You'll Love Us section */}
          <WhyYouLoveUs />

          {/* What Makes AlumnLink the Obvious Choice section */}
          <ObviousChoice />

          {/* How it works section */}
          {/* <HowItWorks /> */}

          {/* Feature Grid section */}
          {/* <FeatureGrid /> */}

          {/* Benefits / Why Choose Us */}
          {/* <Benefits /> */}

          {/* Testimonials section */}
          {/* <Testimonials /> */}

          {/* Pricing section */}
          {/* <Pricing /> */}

          {/* FAQ Section */}
          {/* <FAQSection /> */}

          {/* Final CTA */}
          {/* <CallToAction
            title="Ready to transform your alumni network?"
            description="Join institutions across India who are building stronger alumni communities with AlumnLink."
            primaryButtonText="Schedule Demo"
            primaryButtonLink="/landing/contact"
            secondaryButtonText="Learn More"
            secondaryButtonLink="/landing/about"
          /> */}

      
        </motion.div>

        {/* AlumnGPT Chatbot */}
        <AlumnGPT />

        {/* Custom styles for animation */}
        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default LandHome;