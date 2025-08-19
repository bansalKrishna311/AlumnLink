// Meta tags configuration for different pages
export const metaConfigs = {
  home: {
    title: "AlumnLink - Alumni Management Platform | Connect Graduates",
    description: "Transform your institution's alumni engagement with AlumnLink - alumni networking platform. Connect graduates through comprehensive management tools including alumni directory, career portal, events management, fundraising platform, and professional networking. Building stronger alumni communities. Free demo available.",
    keywords: "alumni management platform india, alumni networking platform, educational institution software india, college alumni portal, university alumni management, alumni engagement tools, alumni directory software, alumni community platform, alumni portal development, alumni database management, alumni networking events, alumni career portal, alumni fundraising platform, alumni social network india, alumni management system, educational technology india, institutional alumni relations, alumni communication platform, alumni mentorship programs, professional networking platform, alumni analytics dashboard, alumni mobile app, alumni engagement strategies, alumni relationship management, alumni tracking system, alumni platform india, alumni management software, alumni management solutions, alumni network building, alumni connect platform",
    ogImage: "https://www.alumnlink.com/banner.png"
  },
  
  about: {
    title: "About AlumnLink - Alumni Management Platform | Our Story & Mission",
    description: "Discover how AlumnLink is transforming alumni engagement. Founded in 2023, we connect graduates through comprehensive networking tools. Learn about our mission to strengthen institutional relationships and alumni communities. Meet our team building the future of alumni management.",
    keywords: "about alumnlink, alumni management company, alumni platform company india, educational technology company, alumni networking company, institutional software provider, alumni engagement solutions, educational institution partnerships, alumni platform development, alumni management team, alumni technology founders, educational innovation company",
    ogImage: "https://www.alumnlink.com/banner.png"
  },

  forInstitutes: {
    title: "AlumnLink for Educational Institutes - Alumni Management Platform | Boost Engagement & Fundraising",
    description: "Transform your educational institute's alumni network with AlumnLink's comprehensive management platform. Strengthen institutional relationships and enhance alumni engagement. Tools for colleges, universities, and schools. Free demo available.",
    keywords: "alumni management platform for colleges, university alumni software india, educational institute alumni portal, college alumni engagement platform, alumni fundraising software, institutional alumni relations, alumni network management, alumni directory software for universities, alumni management system for colleges, educational institution technology, alumni engagement tools india, college fundraising platform, university alumni database, institutional development software, alumni relationship management platform",
    ogImage: "https://www.alumnlink.com/banner.png"
  },

  forAlumni: {
    title: "AlumnLink for Alumni - Professional Networking & Career Growth Platform | Connect with Graduates",
    description: "Advance your career and expand your professional network with AlumnLink. Connect with fellow alumni, find mentorship opportunities, discover job openings, and access exclusive events. Join our growing alumni networking community and unlock new possibilities.",
    keywords: "alumni networking platform, professional networking for graduates, alumni career opportunities, alumni mentorship programs, graduate networking india, alumni job portal, professional development for alumni, alumni community platform, career advancement for graduates, alumni professional network",
    ogImage: "https://www.alumnlink.com/banner.png"
  },

  forCorporates: {
    title: "AlumnLink for Corporates - Access Quality Talent Through Alumni Networks | Recruit Quality Candidates",
    description: "Connect with pre-vetted, high-quality talent through educational institution alumni networks. Access diverse candidate pools, reduce hiring costs, and build lasting partnerships with leading institutions. Trusted by top companies for strategic talent acquisition.",
    keywords: "corporate alumni recruitment, talent acquisition through alumni, alumni hiring platform, corporate university partnerships, quality candidate sourcing, alumni talent pool, institutional recruitment partnerships, graduate hiring platform, alumni network recruiting, corporate alumni programs",
    ogImage: "https://www.alumnlink.com/banner.png"
  },

  forSchools: {
    title: "AlumnLink for Schools - Student Alumni Engagement Platform | Build Lifelong Communities",
    description: "Create lasting connections between your school and graduates. Engage young alumni, facilitate peer mentorship, showcase success stories, and build a thriving community that supports current students. Perfect for high schools and K-12 institutions.",
    keywords: "school alumni platform, high school alumni network, K-12 alumni engagement, student alumni mentorship, school community building, young alumni engagement, school alumni directory, student success platform, educational community platform, school alumni management",
    ogImage: "https://www.alumnlink.com/banner.png"
  },

  features: {
    title: "AlumnLink Features - Comprehensive Alumni Management Platform Tools & Capabilities",
    description: "Explore AlumnLink's powerful features: smart alumni directory, event management, career portal, fundraising tools, analytics dashboard, mobile apps, and more. Everything your institution needs to build thriving alumni communities.",
    keywords: "alumni management features, alumni directory software, alumni event management, alumni career portal, alumni fundraising platform, alumni analytics dashboard, alumni mobile app, alumni networking tools, educational institution software features, alumni engagement platform capabilities",
    ogImage: "https://www.alumnlink.com/banner.png"
  },

  blog: {
    title: "AlumnLink Blog - Alumni Management Insights, Strategies & Best Practices",
    description: "Stay updated with the latest alumni engagement strategies, networking tips, and educational technology insights. Expert articles on alumni management, institutional relationships, and professional networking from the AlumnLink platform.",
    keywords: "alumni management blog, alumni engagement strategies, educational institution insights, alumni networking tips, institutional relationship building, alumni platform best practices, educational technology articles, alumni success stories, professional networking advice, alumni career guidance, institutional development blog",
    ogImage: "https://www.alumnlink.com/banner.png"
  },

  resources: {
    title: "Alumni Management Resources - Free Guides, Templates & Tools | AlumnLink",
    description: "Access free alumni management resources including strategy guides, ROI calculators, event templates, and success stories. Download practical tools to boost your institution's alumni engagement and build stronger relationships.",
    keywords: "alumni management resources, free alumni guides, alumni engagement templates, alumni ROI calculator, alumni event planning templates, alumni management tools, educational institution resources, alumni success stories, alumni networking ideas, alumni directory templates, institutional development resources",
    ogImage: "https://www.alumnlink.com/banner.png"
  },

  contact: {
    title: "Contact AlumnLink - Get Demo & Support | Alumni Platform",
    description: "Contact AlumnLink for personalized demos, pricing information, and support. Transform your institution's alumni engagement with our networking platform. Free consultation available.",
    keywords: "contact alumnlink, alumni platform demo, alumni management consultation, alumni software pricing, alumni platform support, educational technology consultation, alumni engagement demo, institutional software consultation",
    ogImage: "https://www.alumnlink.com/banner.png"
  }
};

