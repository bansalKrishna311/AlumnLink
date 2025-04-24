import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';
import PricingTier from './PricingTier';

const Pricing = () => {
  // Pricing tiers data
  const pricingTiers = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for small alumni groups just getting started",
      features: [
        "Up to 500 alumni profiles",
        "Basic event management",
        "Discussion forums",
        "Email notifications",
        "Community moderation"
      ],
      limitations: [
        "Limited analytics",
        "No API access",
        "Community support only"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "Ideal for growing institutions with active alumni",
      features: [
        "Up to 10,000 alumni profiles",
        "Advanced event management",
        "Job board & career center",
        "Fundraising campaigns",
        "Comprehensive analytics",
        "Custom branding options",
        "Email & chat support",
        "API access"
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large institutions with complex requirements",
      features: [
        "Unlimited alumni profiles",
        "Full platform customization",
        "White-label options",
        "Advanced data & analytics",
        "SSO & advanced security",
        "Dedicated account manager",
        "Priority 24/7 support",
        "Custom API integration"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <SectionHeading
          badge="Simple, transparent pricing"
          badgeColor="green"
          title="Choose the plan that fits your institution"
          description="All plans include a 14-day free trial with no credit card required. Cancel anytime."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, i) => (
            <PricingTier key={i} tier={tier} index={i} />
          ))}
        </div>

        <motion.div 
          className="mt-12 bg-white rounded-xl p-8 text-center max-w-4xl mx-auto shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold mb-2 text-gray-800">Need a custom solution?</h3>
          <p className="text-gray-600 mb-4">
            Contact our sales team to discuss your specific requirements and get a customized quote.
          </p>
          <Link
            to="/landing/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Contact Sales
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;