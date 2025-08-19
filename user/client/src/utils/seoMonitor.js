// SEO Performance Monitoring and Optimization Script
// This helps track and improve search visibility

class SEOMonitor {
  constructor() {
    this.performanceData = {};
    this.seoMetrics = {};
    this.init();
  }

  init() {
    this.trackPageLoad();
    this.monitorCoreWebVitals();
    this.trackUserEngagement();
    this.monitorSchemaErrors();
    this.trackLocalSEOSignals();
    this.setupSearchConsoleIntegration();
  }

  // Track page load performance for SEO
  trackPageLoad() {
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
      
      this.performanceData.pageLoad = {
        loadTime,
        domContentLoaded,
        timestamp: new Date().toISOString()
      };

      // Report to analytics if load time is poor (affects SEO)
      if (loadTime > 3000) {
        this.reportSEOIssue('slow_page_load', { loadTime });
      }
    });
  }

  // Monitor Core Web Vitals (crucial for Google ranking)
  monitorCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.seoMetrics.lcp = lastEntry.startTime;
      
      // Report if LCP is poor (> 2.5s)
      if (lastEntry.startTime > 2500) {
        this.reportSEOIssue('poor_lcp', { lcp: lastEntry.startTime });
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID) - Measured on interaction
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.seoMetrics.fid = entry.processingStart - entry.startTime;
        
        // Report if FID is poor (> 100ms)
        if (entry.processingStart - entry.startTime > 100) {
          this.reportSEOIssue('poor_fid', { fid: entry.processingStart - entry.startTime });
        }
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      
      this.seoMetrics.cls = clsValue;
      
      // Report if CLS is poor (> 0.1)
      if (clsValue > 0.1) {
        this.reportSEOIssue('poor_cls', { cls: clsValue });
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Track user engagement signals that affect SEO
  trackUserEngagement() {
    let pageViews = 0;
    let timeOnPage = Date.now();
    let scrollDepth = 0;
    let interactions = 0;

    // Track bounce rate indicators
    const startTime = Date.now();
    let hasInteracted = false;

    // Track meaningful interactions
    ['click', 'keydown', 'scroll', 'touch'].forEach(event => {
      document.addEventListener(event, () => {
        if (!hasInteracted) {
          hasInteracted = true;
          const timeToInteraction = Date.now() - startTime;
          this.seoMetrics.timeToInteraction = timeToInteraction;
        }
        interactions++;
      }, { once: event === 'scroll' ? false : true });
    });

    // Track scroll depth
    window.addEventListener('scroll', () => {
      const currentScroll = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      scrollDepth = Math.max(scrollDepth, currentScroll);
      this.seoMetrics.maxScrollDepth = scrollDepth;
    });

    // Track session duration on page exit
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - timeOnPage;
      this.seoMetrics.sessionDuration = sessionDuration;
      this.seoMetrics.totalInteractions = interactions;
      this.seoMetrics.bounced = !hasInteracted || sessionDuration < 10000; // Less than 10s is bounce
      
      this.reportEngagementMetrics();
    });
  }

  // Monitor for Schema.org markup errors
  monitorSchemaErrors() {
    try {
      const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]');
      
      schemaScripts.forEach((script, index) => {
        try {
          const jsonData = JSON.parse(script.textContent);
          this.validateSchemaStructure(jsonData, index);
        } catch (error) {
          this.reportSEOIssue('schema_parse_error', {
            scriptIndex: index,
            error: error.message
          });
        }
      });
    } catch (error) {
      this.reportSEOIssue('schema_monitoring_error', { error: error.message });
    }
  }

  // Validate Schema.org structure
  validateSchemaStructure(schema, index) {
    const requiredFields = {
      'Organization': ['name', 'url'],
      'WebSite': ['name', 'url'],
      'SoftwareApplication': ['name', 'applicationCategory'],
      'LocalBusiness': ['name', 'address']
    };

    if (schema['@type'] && requiredFields[schema['@type']]) {
      const required = requiredFields[schema['@type']];
      const missing = required.filter(field => !schema[field]);
      
      if (missing.length > 0) {
        this.reportSEOIssue('schema_missing_fields', {
          schemaType: schema['@type'],
          missingFields: missing,
          scriptIndex: index
        });
      }
    }
  }

  // Track local SEO signals
  trackLocalSEOSignals() {
    // Check for NAP (Name, Address, Phone) consistency
    const addressElements = document.querySelectorAll('[itemtype*="PostalAddress"], [class*="address"], [id*="address"]');
    const phoneElements = document.querySelectorAll('[href^="tel:"], [class*="phone"], [id*="phone"]');
    
    this.seoMetrics.localSEO = {
      hasAddress: addressElements.length > 0,
      hasPhone: phoneElements.length > 0,
      addressCount: addressElements.length,
      phoneCount: phoneElements.length
    };

    // Check for local business schema
    const hasLocalBusiness = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .some(script => {
        try {
          const data = JSON.parse(script.textContent);
          return data['@type'] === 'LocalBusiness';
        } catch (e) {
          return false;
        }
      });

    this.seoMetrics.localSEO.hasLocalBusinessSchema = hasLocalBusiness;
  }

  // Monitor for common SEO issues
  checkCommonSEOIssues() {
    const issues = [];

    // Check for multiple H1 tags
    const h1Tags = document.querySelectorAll('h1');
    if (h1Tags.length === 0) {
      issues.push({ type: 'missing_h1', message: 'No H1 tag found' });
    } else if (h1Tags.length > 1) {
      issues.push({ type: 'multiple_h1', count: h1Tags.length });
    }

    // Check for missing alt text on images
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt]), img[alt=""]');
    if (imagesWithoutAlt.length > 0) {
      issues.push({ type: 'missing_alt_text', count: imagesWithoutAlt.length });
    }

    // Check for broken internal links
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href*="alumnlink.com"]');
    internalLinks.forEach(link => {
      if (link.href && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:')) {
        fetch(link.href, { method: 'HEAD' }).catch(() => {
          issues.push({ type: 'broken_link', url: link.href });
        });
      }
    });

    // Check meta description length
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      const length = metaDescription.getAttribute('content').length;
      if (length < 120 || length > 160) {
        issues.push({ type: 'meta_description_length', length });
      }
    }

    // Check title length
    const title = document.title;
    if (title.length < 30 || title.length > 60) {
      issues.push({ type: 'title_length', length: title.length });
    }

    return issues;
  }

  // Setup Search Console API integration (if available)
  setupSearchConsoleIntegration() {
    // This would integrate with Google Search Console API
    // to track search performance, crawl errors, etc.
    this.seoMetrics.searchConsole = {
      integrated: false,
      lastUpdated: new Date().toISOString()
    };
  }

  // Report SEO issues to analytics
  reportSEOIssue(issueType, data) {
    console.warn(`SEO Issue: ${issueType}`, data);
    
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'seo_issue', {
        event_category: 'SEO Performance',
        event_label: issueType,
        value: data.value || 1,
        custom_parameters: data
      });
    }

    // Store for debugging
    if (!this.seoMetrics.issues) {
      this.seoMetrics.issues = [];
    }
    this.seoMetrics.issues.push({
      type: issueType,
      data,
      timestamp: new Date().toISOString()
    });
  }

  // Report engagement metrics
  reportEngagementMetrics() {
    if (window.gtag) {
      window.gtag('event', 'user_engagement', {
        event_category: 'SEO Signals',
        session_duration: this.seoMetrics.sessionDuration,
        scroll_depth: this.seoMetrics.maxScrollDepth,
        interactions: this.seoMetrics.totalInteractions,
        bounced: this.seoMetrics.bounced
      });
    }
  }

  // Generate SEO report
  generateSEOReport() {
    const issues = this.checkCommonSEOIssues();
    
    return {
      performance: this.performanceData,
      coreWebVitals: {
        lcp: this.seoMetrics.lcp,
        fid: this.seoMetrics.fid,
        cls: this.seoMetrics.cls
      },
      engagement: {
        sessionDuration: this.seoMetrics.sessionDuration,
        scrollDepth: this.seoMetrics.maxScrollDepth,
        interactions: this.seoMetrics.totalInteractions,
        bounced: this.seoMetrics.bounced
      },
      localSEO: this.seoMetrics.localSEO,
      issues: issues,
      timestamp: new Date().toISOString()
    };
  }

  // Public method to get current metrics
  getMetrics() {
    return this.seoMetrics;
  }
}

// Initialize SEO monitoring
document.addEventListener('DOMContentLoaded', () => {
  window.alumnlinkSEOMonitor = new SEOMonitor();
  
  // Make available globally for debugging
  window.getSEOReport = () => window.alumnlinkSEOMonitor.generateSEOReport();
});

export default SEOMonitor;
