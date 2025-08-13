import { useEffect } from 'react';

const SEO = ({ 
  title = "AlumnLink - India's Leading Alumni Engagement Platform | Connect, Network, Grow",
  description = "Transform your alumni network with AlumnLink - India's premier alumni management platform. Connect with fellow graduates, discover career opportunities, and build stronger institutional relationships. Join thousands of alumni already networking on our platform.",
  keywords = "alumni network India, alumni management software, alumni engagement platform, university alumni portal, college alumni directory, professional networking, career opportunities, alumni events, educational technology, institutional networking, graduate connections, mentorship programs, alumni association, alumni platform, education alumni",
  ogImage = "https://www.alumnlink.com/banner.png",
  url = "https://www.alumnlink.com",
  canonical,
  noindex = false,
  structuredData = null,
  breadcrumbs = null,
  articleData = null
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

    // Update basic meta tags
    updateMetaTag('meta[name="description"]', description);
    updateMetaTag('meta[name="keywords"]', keywords);
    
    // Update enhanced meta tags
    updateMetaTag('meta[name="author"]', 'AlumnLink Team');
    updateMetaTag('meta[name="publisher"]', 'AlumnLink');
    updateMetaTag('meta[name="copyright"]', '© 2025 AlumnLink. All rights reserved.');
    updateMetaTag('meta[name="classification"]', 'Education Technology');
    updateMetaTag('meta[name="category"]', 'Alumni Network');
    updateMetaTag('meta[name="news_keywords"]', 'alumni network, professional networking, educational technology, career opportunities, alumni management');
    
    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', title);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:url"]', url);
    updateMetaTag('meta[property="og:image"]', ogImage);
    updateMetaTag('meta[property="og:image:alt"]', 'AlumnLink - Alumni Networking Platform');
    updateMetaTag('meta[property="og:site_name"]', 'AlumnLink');
    updateMetaTag('meta[property="og:type"]', 'website');
    updateMetaTag('meta[property="og:locale"]', 'en_IN');
    
    // Update Twitter Card tags
    updateMetaTag('meta[property="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[property="twitter:site"]', '@Alumn_Link');
    updateMetaTag('meta[property="twitter:creator"]', '@Alumn_Link');
    updateMetaTag('meta[property="twitter:title"]', title);
    updateMetaTag('meta[property="twitter:description"]', description);
    updateMetaTag('meta[property="twitter:url"]', url);
    updateMetaTag('meta[property="twitter:image"]', ogImage);
    updateMetaTag('meta[property="twitter:image:alt"]', 'AlumnLink Alumni Platform');
    
    // Update LinkedIn specific tags
    updateMetaTag('meta[property="linkedin:owner"]', 'AlumnLink');
    
    // Update mobile and app tags
    updateMetaTag('meta[name="mobile-web-app-capable"]', 'yes');
    updateMetaTag('meta[name="apple-mobile-web-app-capable"]', 'yes');
    updateMetaTag('meta[name="apple-mobile-web-app-status-bar-style"]', 'black-translucent');
    updateMetaTag('meta[name="apple-mobile-web-app-title"]', 'AlumnLink');
    updateMetaTag('meta[name="application-name"]', 'AlumnLink');
    updateMetaTag('meta[name="msapplication-TileColor"]', '#fe6019');
    updateMetaTag('meta[name="theme-color"]', '#fe6019');
    
    // Update search engine specific tags
    updateMetaTag('meta[name="googlebot"]', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMetaTag('meta[name="bingbot"]', 'index, follow');
    
    // Update canonical URL if provided
    if (canonical) {
      let canonicalElement = document.querySelector('link[rel="canonical"]');
      if (canonicalElement) {
        canonicalElement.setAttribute('href', canonical);
      } else {
        canonicalElement = document.createElement('link');
        canonicalElement.setAttribute('rel', 'canonical');
        canonicalElement.setAttribute('href', canonical);
        document.head.appendChild(canonicalElement);
      }
    }
    
    // Update robots meta tag
    const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
    updateMetaTag('meta[name="robots"]', robotsContent);
    
    // Add structured data if provided
    if (structuredData) {
      let existingScript = document.querySelector('script[type="application/ld+json"][data-dynamic="true"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
    
    // Add breadcrumb structured data if provided
    if (breadcrumbs) {
      let existingBreadcrumb = document.querySelector('script[type="application/ld+json"][data-breadcrumb="true"]');
      if (existingBreadcrumb) {
        existingBreadcrumb.remove();
      }
      
      const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url
        }))
      };
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-breadcrumb', 'true');
      script.textContent = JSON.stringify(breadcrumbData);
      document.head.appendChild(script);
    }
    
    // Add article structured data if provided
    if (articleData) {
      let existingArticle = document.querySelector('script[type="application/ld+json"][data-article="true"]');
      if (existingArticle) {
        existingArticle.remove();
      }
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-article', 'true');
      script.textContent = JSON.stringify(articleData);
      document.head.appendChild(script);
    }
    
  }, [title, description, keywords, ogImage, url, canonical, noindex, structuredData, breadcrumbs, articleData]);

  return null; // This component doesn't render anything
};

export default SEO;
