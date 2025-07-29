import React from 'react';
import SectionHeading from './SectionHeading';

const Testimonials = () => {
  // Testimonial data
  const testimonials = [
    {
      quote: "AlumnLink helped us centralize our alumni network for the first time. Our graduates can now easily connect with each other and find mentorship opportunities.",
      name: "Dr. Rajesh Kumar",
      title: "Alumni Relations Head",
      university: "Regional Engineering College",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "The platform made it simple to organize alumni events and track engagement. We've seen significant improvement in alumni participation since implementing AlumnLink.",
      name: "Prof. Priya Sharma",
      title: "Dean of Student Affairs",
      university: "Business Institute of Technology",
      avatar: "https://randomuser.me/api/portraits/women/42.jpg"
    },
    {
      quote: "What impressed us most was how quickly we could get our alumni network up and running. The support team guided us through every step of the setup process.",
      name: "Amit Patel",
      title: "Director of Alumni Services",
      university: "State University",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <SectionHeading
          badge="Client Success"
          badgeColor="orange"
          title="Growing alumni networks across institutions"
          description="See how educational institutions are building stronger alumni communities with AlumnLink's comprehensive platform."
        />
        
        {/* Simple stats */}
        <div className="flex justify-center gap-12 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">40%</div>
            <div className="text-sm text-gray-600">Engagement Increase</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">25+</div>
            <div className="text-sm text-gray-600">Partner Institutions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">89%</div>
            <div className="text-sm text-gray-600">Client Satisfaction</div>
          </div>
        </div>

        {/* Simplified testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <blockquote className="text-gray-700 mb-6">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.title}</div>
                  <div className="text-xs text-[#fe6019] font-medium">{testimonial.university}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
