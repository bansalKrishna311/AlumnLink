import React from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, Video, Users, TrendingUp, Award } from 'lucide-react';
import SEO from '../../../components/SEO';

const ResourceCenter = () => {
  const resources = [
    {
      id: 1,
      title: "The Complete Alumni Engagement Playbook 2025",
      description: "A comprehensive 50-page guide covering everything from alumni onboarding to advanced engagement strategies. Includes templates, checklists, and case studies.",
      type: "PDF Guide",
      downloadUrl: "/resources/alumni-engagement-playbook-2025.pdf",
      icon: <FileText size={24} />,
      featured: true,
      category: "Strategy Guide"
    },
    {
      id: 2,
      title: "Alumni ROI Calculator Spreadsheet",
      description: "Calculate the return on investment of your alumni programs. Pre-built formulas help you track engagement metrics and financial impact.",
      type: "Excel Template",
      downloadUrl: "/resources/alumni-roi-calculator.xlsx",
      icon: <Download size={24} />,
      featured: true,
      category: "Tools"
    },
    {
      id: 3,
      title: "Digital Alumni Directory Best Practices Webinar",
      description: "Watch our 45-minute webinar on creating and managing effective digital alumni directories. Includes Q&A session with expert insights.",
      type: "Video Webinar",
      downloadUrl: "/resources/digital-directory-webinar.mp4",
      icon: <Video size={24} />,
      featured: false,
      category: "Webinar"
    },
    {
      id: 4,
      title: "Alumni Event Planning Template Kit",
      description: "Complete set of templates for planning successful alumni events. Includes timeline templates, budget trackers, and marketing materials.",
      type: "Template Kit",
      downloadUrl: "/resources/event-planning-templates.zip",
      icon: <FileText size={24} />,
      featured: false,
      category: "Templates"
    },
    {
      id: 5,
      title: "Alumni Management Success Stories Collection",
      description: "Real case studies from 20+ educational institutions showing how they transformed their alumni engagement using digital platforms.",
      type: "Case Study Collection",
      downloadUrl: "/resources/success-stories-collection.pdf",
      icon: <Award size={24} />,
      featured: true,
      category: "Case Studies"
    },
    {
      id: 6,
      title: "Alumni Networking Event Ideas Handbook",
      description: "50+ creative ideas for alumni networking events, from virtual coffee chats to industry-specific meetups. Includes step-by-step implementation guides.",
      type: "Ideas Handbook",
      downloadUrl: "/resources/networking-events-handbook.pdf",
      icon: <Users size={24} />,
      featured: false,
      category: "Ideas"
    }
  ];

  const categories = ["All", "Strategy Guide", "Tools", "Webinar", "Templates", "Case Studies", "Ideas"];

  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredResources = selectedCategory === "All" 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  return (
    <>
      <SEO 
        title="Alumni Management Resources - Free Guides, Templates & Tools | AlumnLink"
        description="Access free alumni management resources including strategy guides, ROI calculators, event templates, and success stories. Download practical tools to boost your institution's alumni engagement and build stronger relationships."
        keywords="alumni management resources, free alumni guides, alumni engagement templates, alumni ROI calculator, alumni event planning templates, alumni management tools, educational institution resources, alumni success stories, alumni networking ideas, alumni directory templates, institutional development resources"
        url="https://www.alumnlink.com/resources"
        canonical="https://www.alumnlink.com/resources"
        lastModified="2025-08-19"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Alumni Management Resource Center",
          "description": "Free resources for alumni management and engagement",
          "url": "https://www.alumnlink.com/resources",
          "hasPart": resources.map(resource => ({
            "@type": "DigitalDocument",
            "name": resource.title,
            "description": resource.description,
            "url": `https://www.alumnlink.com${resource.downloadUrl}`,
            "fileFormat": resource.type
          }))
        }}
        breadcrumbs={[
          { name: "Home", url: "https://www.alumnlink.com" },
          { name: "Resources", url: "https://www.alumnlink.com/resources" }
        ]}
      />
      
      <div className="pt-28 pb-16 bg-gradient-to-br from-white via-[#fff8f5] to-[#ffe8de] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Alumni Management <span className="text-[#fe6019]">Resource Center</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Free guides, templates, and tools to help educational institutions build stronger alumni communities and increase engagement.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-[#fe6019] text-white shadow-lg'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-[#fe6019] hover:text-[#fe6019]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Resources */}
          {selectedCategory === "All" && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resources.filter(resource => resource.featured).map((resource) => (
                  <div key={resource.id} className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-[#fe6019]/10">
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-[#fe6019]/10 rounded-lg flex items-center justify-center text-[#fe6019]">
                          {resource.icon}
                        </div>
                        <div className="flex-1">
                          <span className="inline-block px-3 py-1 bg-[#fe6019]/10 text-[#fe6019] text-sm font-medium rounded-full mb-2">
                            {resource.category}
                          </span>
                          <p className="text-sm text-gray-500">{resource.type}</p>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {resource.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {resource.description}
                      </p>
                      
                      <a 
                        href={resource.downloadUrl}
                        download
                        className="inline-flex items-center gap-2 w-full bg-[#fe6019] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e55517] transition-colors justify-center"
                      >
                        <Download size={20} />
                        Download Free
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Resources Grid */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {selectedCategory === "All" ? "All Resources" : `${selectedCategory} Resources`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#fe6019]/10 rounded-lg flex items-center justify-center text-[#fe6019] flex-shrink-0">
                        {resource.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                            {resource.category}
                          </span>
                          <span className="text-sm text-gray-500">{resource.type}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {resource.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4">
                          {resource.description}
                        </p>
                        
                        <a 
                          href={resource.downloadUrl}
                          download
                          className="inline-flex items-center gap-2 bg-[#fe6019] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#e55517] transition-colors"
                        >
                          <Download size={16} />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 bg-gradient-to-r from-[#fe6019] to-[#e55517] rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Get New Resources First</h2>
            <p className="text-xl mb-6 opacity-90">
              Subscribe to receive the latest alumni management resources, guides, and tools.
            </p>
            <div className="max-w-md mx-auto flex gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <button className="px-6 py-3 bg-white text-[#fe6019] font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Personalized Help?</h3>
            <p className="text-lg text-gray-600 mb-6">
              Our alumni management experts are here to help you implement these strategies at your institution.
            </p>
            <Link 
              to="/Landing/contact"
              className="inline-flex items-center gap-2 bg-[#fe6019] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#e55517] transition-colors"
            >
              Schedule Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResourceCenter;
