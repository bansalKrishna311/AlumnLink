// SEO and Analytics tracking
(function() {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: document.title,
      page_location: window.location.href,
      content_group1: 'Alumni Management Platform',
      content_group2: 'Educational Technology'
    });
  }

  // Performance monitoring
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          // Track LCP for SEO performance
          if (typeof gtag !== 'undefined') {
            gtag('event', 'LCP', {
              value: Math.round(entry.startTime),
              event_category: 'Web Vitals',
              non_interaction: true
            });
          }
        }
      }
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // Track scroll depth for engagement
  let maxScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      if (maxScroll % 25 === 0 && typeof gtag !== 'undefined') {
        gtag('event', 'scroll', {
          value: maxScroll,
          event_category: 'Engagement',
          non_interaction: true
        });
      }
    }
  });

  // Track time on page
  const startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    if (typeof gtag !== 'undefined') {
      gtag('event', 'time_on_page', {
        value: timeOnPage,
        event_category: 'Engagement',
        non_interaction: true
      });
    }
  });
})();
