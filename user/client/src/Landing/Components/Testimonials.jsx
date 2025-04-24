import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const Testimonials = () => {
  // University theme colors for testimonial cards
  const universityColors = [
    {
      name: "Stanford University",
      primary: "#fe6019", // AlumnLink primary orange
      secondary: "#ffd9c7", // Light orange variant
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/200px-Stanford_Cardinal_logo.svg.png"
    },
    {
      name: "Massachusetts Institute of Technology",
      primary: "#ff7a3d", // Slightly lighter orange
      secondary: "#ffe2d3", // Very light orange
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/200px-MIT_logo.svg.png"
    },
    {
      name: "Harvard University",
      primary: "#e85000", // Darker orange
      secondary: "#ffc5a8", // Peachy orange
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Harvard_Crimson_logo.svg/200px-Harvard_Crimson_logo.svg.png"
    },
    {
      name: "University of Oxford",
      primary: "#ff4d00", // Vibrant orange
      secondary: "#ffccb8", // Soft peachy orange
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford-University-Circlet.svg/200px-Oxford-University-Circlet.svg.png"
    },
    {
      name: "University of Cambridge",
      primary: "#ff8c4d", // Light warm orange
      secondary: "#ffede3", // Very light peach
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/University_of_Cambridge_coat_of_arms.svg/200px-University_of_Cambridge_coat_of_arms.svg.png"
    }
  ];

  // Testimonial data
  const testimonials = [
    {
      quote: "AlumnLink has completely transformed how we engage with our alumni. The platform is intuitive and has increased our active alumni participation by 78% in just six months.",
      name: "Dr. Elizabeth Chen",
      title: "Alumni Relations Director",
      university: "Stanford University",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      stats: { engagement: "78%", retention: "91%", satisfaction: "4.9/5" }
    },
    {
      quote: "The analytics dashboard gives us invaluable insights into our alumni community. We've been able to tailor our programs to increase engagement and foster meaningful connections.",
      name: "Professor James Wilson",
      title: "Dean of Alumni Affairs",
      university: "Massachusetts Institute of Technology",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      stats: { events: "142", attendees: "3,500+", fundraising: "$2.7M" }
    },
    {
      quote: "What sets AlumnLink apart is how it seamlessly integrates with our existing systems. The career networking features have created countless opportunities for our recent graduates.",
      name: "Sarah Johnson, Ph.D.",
      title: "Head of Career Services",
      university: "Harvard University",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      stats: { jobPlacements: "347", mentorships: "512", networkGrowth: "156%" }
    },
    {
      quote: "The event management tools are exceptional. We've seen record attendance at our alumni gatherings since implementing AlumnLink, and the feedback has been overwhelmingly positive.",
      name: "Dr. Michael Thompson",
      title: "Global Alumni Coordinator",
      university: "University of Oxford",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      stats: { eventAttendance: "89%", globalEvents: "27", participation: "4,200+" }
    },
    {
      quote: "Our alumni feel more connected than ever. The discussion forums have created vibrant communities around shared interests, and the mentorship program has flourished on this platform.",
      name: "Prof. Rebecca Martinez",
      title: "Alumni Engagement Officer",
      university: "University of Cambridge",
      avatar: "https://randomuser.me/api/portraits/women/76.jpg",
      stats: { activeUsers: "11,243", discussions: "427/month", donations: "+43%" }
    }
  ];

  const getColorByUniversity = (universityName) => {
    const university = universityColors.find(u => u.name === universityName);
    return university || universityColors[0];
  };

  // Stagger animation for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const statVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
        delay: 0.3
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#fff8f5] overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ffe8de] rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute bottom-20 -left-20 w-60 h-60 bg-orange-100 rounded-full opacity-60 blur-2xl"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <SectionHeading
          badge="Testimonials"
          badgeColor="orange"
          title="Trusted by leading universities worldwide"
          description="Discover how AlumnLink has transformed alumni engagement and community building for prestigious institutions across the globe."
        />
        
        {/* Stat highlights */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div
            variants={statVariants}
            className="bg-white px-6 py-4 rounded-full shadow-md border border-gray-100 flex items-center gap-3"
          >
            <motion.div 
              className="w-8 h-8 rounded-full bg-[#fe6019] flex items-center justify-center text-white text-xs font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              +
            </motion.div>
            <span className="font-bold text-gray-800">91% alumni retention</span>
          </motion.div>
          
          <motion.div
            variants={statVariants}
            className="bg-white px-6 py-4 rounded-full shadow-md border border-gray-100 flex items-center gap-3"
          >
            <motion.div 
              className="w-8 h-8 rounded-full bg-[#ff7a3d] flex items-center justify-center text-white text-xs font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
            >
              +
            </motion.div>
            <span className="font-bold text-gray-800">78% engagement increase</span>
          </motion.div>
          
          <motion.div
            variants={statVariants}
            className="bg-white px-6 py-4 rounded-full shadow-md border border-gray-100 flex items-center gap-3"
          >
            <motion.div 
              className="w-8 h-8 rounded-full bg-[#e85000] flex items-center justify-center text-white text-xs font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
              +
            </motion.div>
            <span className="font-bold text-gray-800">43% donation growth</span>
          </motion.div>
        </motion.div>

        {/* Main testimonial cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((testimonial, index) => {
            const university = getColorByUniversity(testimonial.university);
            
            return (
              <motion.div 
                key={index}
                className="relative bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full"
                variants={itemVariants}
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  transition: { duration: 0.3 }
                }}
              >
                {/* Curved accent on top */}
                <div 
                  className="absolute top-0 left-0 right-0 h-24 rounded-b-[50%] opacity-20 -z-0"
                  style={{ background: `linear-gradient(45deg, ${university.primary}, ${university.secondary})` }}
                ></div>
                
                {/* University logo watermark */}
                <div className="absolute top-6 right-6 w-12 h-12 opacity-20">
                  <img 
                    src={university.logo} 
                    alt={university.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="p-8 flex flex-col flex-grow relative z-10">
                  {/* Stylized quote mark */}
                  <div 
                    className="text-6xl font-serif absolute -top-2 -left-1 opacity-10"
                    style={{ color: university.primary }}
                  >
                    "
                  </div>
                  
                  {/* Testimonial quote */}
                  <blockquote className="text-gray-700 leading-relaxed mb-6 relative">
                    {testimonial.quote}
                  </blockquote>
                  
                  {/* Stats cards */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {Object.entries(testimonial.stats).map(([key, value], i) => (
                      <motion.div 
                        key={key}
                        className="text-xs py-1 px-3 rounded-full font-medium"
                        style={{ 
                          background: `${university.secondary}80`,
                          color: university.primary 
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i + 0.5 }}
                      >
                        <span className="capitalize">{key}</span>: <span className="font-bold">{value}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Author info */}
                  <div className="mt-auto flex items-center">
                    <div 
                      className="w-12 h-12 rounded-full overflow-hidden border-2 shadow-sm mr-4"
                      style={{ borderColor: university.primary }}
                    >
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.title}</p>
                      <p 
                        className="text-xs font-medium" 
                        style={{ color: university.primary }}
                      >
                        {testimonial.university}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Colored border accent at bottom */}
                <div 
                  className="h-1.5 w-full" 
                  style={{ background: `linear-gradient(to right, ${university.primary}, ${university.secondary})` }}
                ></div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;