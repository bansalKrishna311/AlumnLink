import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Briefcase, 
  DollarSign, 
  BarChart3, 
  MessageCircle, 
  Search, 
  Shield,
  Smartphone,
  Globe,
  Target,
  Award
} from 'lucide-react';
import SEO from '../../../components/SEO';

const FeaturesPage = () => {
  const features = [
    {
      icon: <Users size={32} />,
      title: "Smart Alumni Directory",
      description: "Comprehensive, searchable alumni database with advanced filtering options. Find alumni by graduation year, location, industry, or interests.",
      benefits: ["Advanced search capabilities", "Profile verification system", "Privacy controls", "Bulk import tools"],
      color: "from-blue-500/20 to-blue-400/20",
      iconColor: "text-blue-600"
    },
    {
      icon: <Calendar size={32} />,
      title: "Event Management System",
      description: "Plan, organize, and manage alumni events effortlessly. From virtual meetups to large reunion gatherings with built-in RSVP tracking.",
      benefits: ["Event creation & promotion", "RSVP management", "Virtual event hosting", "Automated reminders"],
      color: "from-green-500/20 to-green-400/20",
      iconColor: "text-green-600"
    },
    {
      icon: <Briefcase size={32} />,
      title: "Career Opportunities Portal",
      description: "Connect alumni with job opportunities and career advancement resources. Built-in job board and mentorship matching.",
      benefits: ["Job posting & application", "Mentorship matching", "Career resources", "Skills development"],
      color: "from-purple-500/20 to-purple-400/20",
      iconColor: "text-purple-600"
    },
    {
      icon: <DollarSign size={32} />,
      title: "Fundraising Platform",
      description: "Streamline donation campaigns and track fundraising progress. Secure payment processing and donor management.",
      benefits: ["Campaign management", "Secure payments", "Donor tracking", "Impact reporting"],
      color: "from-[#fe6019]/20 to-orange-400/20",
      iconColor: "text-[#fe6019]"
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Analytics Dashboard",
      description: "Comprehensive insights into alumni engagement, event attendance, career outcomes, and platform usage.",
      benefits: ["Engagement metrics", "ROI tracking", "Custom reports", "Data visualization"],
      color: "from-cyan-500/20 to-cyan-400/20",
      iconColor: "text-cyan-600"
    },
    {
      icon: <MessageCircle size={32} />,
      title: "Communication Tools",
      description: "Multi-channel communication system including email campaigns, push notifications, and direct messaging.",
      benefits: ["Email campaigns", "Push notifications", "Direct messaging", "Newsletter management"],
      color: "from-pink-500/20 to-pink-400/20",
      iconColor: "text-pink-600"
    },
    {
      icon: <Search size={32} />,
      title: "Advanced Search & Filters",
      description: "Powerful search functionality to help alumni connect based on shared interests, location, industry, or graduation year.",
      benefits: ["Smart search algorithms", "Location-based filters", "Industry categorization", "Interest matching"],
      color: "from-indigo-500/20 to-indigo-400/20",
      iconColor: "text-indigo-600"
    },
    {
      icon: <Shield size={32} />,
      title: "Privacy & Security",
      description: "Enterprise-grade security with granular privacy controls. Alumni control their visibility and data sharing preferences.",
      benefits: ["Data encryption", "Privacy controls", "GDPR compliance", "Secure hosting"],
      color: "from-red-500/20 to-red-400/20",
      iconColor: "text-red-600"
    },
    {
      icon: <Smartphone size={32} />,
      title: "Mobile App",
      description: "Full-featured mobile applications for iOS and Android. Keep alumni engaged on-the-go with push notifications.",
      benefits: ["Cross-platform apps", "Offline capabilities", "Push notifications", "Responsive design"],
      color: "from-yellow-500/20 to-yellow-400/20",
      iconColor: "text-yellow-600"
    },
    {
      icon: <Globe size={32} />,
      title: "Global Reach",
      description: "Multi-language support and global accessibility features to connect alumni worldwide regardless of location.",
      benefits: ["Multi-language support", "Global accessibility", "Time zone management", "Cultural adaptation"],
      color: "from-teal-500/20 to-teal-400/20",
      iconColor: "text-teal-600"
    },
    {
      icon: <Target size={32} />,
      title: "Smart Matching",
      description: "AI-powered recommendation engine that suggests relevant connections, events, and opportunities to alumni.",
      benefits: ["AI-powered suggestions", "Connection recommendations", "Event matching", "Opportunity alerts"],
      color: "from-violet-500/20 to-violet-400/20",
      iconColor: "text-violet-600"
    },
    {
      icon: <Award size={32} />,
      title: "Recognition System",
      description: "Celebrate alumni achievements with awards, badges, and recognition programs to increase engagement.",
      benefits: ["Achievement badges", "Award ceremonies", "Success spotlights", "Milestone celebrations"],
      color: "from-amber-500/20 to-amber-400/20",
      iconColor: "text-amber-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <>
      <SEO 
        title="AlumnLink Features - Comprehensive Alumni Management Platform Tools & Capabilities"
        description="Explore AlumnLink's powerful features: smart alumni directory, event management, career portal, fundraising tools, analytics dashboard, mobile apps, and more. Everything your institution needs to build thriving alumni communities."
        keywords="alumni management features, alumni directory software, alumni event management, alumni career portal, alumni fundraising platform, alumni analytics dashboard, alumni mobile app, alumni networking tools, educational institution software features, alumni engagement platform capabilities"
        url="https://www.alumnlink.com/features"
        canonical="https://www.alumnlink.com/features"
        lastModified="2025-08-19"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "AlumnLink Features",
          "description": "Comprehensive features of the AlumnLink alumni management platform",
          "url": "https://www.alumnlink.com/features",
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "AlumnLink",
            "featureList": features.map(feature => feature.title)
          }
        }}
        breadcrumbs={[
          { name: "Home", url: "https://www.alumnlink.com" },
          { name: "Features", url: "https://www.alumnlink.com/features" }
        ]}
      />
      
      <div className="pt-28 pb-16 bg-gradient-to-br from-white via-[#fff8f5] to-[#ffe8de] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for <span className="text-[#fe6019]">Alumni Success</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything your institution needs to build, manage, and grow thriving alumni communities. 
              Comprehensive tools designed for maximum engagement and measurable results.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 group-hover:scale-105 overflow-hidden h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}/>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center ${feature.iconColor} group-hover:bg-white/80 transition-all duration-300 mb-6`}>
                      {feature.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="text-gray-600 text-sm flex items-center">
                            <div className="w-1.5 h-1.5 bg-[#fe6019] rounded-full mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Integration Section */}
          <motion.div 
            className="mt-20 bg-white rounded-2xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Seamless Integration & Support
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                AlumnLink integrates with your existing systems and provides comprehensive support to ensure success.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#fe6019]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe size={32} className="text-[#fe6019]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Integration</h3>
                <p className="text-gray-600">
                  Seamlessly integrate with your existing CRM, LMS, and other institutional systems.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#fe6019]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={32} className="text-[#fe6019]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">
                  Dedicated support team available around the clock to help you succeed.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#fe6019]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target size={32} className="text-[#fe6019]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Custom Training</h3>
                <p className="text-gray-600">
                  Personalized training sessions to help your team maximize platform effectiveness.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            className="mt-16 bg-gradient-to-r from-[#fe6019] to-[#e55517] rounded-2xl p-8 text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Experience These Features?</h2>
            <p className="text-xl mb-6 opacity-90">
              Schedule a personalized demo to see how AlumnLink can transform your alumni engagement.
            </p>
            <motion.button 
              className="px-8 py-4 bg-white text-[#fe6019] font-semibold rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Free Demo
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FeaturesPage;
