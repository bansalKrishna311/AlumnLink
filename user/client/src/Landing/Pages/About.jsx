import React from 'react';
import { motion } from 'framer-motion';
import { Users, School, Building, Award, Briefcase } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-28 pb-16">
      {/* About Hero Section */}
      <div className="bg-gradient-to-b from-[#fe6019]/5 to-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#fe6019] to-orange-600">About AlumnLink</h1>
            <p className="text-lg text-gray-600 mb-8">
              Connecting alumni, empowering institutions, and building stronger communities through innovative technology.
            </p>
            <div className="w-24 h-1 bg-[#fe6019] mx-auto rounded-full"></div>
          </motion.div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                At AlumnLink, we're dedicated to transforming how educational institutions connect with their alumni networks. Our mission is to create a seamless digital ecosystem that fosters meaningful relationships between institutions and their graduates.
              </p>
              <p className="text-lg text-gray-600">
                We believe that strong alumni connections lead to thriving educational communities, enhanced career opportunities for graduates, and sustainable growth for institutions. Through our innovative platform, we're making this vision a reality.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex-1 flex justify-center"
            >
              <div className="relative w-full max-w-md aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#fe6019]/20 to-orange-300/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users size={80} className="text-[#fe6019] opacity-80" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Who We Serve */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Who We Serve</h2>
            <p className="text-lg text-gray-600">
              AlumnLink is designed to support the entire educational ecosystem through specialized solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <School size={48} />,
                title: "Educational Institutions",
                description: "Universities, colleges, and schools looking to strengthen alumni engagement, enhance fundraising efforts, and build a vibrant community of graduates."
              },
              {
                icon: <Users size={48} />,
                title: "Alumni",
                description: "Graduates seeking to maintain connections with their alma mater, network with fellow alumni, and access exclusive opportunities and resources."
              },
              {
                icon: <Building size={48} />,
                title: "Corporations",
                description: "Businesses looking to connect with qualified talent pools, establish educational partnerships, and engage in meaningful CSR initiatives."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="text-[#fe6019] mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Story</h2>
              <div className="w-16 h-1 bg-[#fe6019] mx-auto rounded-full"></div>
            </motion.div>

            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="bg-[#fe6019]/10 rounded-full p-4 text-[#fe6019]">
                  <Award size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">From Vision to Reality</h3>
                  <p className="text-gray-600">
                    AlumnLink was founded in 2023 by a team of education technology enthusiasts who recognized a significant gap in how institutions maintained relationships with their alumni. Our founders, having experienced firsthand the challenges of staying connected with their alma maters, envisioned a platform that would transform alumni engagement.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="bg-[#fe6019]/10 rounded-full p-4 text-[#fe6019]">
                  <Briefcase size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Growth and Innovation</h3>
                  <p className="text-gray-600">
                    What began as a simple alumni directory has evolved into a comprehensive platform with advanced networking capabilities, event management, job boards, and fundraising tools. Today, AlumnLink serves hundreds of educational institutions and connects thousands of alumni worldwide.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="bg-[#fe6019]/10 rounded-full p-4 text-[#fe6019]">
                  <Users size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Looking Forward</h3>
                  <p className="text-gray-600">
                    Our vision for the future is to continue expanding our platform's capabilities, leveraging emerging technologies like AI and data analytics to provide even more personalized experiences for alumni and valuable insights for institutions. We are committed to fostering stronger connections and creating opportunities that benefit the entire educational ecosystem.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Core Values</h2>
            <p className="text-lg text-gray-600">
              These principles guide everything we do at AlumnLink
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Connection",
                description: "We believe in the power of meaningful relationships to drive personal and professional growth."
              },
              {
                title: "Innovation",
                description: "We continuously evolve our platform to meet the changing needs of our users."
              },
              {
                title: "Security",
                description: "We prioritize the protection of our users' data and maintain the highest standards of privacy."
              },
              {
                title: "Impact",
                description: "We measure our success by the positive outcomes we create for institutions and alumni."
              }
            ].map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="text-xl font-semibold mb-3 text-[#fe6019]">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Join Us CTA */}
      <div className="py-16 bg-gradient-to-r from-[#fe6019] to-orange-500 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Join the AlumnLink Community</h2>
            <p className="text-xl mb-8">
              Be part of a platform that's transforming how educational institutions and alumni connect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/signup" className="btn px-8 py-3 bg-white text-[#fe6019] font-medium rounded-lg hover:bg-gray-100 transition-all">
                Sign Up Today
              </a>
              <a href="/landing/contact" className="btn px-8 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all">
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;