import React from 'react';
import { School, Building, Award, Briefcase, Users } from 'lucide-react';
import CallToAction from '../Components/CallToAction';

// Import our newly created components
import AboutHero from '../Components/About/AboutHero';
import OurMission from '../Components/About/OurMission';
import WhatIsAlumnLink from '../Components/About/WhatIsAlumnLink';
import WhoWeServe from '../Components/About/WhoWeServe';
import OurValues from '../Components/About/OurValues';
import AlumnLinkDifference from '../Components/About/AlumnLinkDifference';
import OurTeam from '../Components/About/OurTeam';
import OurStory from '../Components/About/OurStory';

const About = () => {
  // Who We Help data
  const whoWeServeItems = [
    {
      icon: <Users size={48} />,
      title: "Graduates", 
      description: "Empowering your career, expanding your network, finding guidance fast. Connect with mentors and discover opportunities within your alumni community."
    },
    {
      icon: <School size={48} />,
      title: "Alumni",
      description: "Reconnect, give back, discover new opportunities. Maintain lifelong connections with your alma mater and fellow graduates."
    },
    {
      icon: <Building size={48} />,
      title: "Institutions",
      description: "Keep alumni engaged, drive retention, boost community value. Build stronger relationships with graduates for sustainable growth."
    },
    {
      icon: <Briefcase size={48} />,
      title: "Career Services",
      description: "Unlocking new ways to connect students and alumni efficiently. Facilitate meaningful career guidance and networking opportunities."
    }
  ];

  // Our Core Values data
  const ourValues = [
    {
      title: "Connection Over Everything",
      description: "Real, lasting connections are at the heart of progress. We prioritize meaningful relationships over superficial networking."
    },
    {
      title: "Opportunity for All",
      description: "Every graduate should have access to support, mentors, and growth. We believe in democratizing access to alumni networks."
    },
    {
      title: "Lifelong Engagement", 
      description: "Alumni relationships don't stop at graduation—they grow for life. We build platforms for sustained community engagement."
    },
    {
      title: "Trust & Community",
      description: "Secure, authentic, and dedicated to alumni success. We maintain the highest standards of privacy and community integrity."
    }
  ];

  // Our Story data
  const ourStoryItems = [
    {
      icon: <Award size={32} />,
      title: "From Vision to Reality",
      description: "AlumnLink was founded in 2023 by a team of education technology enthusiasts who recognized a significant gap in how institutions maintained relationships with their alumni. Our founders, having experienced firsthand the challenges of staying connected with their alma maters, envisioned a platform that would transform alumni engagement."
    },
    {
      icon: <Briefcase size={32} />,
      title: "Growth and Innovation",
      description: "What began as a simple alumni directory has evolved into a comprehensive platform with advanced networking capabilities, event management, job boards, and fundraising tools. Today, AlumnLink serves hundreds of educational institutions and connects thousands of alumni worldwide."
    },
    {
      icon: <Users size={32} />,
      title: "Looking Forward",
      description: "Our vision for the future is to continue expanding our platform's capabilities, leveraging emerging technologies like AI and data analytics to provide even more personalized experiences for alumni and valuable insights for institutions. We are committed to fostering stronger connections and creating opportunities that benefit the entire educational ecosystem."
    }
  ];

  // Our Team data - removed specific roles and kept the rest of the data
  const teamMembers = [

    {
      name: "Lokesh Tiwari",
      image: "https://api.dicebear.com/6.x/initials/svg?seed=LT&backgroundColor=fe6019",
      description: "Lokesh combines strong design sensibilities with technical expertise to create intuitive and engaging user experiences for our platform.",
      social: {
        linkedin: "#",
        github: "#",
        email: "lokesh@alumnlink.com"
      }
    },
    {
      name: "Krishna Bansal",
      image: "https://api.dicebear.com/6.x/initials/svg?seed=KB&backgroundColor=fe6019",
      description: "With expertise in full-stack development and a passion for education technology, Krishna leads our development efforts and overall product vision.",
      social: {
        linkedin: "#",
        github: "#",
        email: "krishna@alumnlink.com"
      }
    },
    {
      name: "Laxmi Rajput",
      image: "https://api.dicebear.com/6.x/initials/svg?seed=LR&backgroundColor=fe6019",
      description: "Laxmi architects our robust backend systems and database infrastructure, ensuring AlumnLink is secure, scalable, and reliable.",
      social: {
        linkedin: "#",
        github: "#",
        email: "laxmi@alumnlink.com"
      }
    }
  ];

  // Animation variants
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="pt-28 pb-16 bg-gradient-to-br from-white via-[#fff8f5] to-[#ffe8de]">
      {/* About Hero Section */}
      <AboutHero />

      {/* Our Mission & Vision */}
      <OurMission />

      {/* What Is AlumnLink */}
      <WhatIsAlumnLink />

      {/* Who We Help */}
      <WhoWeServe 
        whoWeServeItems={whoWeServeItems} 
        containerVariants={containerVariants} 
        itemVariants={itemVariants} 
      />

      {/* Our Core Values */}
      {/* <OurValues 
        ourValues={ourValues} 
        containerVariants={containerVariants} 
        itemVariants={itemVariants} 
      /> */}

      {/* The AlumnLink Difference */}
      <AlumnLinkDifference />

      {/* Join Us CTA */}
      <CallToAction
        gradient={true}
        title="Join the AlumnLink Community"
        description="Be part of a platform that's transforming how educational institutions and alumni connect."
        primaryButtonText="Get Early Access"
        primaryButtonLink="/signup"
        secondaryButtonText="Contact Us"
        secondaryButtonLink="/landing/contact"
      />
    </div>
  );
};

export default About;