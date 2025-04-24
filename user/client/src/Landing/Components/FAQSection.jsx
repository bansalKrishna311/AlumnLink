import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';
import FAQ from './FAQ';

const FAQSection = () => {
  // FAQ questions and answers
  const faqs = [
    {
      question: "How long does it take to set up AlumnLink?",
      answer: "Most institutions are up and running within 1-2 weeks. Our onboarding team will guide you through the entire process, from data import to customization and launch."
    },
    {
      question: "Can we import our existing alumni database?",
      answer: "Yes! AlumnLink supports imports from various formats including CSV, Excel, and direct API connections with major CRM and database systems."
    },
    {
      question: "How secure is our alumni data on the platform?",
      answer: "We employ enterprise-grade security measures including encryption at rest and in transit, regular security audits, and compliance with GDPR, CCPA, and other privacy regulations."
    },
    {
      question: "Do alumni need to create accounts to use the platform?",
      answer: "Yes, alumni will need to create accounts to engage with the community, but we offer various authentication options including email, social login, and SSO to make the process seamless."
    },
    {
      question: "Can we customize the platform to match our branding?",
      answer: "Absolutely! All plans include basic customization options for colors, logos, and page layouts. The Professional and Enterprise plans offer more advanced customization capabilities."
    },
    {
      question: "What kind of support do you offer?",
      answer: "All customers receive access to our knowledge base and community forum. Professional plans include email and chat support, while Enterprise plans get priority support with a dedicated account manager."
    }
  ];

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <SectionHeading
          badge="Frequently asked questions"
          badgeColor="yellow"
          title="Common questions about AlumnLink"
          description="Everything you need to know about the platform and how it can help your institution."
        />

        <FAQ faqs={faqs} columns={2} />

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Link
            to="/landing/contact"
            className="inline-flex items-center gap-2 text-[#fe6019] font-medium hover:underline"
          >
            Contact our team for more information
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;