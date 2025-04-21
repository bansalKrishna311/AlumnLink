import React, { useEffect, useRef, useState } from 'react';
import { Globe, Users, Briefcase, BookOpen, Handshake, GraduationCap } from 'lucide-react';

const Gallery = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [counters, setCounters] = useState({ alumni: 0, events: 0, mentors: 0, countries: 0 });
  const [animationComplete, setAnimationComplete] = useState(false);

  // Intersection Observer for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Intersection Observer for stats visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  // Counter animation for stats
  useEffect(() => {
    if (statsVisible && !animationComplete) {
      const duration = 2000;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      
      const finalValues = {
        alumni: 15000,
        events: 120,
        mentors: 450,
        countries: 60
      };
      
      let frame = 0;
      const counter = setInterval(() => {
        frame++;
        
        const progress = frame / totalFrames;
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        
        setCounters({
          alumni: Math.floor(easeOutQuad * finalValues.alumni),
          events: Math.floor(easeOutQuad * finalValues.events),
          mentors: Math.floor(easeOutQuad * finalValues.mentors),
          countries: Math.floor(easeOutQuad * finalValues.countries)
        });
        
        if (frame === totalFrames) {
          clearInterval(counter);
          setAnimationComplete(true);
        }
      }, frameDuration);
      
      return () => clearInterval(counter);
    }
  }, [statsVisible, animationComplete]);

  // Add keyframes and styles to document
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes borderPulse {
        0% { border-color: rgba(254, 96, 25, 0.3); }
        50% { border-color: rgba(254, 96, 25, 0.8); }
        100% { border-color: rgba(254, 96, 25, 0.3); }
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      
      .animate-pulse {
        animation: pulse 4s ease-in-out infinite;
      }
      
      .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
      }
      
      .animate-fade-in-left {
        animation: fadeInLeft 0.8s ease-out forwards;
      }
      
      .animate-border-pulse {
        animation: borderPulse 2s infinite;
      }
      
      .feature-card {
        transition: all 0.3s ease;
        overflow: hidden;
      }
      
      .feature-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 25px -5px rgba(254, 96, 25, 0.1), 0 10px 10px -5px rgba(254, 96, 25, 0.04);
      }
      
      .feature-card:hover .feature-icon {
        transform: scale(1.1);
      }
      
      .feature-card:hover .feature-number {
        transform: translateY(-5px);
      }
      
      .feature-card:hover .feature-overlay {
        opacity: 0.15;
      }
      
      .feature-icon {
        transition: transform 0.3s ease;
      }
      
      .feature-number {
        transition: transform 0.3s ease;
      }
      
      .feature-overlay {
        transition: opacity 0.3s ease;
      }
      
      .stat-card {
        transition: all 0.3s ease;
        overflow: hidden;
      }
      
      .stat-card:hover {
        transform: translateY(-5px) scale(1.03);
      }
      
      .stat-card:hover .stat-value {
        color: white;
      }
      
      .stat-card:hover .stat-overlay {
        opacity: 0.3;
      }
      
      .stat-value {
        transition: color 0.3s ease;
      }
      
      .stat-overlay {
        transition: opacity 0.3s ease;
      }
      
      .gradient-text {
        background: linear-gradient(to right, #fe6019, #fe8c4a);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      
      .about-heading-line {
        position: relative;
        display: inline-block;
      }
      
      .about-heading-line::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(to right, #fe6019, #fe8c4a);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.5s ease;
      }
      
      .about-heading-line.visible::after {
        transform: scaleX(1);
      }
    `;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  const features = [
    {
      number: "01",
      title: "Alumni Network",
      description: "Connect with thousands of alumni across different industries and generations.",
      icon: <Users className="w-10 h-10 text-[#fe6019]" />,
      delay: 0
    },
    {
      number: "02",
      title: "Career Support",
      description: "Access job postings, career counseling, and professional development resources.",
      icon: <Briefcase className="w-10 h-10 text-[#fe6019]" />,
      delay: 200
    },
    {
      number: "03",
      title: "Mentorship Program",
      description: "Give back by mentoring current students or get guidance from experienced alumni.",
      icon: <Handshake className="w-10 h-10 text-[#fe6019]" />,
      delay: 400
    }
  ];

  const stats = [
    { value: counters.alumni, label: "Alumni Members", icon: <Users className="w-6 h-6" />, delay: 0 },
    { value: counters.events, label: "Annual Events", icon: <BookOpen className="w-6 h-6" />, delay: 100 },
    { value: counters.mentors, label: "Active Mentors", icon: <GraduationCap className="w-6 h-6" />, delay: 200 },
    { value: counters.countries, label: "Countries", icon: <Globe className="w-6 h-6" />, delay: 300 }
  ];

  return (
    <section 
      id="alumni" 
      ref={sectionRef}
      className="relative py-24 px-6 overflow-hidden bg-white"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-40 -right-32 w-96 h-96 rounded-full border-4 border-[#fe6019]/10 animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border-4 border-[#fe6019]/10 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-[#fe6019]/20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 rounded-full bg-[#fe6019]/20 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'radial-gradient(#fe6019 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0'
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Heading - Left Aligned */}
        <div className={`text-left mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
          <h2 className="text-lg tracking-[13px] font-semibold text-[#fe6019] mb-6 about-heading-line uppercase relative inline-block">
            ALUMNI PORTAL
            <span className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#fe6019] to-[#fe8c4a] ${isVisible ? 'about-heading-line visible' : ''}`}></span>
          </h2>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mt-4">
            Stay <span className="gradient-text">Connected</span> Forever
          </h1>
          
          <p className="text-lg text-gray-600 mt-6 max-w-3xl">
            Your journey doesn't end at graduation. Our alumni portal keeps you connected to your alma mater and fellow graduates.
          </p>
        </div>

        {/* Main Description - Left Aligned */}
        <div className={`max-w-4xl mb-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
          <div className="relative p-8 rounded-2xl bg-white shadow-lg border border-gray-100">
            <p className="text-lg leading-relaxed text-gray-700 relative z-10">
              The <span className="font-semibold text-[#fe6019]">Alumni Portal</span> is your gateway to lifelong connections and opportunities. Whether you're looking to network with fellow graduates, find career opportunities, mentor current students, or simply stay informed about campus developments, our portal provides all the tools you need. <span className='text-[#fe6019] font-semibold'>Reconnect, engage, and grow</span> with our vibrant alumni community spread across the globe.
            </p>
            
            <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-[#fe6019]/5 rounded-full z-0"></div>
          </div>
        </div>

        {/* Feature Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`feature-card relative bg-white rounded-xl shadow-lg p-8 border border-[#fe6019]/10 text-left ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{animationDelay: `${0.6 + feature.delay/1000}s`}}
            >
              {/* Gradient Overlay */}
              <div className="feature-overlay absolute inset-0 bg-gradient-to-br from-[#fe6019]/5 to-[#fe8c4a]/5 opacity-10 z-0 rounded-xl"></div>
              
              {/* Number */}
              <div className="feature-number text-[#fe6019] mb-6 relative z-10">
                <p className="text-6xl font-bold opacity-20">{feature.number}</p>
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">{feature.title}</h3>
              <p className="text-gray-600 relative z-10 mb-8">
                {feature.description}
              </p>
              
              {/* Icon */}
              <div className="feature-icon absolute bottom-6 right-6 opacity-70">
                {feature.icon}
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#fe6019]/10 rounded-full z-0 animate-pulse" style={{animationDelay: `${index * 0.5}s`}}></div>
            </div>
          ))}
        </div>

        {/* Alumni Stats */}
        <div ref={statsRef} className="relative">
          <h3 className={`text-2xl font-bold text-left mb-10 text-gray-900 ${statsVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            Our <span className="gradient-text">Global</span> Alumni Community
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`stat-card relative p-8 rounded-xl overflow-hidden text-left ${statsVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{
                  animationDelay: `${0.2 + stat.delay/1000}s`,
                  background: '#fe6019'
                }}
              >
                <div className="stat-overlay absolute inset-0 bg-black opacity-20"></div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h4 className="stat-value text-4xl font-bold text-white">{stat.value}+</h4>
                  <div className="p-2 bg-white/10 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                
                <p className="text-sm uppercase tracking-wider text-white/80 font-medium relative z-10">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          
          {/* CTA Button */}
          <div className={`mt-16 text-left ${statsVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.8s'}}>
            <button 
              className="px-8 py-4 rounded-full bg-[#fe6019] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border-2 border-[#fe6019]/20 animate-border-pulse"
            >
              Join the Alumni Network
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;