// Function to generate meta tags
export const generateMetaTags = (pageKey) => {
  const config = metaConfigs[pageKey] || metaConfigs.home;
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    ogImage: config.ogImage,
    canonical: `https://www.alumnlink.com${pageKey === 'home' ? '' : `/${pageKey}`}`
  };
};

// Schema.org structured data templates
export const schemaTemplates = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AlumnLink",
    "alternateName": ["Alumni Link", "Alumn Link"],
    "description": "Alumni management platform connecting educational institutions with their graduates through comprehensive networking, mentorship, and career development tools.",
    "url": "https://www.alumnlink.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.alumnlink.com/logo copy.png",
      "width": "400",
      "height": "400"
    },
    "foundingDate": "2023",
    "sameAs": [
      "https://www.instagram.com/alumnlink/",
      "https://x.com/alumn_link",
      "https://www.linkedin.com/company/aumnlink/"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "support@alumnlink.com",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressRegion": "Delhi",
      "addressLocality": "New Delhi"
    }
  },

  software: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AlumnLink Alumni Management Platform",
    "applicationCategory": ["BusinessApplication", "EducationalApplication", "SocialNetworkingApplication"],
    "operatingSystem": ["Web Browser", "iOS", "Android"],
    "description": "Comprehensive alumni management and networking platform for educational institutions.",
    "url": "https://www.alumnlink.com",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "ratingCount": "50",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Free Alumni Platform",
        "price": "0",
        "priceCurrency": "INR"
      }
    ]
  }
};

export default { metaConfigs, generateMetaTags, schemaTemplates };
