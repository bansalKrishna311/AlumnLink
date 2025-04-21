import React from 'react';
import { Users, MessageSquare, Network, Music, BookOpen, Calendar, MapPin, Award } from 'lucide-react';

const Impact = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-[#fe6019]" />,
      title: "Diverse Panelists",
      description: "Leaders from startups, industries, and academia come together to share insights.",
      bg: "bg-[#fe6019]/5"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-[#fe6019]" />,
      title: "Inspiring Discussions",
      description: "Engaging conversations that ignite ideas and foster innovation.",
      bg: "bg-[#fe6019]/5"
    },
    {
      icon: <Network className="w-8 h-8 text-[#fe6019]" />,
      title: "Networking Opportunities",
      description: "Connect with experts, mentors, and fellow alumni to expand your professional circle.",
      bg: "bg-[#fe6019]/5"
    },
    {
      icon: <Music className="w-8 h-8 text-[#fe6019]" />,
      title: "Entertainment & Fun",
      description: "Enjoy stand-up comedy, band performances, and cultural events.",
      bg: "bg-[#fe6019]/5"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-[#fe6019]" />,
      title: "Learning & Growth",
      description: "Gain knowledge through workshops and hands-on sessions led by industry experts.",
      bg: "bg-[#fe6019]/5"
    },
    {
      icon: <Calendar className="w-8 h-8 text-[#fe6019]" />,
      title: "Event Schedule",
      description: "Well-planned alumni reunions filled with activities for everyone.",
      bg: "bg-[#fe6019]/5"
    },
    // {
    //   icon: <MapPin className="w-8 h-8 text-[#fe6019]" />,
    //   title: "Venue & Accessibility",
    //   description: "Easily accessible locations with all necessary amenities.",
    //   bg: "bg-[#fe6019]/5"
    // },
    // {
    //   icon: <Award className="w-8 h-8 text-[#fe6019]" />,
    //   title: "Celebrating Achievements",
    //   description: "Recognizing outstanding alumni contributions and awarding excellence.",
    //   bg: "bg-[#fe6019]/5"
    // }
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-12">
          <h2 className="text-lg tracking-[13px] font-semibold text-[#fe6019] mb-4 uppercase">
            ALUMNI FEATURES
          </h2>
          <h3 className="text-4xl font-bold text-gray-900">
            Our <span className="text-[#fe6019]">Engaging</span> Alumni Programs
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`feature-card relative p-8 rounded-xl shadow-lg border border-[#fe6019]/10  transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-2 group`}
            >
              {/* Icon with animation */}
              <div className="w-14 h-14 mb-6 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-[#fe6019] group-hover:text-white transition-colors duration-300">
                {React.cloneElement(feature.icon, { 
                  className: `${feature.icon.props.className} group-hover:text-white transition-colors duration-300` 
                })}
              </div>
              
              <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
              
              {/* Hover effect line */}
              <div className="absolute bottom-0 left-0 h-[2px] bg-[#fe6019] w-full"></div>
              
              {/* Floating dots decoration */}
              <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#fe6019]/20 animate-float" style={{ animationDelay: `${index * 0.2}s` }}></div>
            </div>
          ))}
        </div>

        {/* Animation styles */}
        <style jsx>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}</style>
      </div>
    </section>
  );
};

export default Impact;