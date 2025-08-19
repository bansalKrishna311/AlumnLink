import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import SEO from '../../../components/SEO';

const BlogHome = () => {
  const featuredPosts = [
    {
      id: 1,
      title: "10 Alumni Engagement Strategies That Actually Work in 2025",
      excerpt: "Discover proven strategies to boost alumni participation, increase donations, and build stronger institutional relationships. Learn from successful case studies and data-driven insights.",
      author: "AlumnLink Team",
      date: "2025-08-15",
      readTime: "8 min read",
      category: "Alumni Engagement",
      image: "/blog/alumni-engagement-strategies.jpg",
      slug: "alumni-engagement-strategies-2025"
    },
    {
      id: 2,
      title: "Building Strong Alumni Networks: A Complete Guide for Educational Institutions",
      excerpt: "Step-by-step guide to creating and maintaining powerful alumni networks. Includes best practices, technology solutions, and measurement frameworks.",
      author: "Krishna Bansal",
      date: "2025-08-12",
      readTime: "12 min read",
      category: "Network Building",
      image: "/blog/building-alumni-networks.jpg",
      slug: "building-strong-alumni-networks-guide"
    },
    {
      id: 3,
      title: "How Alumni Management Software Transforms Institutional Relationships",
      excerpt: "Explore how modern alumni platforms revolutionize engagement, streamline communication, and drive institutional growth through data-driven insights.",
      author: "Lokesh Tiwari",
      date: "2025-08-10",
      readTime: "10 min read",
      category: "Technology",
      image: "/blog/alumni-software-transformation.jpg",
      slug: "alumni-management-software-transformation"
    },
    {
      id: 4,
      title: "The ROI of Alumni Engagement: Measuring Success and Impact",
      excerpt: "Learn how to quantify the value of alumni programs, track engagement metrics, and demonstrate tangible returns on investment in alumni relations.",
      author: "Laxmi Rajput",
      date: "2025-08-08",
      readTime: "9 min read",
      category: "Analytics",
      image: "/blog/alumni-engagement-roi.jpg",
      slug: "measuring-alumni-engagement-roi"
    },
    {
      id: 5,
      title: "Digital Alumni Directories: Best Practices and Implementation Guide",
      excerpt: "Everything you need to know about creating and managing digital alumni directories. Includes privacy considerations, search functionality, and user experience design.",
      author: "AlumnLink Team",
      date: "2025-08-05",
      readTime: "11 min read",
      category: "Digital Tools",
      image: "/blog/digital-alumni-directories.jpg",
      slug: "digital-alumni-directories-best-practices"
    },
    {
      id: 6,
      title: "Alumni Career Services: Connecting Graduates with Opportunities",
      excerpt: "Comprehensive guide to building effective alumni career services, including job boards, mentorship programs, and professional development resources.",
      author: "AlumnLink Team",
      date: "2025-08-03",
      readTime: "7 min read",
      category: "Career Services",
      image: "/blog/alumni-career-services.jpg",
      slug: "alumni-career-services-guide"
    }
  ];

  const categories = [
    "Alumni Engagement",
    "Network Building",
    "Technology",
    "Analytics",
    "Digital Tools",
    "Career Services",
    "Fundraising",
    "Events Management"
  ];

  return (
    <>
      <SEO 
        title="AlumnLink Blog - Alumni Management Insights, Strategies & Best Practices"
        description="Stay updated with the latest alumni engagement strategies, networking tips, and educational technology insights. Expert articles on alumni management, institutional relationships, and professional networking from the AlumnLink platform."
        keywords="alumni management blog, alumni engagement strategies, educational institution insights, alumni networking tips, institutional relationship building, alumni platform best practices, educational technology articles, alumni success stories, professional networking advice, alumni career guidance, institutional development blog"
        url="https://www.alumnlink.com/blog"
        canonical="https://www.alumnlink.com/blog"
        lastModified="2025-08-19"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "AlumnLink Blog",
          "description": "Expert insights on alumni management, engagement strategies, and educational technology",
          "url": "https://www.alumnlink.com/blog",
          "publisher": {
            "@type": "Organization",
            "name": "AlumnLink"
          },
          "blogPost": featuredPosts.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "url": `https://www.alumnlink.com/blog/${post.slug}`,
            "datePublished": post.date,
            "author": {
              "@type": "Person",
              "name": post.author
            }
          }))
        }}
        breadcrumbs={[
          { name: "Home", url: "https://www.alumnlink.com" },
          { name: "Blog", url: "https://www.alumnlink.com/blog" }
        ]}
      />
      
      <div className="pt-28 pb-16 bg-gradient-to-br from-white via-[#fff8f5] to-[#ffe8de] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Alumni Management <span className="text-[#fe6019]">Insights</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Stay ahead with expert insights on alumni engagement, networking strategies, and educational technology. 
              Learn from successful institutions and discover best practices for building stronger alumni communities.
            </p>
          </div>

          {/* Categories Filter */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Browse by Category</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-[#fe6019] hover:text-[#fe6019] transition-colors duration-200"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/banner.png'; // Fallback image
                    }}
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-[#fe6019]/10 text-[#fe6019] text-sm font-medium rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock size={16} className="mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-[#fe6019] transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <User size={16} className="mr-2" />
                      <span>{post.author}</span>
                      <Calendar size={16} className="ml-4 mr-2" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="flex items-center text-[#fe6019] hover:text-[#e55517] font-medium transition-colors"
                    >
                      Read More
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 bg-gradient-to-r from-[#fe6019] to-[#e55517] rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with Alumni Insights</h2>
            <p className="text-xl mb-6 opacity-90">
              Get the latest strategies, tips, and insights delivered to your inbox weekly.
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
        </div>
      </div>
    </>
  );
};

export default BlogHome;
