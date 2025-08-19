import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share, Facebook, Twitter, Linkedin } from 'lucide-react';
import SEO from '../../../components/SEO';

const BlogPost = ({ slug }) => {
  // This would typically fetch blog post data based on slug
  const blogPosts = {
    "alumni-engagement-strategies-2025": {
      title: "10 Alumni Engagement Strategies That Actually Work in 2025",
      excerpt: "Discover proven strategies to boost alumni participation, increase donations, and build stronger institutional relationships. Learn from successful case studies and data-driven insights.",
      content: `
        <h2>Introduction</h2>
        <p>Alumni engagement has evolved significantly in 2025, with new technologies and changing expectations driving institutions to adopt more sophisticated strategies. This comprehensive guide explores ten proven methods that are delivering real results for educational institutions across India.</p>
        
        <h2>1. Personalized Digital Experiences</h2>
        <p>Modern alumni expect personalized interactions. Successful institutions are leveraging data analytics to create tailored experiences that resonate with individual alumni interests and career paths.</p>
        
        <h2>2. Professional Networking Platforms</h2>
        <p>Digital networking platforms like AlumnLink are transforming how alumni connect with each other and their institutions. These platforms facilitate meaningful professional relationships and career advancement opportunities.</p>
        
        <h2>3. Mentorship Program Integration</h2>
        <p>Structured mentorship programs that connect experienced alumni with recent graduates create value for both parties while strengthening institutional bonds.</p>
        
        <h2>4. Career Development Resources</h2>
        <p>Providing ongoing career development support through workshops, webinars, and job placement services keeps alumni engaged while delivering tangible value.</p>
        
        <h2>5. Alumni-Led Events and Initiatives</h2>
        <p>Empowering alumni to organize and lead events creates stronger community ownership and increases participation rates significantly.</p>
        
        <h2>Conclusion</h2>
        <p>Implementing these strategies requires commitment and resources, but the long-term benefits for institutional relationships and alumni satisfaction are substantial. Start with one or two strategies and gradually expand your program.</p>
      `,
      author: "AlumnLink Team",
      date: "2025-08-15",
      readTime: "8 min read",
      category: "Alumni Engagement",
      image: "/blog/alumni-engagement-strategies.jpg",
      tags: ["alumni engagement", "educational institutions", "networking", "community building", "institutional development"]
    },
    "building-strong-alumni-networks-guide": {
      title: "Building Strong Alumni Networks: A Complete Guide for Educational Institutions",
      excerpt: "Step-by-step guide to creating and maintaining powerful alumni networks. Includes best practices, technology solutions, and measurement frameworks.",
      content: `
        <h2>Understanding Alumni Network Fundamentals</h2>
        <p>Building a strong alumni network requires strategic planning, consistent execution, and the right technology infrastructure. This guide provides actionable insights for institutions looking to strengthen their alumni communities.</p>
        
        <h2>Foundation Elements</h2>
        <p>Every successful alumni network starts with solid foundations: clear objectives, defined value propositions, and robust data management systems.</p>
        
        <h2>Technology Infrastructure</h2>
        <p>Modern alumni networks require sophisticated technology platforms that can handle directory management, event coordination, communication tools, and analytics tracking.</p>
        
        <h2>Engagement Strategies</h2>
        <p>Effective engagement goes beyond periodic newsletters. It involves creating meaningful touchpoints that provide value to alumni while advancing institutional goals.</p>
        
        <h2>Measuring Success</h2>
        <p>Establishing key performance indicators and tracking mechanisms ensures your alumni network initiatives are delivering measurable results.</p>
      `,
      author: "Krishna Bansal",
      date: "2025-08-12", 
      readTime: "12 min read",
      category: "Network Building",
      image: "/blog/building-alumni-networks.jpg",
      tags: ["alumni networks", "institutional strategy", "community building", "technology platforms", "engagement metrics"]
    }
  };

  const post = blogPosts[slug] || blogPosts["alumni-engagement-strategies-2025"];

  const relatedPosts = [
    {
      title: "Digital Alumni Directories: Best Practices and Implementation Guide",
      slug: "digital-alumni-directories-best-practices",
      image: "/blog/digital-alumni-directories.jpg"
    },
    {
      title: "The ROI of Alumni Engagement: Measuring Success and Impact", 
      slug: "measuring-alumni-engagement-roi",
      image: "/blog/alumni-engagement-roi.jpg"
    },
    {
      title: "Alumni Career Services: Connecting Graduates with Opportunities",
      slug: "alumni-career-services-guide", 
      image: "/blog/alumni-career-services.jpg"
    }
  ];

  return (
    <>
      <SEO 
        title={`${post.title} | AlumnLink Blog`}
        description={post.excerpt}
        keywords={`${post.tags.join(', ')}, alumni management, educational institutions, professional networking`}
        url={`https://www.alumnlink.com/blog/${slug}`}
        canonical={`https://www.alumnlink.com/blog/${slug}`}
        lastModified={post.date}
        ogImage={`https://www.alumnlink.com${post.image}`}
        articleData={{
          headline: post.title,
          description: post.excerpt,
          image: `https://www.alumnlink.com${post.image}`,
          datePublished: post.date,
          dateModified: post.date
        }}
        breadcrumbs={[
          { name: "Home", url: "https://www.alumnlink.com" },
          { name: "Blog", url: "https://www.alumnlink.com/blog" },
          { name: post.title, url: `https://www.alumnlink.com/blog/${slug}` }
        ]}
        schemaData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "image": `https://www.alumnlink.com${post.image}`,
          "author": {
            "@type": "Person",
            "name": post.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "AlumnLink",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.alumnlink.com/logo copy.png"
            }
          },
          "datePublished": post.date,
          "dateModified": post.date,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.alumnlink.com/blog/${slug}`
          },
          "keywords": post.tags,
          "articleSection": post.category
        }}
      />
      
      <div className="pt-28 pb-16 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back to Blog */}
          <Link 
            to="/blog"
            className="inline-flex items-center text-[#fe6019] hover:text-[#e55517] mb-8 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#fe6019]/10 text-[#fe6019] text-sm font-medium rounded-full">
                {post.category}
              </span>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock size={16} className="mr-1" />
                {post.readTime}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#fe6019] rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center text-gray-900 font-medium">
                    <User size={16} className="mr-2" />
                    {post.author}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar size={16} className="mr-2" />
                    {new Date(post.date).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
              
              {/* Share Buttons */}
              <div className="flex items-center gap-3">
                <span className="text-gray-600 text-sm mr-2">Share:</span>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-blue-700 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-8">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl"
              onError={(e) => {
                e.target.src = '/banner.png'; // Fallback image
              }}
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div 
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="text-gray-700 leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Related Posts */}
          <div className="border-t border-gray-200 pt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <Link 
                  key={index}
                  to={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                      src={relatedPost.image} 
                      alt={relatedPost.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/banner.png'; // Fallback image
                      }}
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 group-hover:text-[#fe6019] transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
