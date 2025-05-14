import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../SectionHeading';

const OurStory = ({ ourStoryItems }) => {
  return (
    <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl w-11/12 mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            badge="Our Journey"
            badgeColor="orange"
            title="Our Story"
            description="The evolution of AlumnLink from idea to industry-leading platform"
          />

          <div className="space-y-12 mt-8">
            {ourStoryItems.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                className="flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="bg-[#fe6019]/10 rounded-full p-4 text-[#fe6019] flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStory;