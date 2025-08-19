import { useEffect } from 'react';

const SEO = ({ 
  title = "AlumnLink - Alumni Management Platform | Connect, Engage, Thrive",
  description = "Transform your institution's alumni engagement with AlumnLink. Connect graduates through our comprehensive networking platform. Features include alumni directory, career portal, events management, and fundraising tools. Modern alumni management solution.",
  keywords = "alumni management platform india, alumni networking platform, educational institution software, college alumni portal, university alumni management, alumni engagement tools, alumni directory software, alumni community platform, alumni portal development, alumni database management, alumni networking events, alumni career portal, alumni fundraising platform, alumni social network, alumni management system, educational technology india, institutional alumni relations, alumni communication platform, alumni mentorship programs, professional networking platform, alumni analytics, alumni mobile app, alumni engagement strategies, alumni relationship management, alumni tracking system",
  ogImage = "https://www.alumnlink.com/banner.png",
  url = "https://www.alumnlink.com",
  canonical,
  noindex = false,
  schemaData,
  articleData,
  breadcrumbs,
  lastModified
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Helper function to update meta tag
    const updateMetaTag = (selector, content) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          element.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
        } else {
          element.setAttribute('name', selector.match(/name="([^"]+)"/)[1]);
        }
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Helper function to add/update link tag
    const updateLinkTag = (rel, href, attributes = {}) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (element) {
        element.setAttribute('href', href);
      } else {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        element.setAttribute('href', href);
        Object.keys(attributes).forEach(attr => {
          element.setAttribute(attr, attributes[attr]);
        });
        document.head.appendChild(element);
      }
    };

    // Update basic meta tags
    updateMetaTag('meta[name="description"]', description);
    updateMetaTag('meta[name="keywords"]', keywords);
    
    // Update enhanced meta tags
    updateMetaTag('meta[name="author"]', 'AlumnLink Team');
    updateMetaTag('meta[name="copyright"]', `© ${new Date().getFullYear()} AlumnLink. All rights reserved.`);
    updateMetaTag('meta[name="publisher"]', 'AlumnLink');
    updateMetaTag('meta[name="language"]', 'English');
    updateMetaTag('meta[name="revisit-after"]', '1 days');
    updateMetaTag('meta[name="distribution"]', 'global');
    updateMetaTag('meta[name="rating"]', 'general');
    updateMetaTag('meta[name="classification"]', 'Education, Technology, Business');
    
    // Geographic meta tags
    updateMetaTag('meta[name="geo.region"]', 'IN-DL');
    updateMetaTag('meta[name="geo.placename"]', 'New Delhi, India');
    updateMetaTag('meta[name="geo.position"]', '28.6139;77.2090');
    updateMetaTag('meta[name="ICBM"]', '28.6139, 77.2090');
    
    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', title);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:url"]', url);
    updateMetaTag('meta[property="og:image"]', ogImage);
    updateMetaTag('meta[property="og:image:width"]', '1200');
    updateMetaTag('meta[property="og:image:height"]', '630');
    updateMetaTag('meta[property="og:image:alt"]', 'AlumnLink - Alumni Management Platform');
    updateMetaTag('meta[property="og:type"]', 'website');
    updateMetaTag('meta[property="og:site_name"]', 'AlumnLink');
    updateMetaTag('meta[property="og:locale"]', 'en_IN');
    
    // Update Twitter Card tags
    updateMetaTag('meta[property="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[property="twitter:title"]', title);
    updateMetaTag('meta[property="twitter:description"]', description);
    updateMetaTag('meta[property="twitter:url"]', url);
    updateMetaTag('meta[property="twitter:image"]', ogImage);
    updateMetaTag('meta[property="twitter:image:alt"]', 'AlumnLink Alumni Management Platform');
    updateMetaTag('meta[property="twitter:site"]', '@alumn_link');
    updateMetaTag('meta[property="twitter:creator"]', '@alumn_link');
    
    // Additional social media meta tags
    updateMetaTag('meta[property="instagram:site"]', '@alumnlink');
    updateMetaTag('meta[property="linkedin:site"]', 'company/aumnlink');
    
    // Update canonical URL
    const canonicalUrl = canonical || url;
    updateLinkTag('canonical', canonicalUrl);
    
    // Update alternate links for language/region
    updateLinkTag('alternate', canonicalUrl, { hreflang: 'en-IN' });
    updateLinkTag('alternate', canonicalUrl, { hreflang: 'en' });
    
    // DNS prefetch for performance
    updateLinkTag('dns-prefetch', '//fonts.googleapis.com');
    updateLinkTag('dns-prefetch', '//www.google-analytics.com');
    updateLinkTag('dns-prefetch', '//www.googletagmanager.com');
    updateLinkTag('preconnect', 'https://fonts.gstatic.com', { crossorigin: '' });
    
    // Update robots meta tag
    const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
    updateMetaTag('meta[name="robots"]', robotsContent);
    updateMetaTag('meta[name="googlebot"]', robotsContent);
    updateMetaTag('meta[name="bingbot"]', robotsContent);
    
    // Last modified date
    if (lastModified) {
      updateMetaTag('meta[name="date"]', lastModified);
      updateMetaTag('meta[property="article:modified_time"]', lastModified);
    }
    
    // Remove and add structured data if provided
    const existingSchema = document.querySelector('#dynamic-schema');
    if (existingSchema) {
      existingSchema.remove();
    }
    
    if (schemaData) {
      const schemaScript = document.createElement('script');
      schemaScript.id = 'dynamic-schema';
      schemaScript.type = 'application/ld+json';
      schemaScript.textContent = JSON.stringify(schemaData);
      document.head.appendChild(schemaScript);
    }
    
    // Add breadcrumb schema if provided
    if (breadcrumbs) {
      const existingBreadcrumb = document.querySelector('#breadcrumb-schema');
      if (existingBreadcrumb) {
        existingBreadcrumb.remove();
      }
      
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      };
      
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.id = 'breadcrumb-schema';
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(breadcrumbScript);
    }
    
    // Add article schema if provided
    if (articleData) {
      const existingArticle = document.querySelector('#article-schema');
      if (existingArticle) {
        existingArticle.remove();
      }
      
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": articleData.headline || title,
        "description": articleData.description || description,
        "image": articleData.image || ogImage,
        "author": {
          "@type": "Organization",
          "name": "AlumnLink"
        },
        "publisher": {
          "@type": "Organization",
          "name": "AlumnLink",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.alumnlink.com/logo copy.png"
          }
        },
        "datePublished": articleData.datePublished,
        "dateModified": articleData.dateModified || lastModified,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        }
      };
      
      const articleScript = document.createElement('script');
      articleScript.id = 'article-schema';
      articleScript.type = 'application/ld+json';
      articleScript.textContent = JSON.stringify(articleSchema);
      document.head.appendChild(articleScript);
    }
    
  }, [title, description, keywords, ogImage, url, canonical, noindex, schemaData, articleData, breadcrumbs, lastModified]);

  return null; // This component doesn't render anything
};

export default SEO;
