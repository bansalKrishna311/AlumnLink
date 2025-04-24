import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, BarChart2, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';

const HowItWorks = () => {
  // How it works steps data
  const howItWorksSteps = [
    {
      step: 1,
      title: "Set up your institution",
      description: "Configure your branding, import alumni data, and customize your community portal to match your institution's identity.",
      icon: <Users size={32} />
    },
    {
      step: 2,
      title: "Engage your alumni",
      description: "Launch discussions, create events, share job opportunities, and send personalized communications to drive engagement.",
      icon: <BarChart2 size={32} />
    },
    {
      step: 3,
      title: "Grow your network",
      description: "Analyze engagement data, optimize your approach, and continuously expand your alumni community's reach and impact.",
      icon: <Award size={32} />
    }
  ];

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <SectionHeading
          badge="How It Works"
          badgeColor="blue"
          title="Build stronger alumni bonds in three easy steps"
          description="AlumnLink makes it simple to launch, grow, and manage your alumni community with powerful tools designed specifically for educational institutions."
        />

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {howItWorksSteps.map((step, i) => (
            <motion.div 
              key={i} 
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                <div className="bg-gradient-to-br from-[#fff8f5] to-[#ffe8de] text-[#fe6019] w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <div className="absolute top-8 right-8 size-8 bg-gradient-to-r from-[#fe6019] to-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{step.title}</h3>
                <p className="text-gray-600 flex-grow">{step.description}</p>
              </div>
              
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="text-[#fe6019]" size={24} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/landing/about"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#fe6019]/10 to-orange-100 hover:from-[#fe6019]/20 hover:to-orange-200 transition-colors text-gray-800 py-3 px-6 rounded-lg font-medium"
          >
            Learn more about our platform
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;