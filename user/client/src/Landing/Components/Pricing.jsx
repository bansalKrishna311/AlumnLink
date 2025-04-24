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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  return (
    <motion.section 
      className="py-24 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <SectionHeading
          badge="Simple, transparent pricing"
          badgeColor="green"
          title="Choose the plan that fits your institution"
          description="All plans include a 14-day free trial with no credit card required. Cancel anytime."
        />

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {pricingTiers.map((tier, i) => (
            <PricingTier key={i} tier={tier} index={i} />
          ))}
        </motion.div>

        <motion.div 
          className="mt-12 bg-white rounded-xl p-8 text-center max-w-4xl mx-auto shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            duration: 0.6, 
            delay: 0.8,
            type: "spring",
            stiffness: 50
          }}
          whileHover={{ 
            y: -10,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
        >
          <motion.h3 
            className="text-xl font-bold mb-2 text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          >
            Need a custom solution?
          </motion.h3>
          <motion.p 
            className="text-gray-600 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0 }}
          >
            Contact our sales team to discuss your specific requirements and get a customized quote.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1 }}
          >
            <Link
              to="/landing/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Contact Sales
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.5 }}
              >
                <ArrowRight size={16} />
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Pricing;