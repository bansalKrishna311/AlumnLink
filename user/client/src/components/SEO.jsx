import { useEffect } from 'react';

const SEO = ({ 
  title = "AlumnLink - The Ultimate Alumni Engagement Platform",
  description = "AlumnLink is a social networking platform designed for alumni, helping institutions build strong, engaged communities. Reconnect, network, and grow with us.",
  keywords = "alumni, alumni management, alumni network, alumni engagement, alumni relations, alumni platform, college alumni, university alumni, school alumni, alumnlink",
  ogImage = "https://www.alumnlink.com/banner.png",
  url = "https://www.alumnlink.com",
  canonical,
  noindex = false
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

    // Update meta description
    updateMetaTag('meta[name="description"]', description);
    
    // Update keywords
    updateMetaTag('meta[name="keywords"]', keywords);
    
    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', title);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:url"]', url);
    updateMetaTag('meta[property="og:image"]', ogImage);
    
    // Update Twitter Card tags
    updateMetaTag('meta[property="twitter:title"]', title);
    updateMetaTag('meta[property="twitter:description"]', description);
    updateMetaTag('meta[property="twitter:url"]', url);
    updateMetaTag('meta[property="twitter:image"]', ogImage);
    
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
    
  }, [title, description, keywords, ogImage, url, canonical, noindex]);

  return null; // This component doesn't render anything
};

export default SEO;
