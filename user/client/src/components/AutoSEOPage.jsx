import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';

/**
 * ZERO-EFFORT SEO PAGE GENERATOR
 * =================================
 * This single component handles HUNDREDS of SEO pages automatically
 * No manual content creation needed - just smart templates!
 */

const AutoSEOPage = () => {
  const { pathname } = useLocation();
  const params = useParams();
  
  // Extract page type and identifier from URL
  const getPageData = () => {
    // City pages: /alumni-management-mumbai
    if (pathname.includes('alumni-management-')) {
      const city = pathname.split('alumni-management-')[1];
      return {
        type: 'city',
        identifier: city,
        title: `Alumni Management Platform in ${city.charAt(0).toUpperCase() + city.slice(1)} | AlumnLink`,
        description: `Best alumni management software for colleges and universities in ${city}. Connect graduates, manage events, and build networks.`,
        keywords: `alumni management ${city}, alumni platform ${city}, college alumni ${city}, university alumni ${city}`,
        h1: `Alumni Management Platform in ${city.charAt(0).toUpperCase() + city.slice(1)}`,
        content: generateCityContent(city)
      };
    }
    
    // Industry pages: /alumni-management-for-engineering-colleges
    if (pathname.includes('alumni-management-for-')) {
      const industry = pathname.split('alumni-management-for-')[1];
      const industryName = industry.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return {
        type: 'industry',
        identifier: industry,
        title: `Alumni Management for ${industryName} | AlumnLink`,
        description: `Specialized alumni management platform for ${industryName}. Connect graduates, manage events, and build stronger institutional relationships.`,
        keywords: `${industry} alumni management, ${industry} alumni platform, ${industry} graduate network`,
        h1: `Alumni Management for ${industryName}`,
        content: generateIndustryContent(industryName)
      };
    }
    
    // Comparison pages: /vs-almaconnect
    if (pathname.includes('/vs-')) {
      const competitor = pathname.split('/vs-')[1];
      return {
        type: 'comparison',
        identifier: competitor,
        title: `AlumnLink vs ${competitor.charAt(0).toUpperCase() + competitor.slice(1)} | Alumni Management Comparison`,
        description: `Compare AlumnLink with ${competitor}. See why institutions choose AlumnLink for alumni management.`,
        keywords: `alumnlink vs ${competitor}, ${competitor} alternative, alumni management comparison`,
        h1: `AlumnLink vs ${competitor.charAt(0).toUpperCase() + competitor.slice(1)}: Which is Better?`,
        content: generateComparisonContent(competitor)
      };
    }
    
    // How-to pages: /how-to-increase-alumni-engagement
    if (pathname.includes('/how-to-') || pathname.includes('/best-') || pathname.includes('/top-')) {
      const slug = pathname.substring(1);
      const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return {
        type: 'howto',
        identifier: slug,
        title: `${title} | AlumnLink`,
        description: `Complete guide to ${slug.replace(/-/g, ' ')}. Learn best practices and solutions with AlumnLink.`,
        keywords: `${slug.replace(/-/g, ' ')}, alumni management, educational institutions`,
        h1: title,
        content: generateHowToContent(title, slug)
      };
    }
    
    // Default fallback
    return {
      type: 'default',
      title: 'Alumni Management Platform | AlumnLink',
      description: 'Connect, engage, and manage your alumni community with AlumnLink.',
      keywords: 'alumni management, alumni platform, educational institutions',
      h1: 'Alumni Management Platform',
      content: generateDefaultContent()
    };
  };
  
  const generateCityContent = (city) => {
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
    return (
      <div className="auto-seo-page city-page">
        <section className="hero bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Alumni Management Platform in {cityName}
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Connect with alumni networks and educational institutions in {cityName}
            </p>
            <a href="/demo" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
              Get Free Demo
            </a>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why {cityName} Institutions Choose AlumnLink
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Local Alumni Networking</h3>
                <p>Connect alumni within {cityName} for local networking opportunities and meetups</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Event Management</h3>
                <p>Organize alumni events, reunions, and networking sessions in {cityName}</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Career Connections</h3>
                <p>Help alumni find career opportunities and mentorship in {cityName}</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Educational Institutions in {cityName}
            </h2>
            <p className="text-lg text-center max-w-3xl mx-auto">
              Partner with leading colleges and universities in {cityName} to build stronger alumni communities. 
              Our platform helps institutions maintain lifelong connections with their graduates.
            </p>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Alumni Engagement in {cityName}?
            </h2>
            <p className="text-lg mb-8">Join hundreds of institutions already using AlumnLink</p>
            <a href="/demo" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition">
              Get Free Demo
            </a>
          </div>
        </section>
      </div>
    );
  };
  
  const generateIndustryContent = (industryName) => (
    <div className="auto-seo-page industry-page">
      <section className="hero bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Alumni Management for {industryName}
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Specialized platform designed for {industryName} to connect graduates and build stronger institutional relationships
          </p>
          <a href="/demo" className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
            Get Free Demo
          </a>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features for {industryName}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Graduate Directory</h3>
              <p>Comprehensive directory of {industryName} graduates with professional profiles</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Career Services</h3>
              <p>Job placement assistance and career guidance for {industryName} alumni</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Industry Connections</h3>
              <p>Connect alumni working in relevant industries and specializations</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Why {industryName} Choose AlumnLink</h2>
          <div className="max-w-3xl mx-auto">
            <ul className="space-y-4 text-lg">
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                Specialized features designed for {industryName}
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                Industry-specific networking opportunities
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                Career advancement and mentorship tools
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                Event management for reunions and conferences
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
  
  const generateComparisonContent = (competitor) => {
    const competitorName = competitor.charAt(0).toUpperCase() + competitor.slice(1);
    return (
      <div className="auto-seo-page comparison-page">
        <section className="hero py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AlumnLink vs {competitorName}: Which is Better?
            </h1>
            <p className="text-xl mb-8">
              Compare features, pricing, and benefits to make the right choice for your institution
            </p>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-blue-800">AlumnLink</h3>
                <ul className="space-y-2">
                  <li>✓ Intuitive interface designed for educational institutions</li>
                  <li>✓ Transparent, affordable pricing</li>
                  <li>✓ Dedicated support team</li>
                  <li>✓ Fast implementation</li>
                  <li>✓ Mobile-optimized experience</li>
                </ul>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{competitorName}</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Complex interface</li>
                  <li>• Higher pricing tiers</li>
                  <li>• Limited support options</li>
                  <li>• Longer setup time</li>
                  <li>• Basic mobile features</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Switch to AlumnLink?</h2>
            <p className="text-lg mb-8">Join institutions making the smart choice</p>
            <a href="/demo" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition">
              Get Free Demo
            </a>
          </div>
        </section>
      </div>
    );
  };
  
  const generateHowToContent = (title, slug) => (
    <div className="auto-seo-page howto-page">
      <section className="hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>
          <p className="text-xl mb-8">
            Learn the best practices and strategies with AlumnLink
          </p>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2>Complete Guide</h2>
            <p>This comprehensive guide covers everything you need to know about {slug.replace(/-/g, ' ')}.</p>
            
            <h3>How AlumnLink Helps</h3>
            <p>AlumnLink provides comprehensive solutions for all your alumni management needs:</p>
            <ul>
              <li>Easy-to-use alumni directory with search and filtering</li>
              <li>Event management tools for reunions and networking</li>
              <li>Career portal and job board for alumni opportunities</li>
              <li>Fundraising and donation management system</li>
              <li>Analytics and reporting dashboard</li>
              <li>Mobile app for on-the-go access</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <a href="/demo" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition">
            Get Free Demo
          </a>
        </div>
      </section>
    </div>
  );
  
  const generateDefaultContent = () => (
    <div className="auto-seo-page">
      <section className="hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Alumni Management Platform</h1>
          <p className="text-xl mb-8">Connect, engage, and manage your alumni community</p>
          <a href="/demo" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition">
            Get Free Demo
          </a>
        </div>
      </section>
    </div>
  );
  
  const pageData = getPageData();
  
  return (
    <>
      <SEO 
        title={pageData.title}
        description={pageData.description}
        keywords={pageData.keywords}
        url={`https://www.alumnlink.com${pathname}`}
      />
      {pageData.content}
    </>
  );
};

export default AutoSEOPage;
