import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import SectionHeading from '../SectionHeading';

const OurTeam = ({ teamMembers, containerVariants, itemVariants }) => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl w-11/12 mx-auto px-6 sm:px-10 lg:px-16">
        <SectionHeading
          badge="Meet The Team"
          badgeColor="blue"
          title="The Minds Behind AlumnLink"
          description="Our dedicated team combines expertise in education, technology, and design to create a platform that transforms alumni engagement."
        />

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {teamMembers.map((member, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <div className="aspect-square w-full bg-gradient-to-br from-[#fe6019]/90 to-orange-600 relative overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-white/80">-- Designation --</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4">{member.description}</p>
                
                <div className="flex space-x-3">
                  <a 
                    href={member.social.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-[#fe6019]/10 text-gray-600 hover:text-[#fe6019] transition-colors"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a 
                    href={member.social.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-[#fe6019]/10 text-gray-600 hover:text-[#fe6019] transition-colors"
                  >
                    <Github size={18} />
                  </a>
                  <a 
                    href={`mailto:${member.social.email}`} 
                    className="p-2 rounded-full bg-gray-100 hover:bg-[#fe6019]/10 text-gray-600 hover:text-[#fe6019] transition-colors"
                  >
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default OurTeam;