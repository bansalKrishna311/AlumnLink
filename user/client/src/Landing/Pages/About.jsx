import React from 'react';
import { School, Building, Award, Briefcase, Users } from 'lucide-react';
import CallToAction from '../Components/CallToAction';

// Import our newly created components
import AboutHero from '../Components/About/AboutHero';
import OurMission from '../Components/About/OurMission';
import WhoWeServe from '../Components/About/WhoWeServe';
import OurTeam from '../Components/About/OurTeam';
import OurStory from '../Components/About/OurStory';
import OurValues from '../Components/About/OurValues';

const About = () => {
  // Who We Serve data
  const whoWeServeItems = [
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
  ];

  // Our Values data
  const ourValues = [
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

      {/* Our Mission */}
      <OurMission />

      {/* Who We Serve */}
      <WhoWeServe 
        whoWeServeItems={whoWeServeItems} 
        containerVariants={containerVariants} 
        itemVariants={itemVariants} 
      />

      {/* Our Team Section */}
      <OurTeam 
        teamMembers={teamMembers} 
        containerVariants={containerVariants} 
        itemVariants={itemVariants} 
      />

      {/* Our Story */}
      <OurStory ourStoryItems={ourStoryItems} />

      {/* Our Values */}
      <OurValues 
        ourValues={ourValues} 
        containerVariants={containerVariants} 
        itemVariants={itemVariants} 
      />

      {/* Join Us CTA */}
      <CallToAction
        gradient={true}
        title="Join the AlumnLink Community"
        description="Be part of a platform that's transforming how educational institutions and alumni connect."
        primaryButtonText="Sign Up Today"
        primaryButtonLink="/signup"
        secondaryButtonText="Contact Us"
        secondaryButtonLink="/landing/contact"
      />
    </div>
  );
};

export default About;