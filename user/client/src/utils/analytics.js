// Advanced Analytics Configuration for AlumnLink
// Google Analytics 4 (GA4) Enhanced Setup

// Initialize Google Analytics 4
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Enhanced GA4 Configuration
gtag('config', 'GA_MEASUREMENT_ID', {
  // Enhanced tracking
  send_page_view: true,
  allow_google_signals: true,
  allow_ad_personalization_signals: true,
  
  // Custom dimensions for alumni platform
  custom_map: {
    'custom_dimension_1': 'user_type',     // alumni, institute, corporate
    'custom_dimension_2': 'institution_type', // university, college, school
    'custom_dimension_3': 'engagement_level', // high, medium, low
    'custom_dimension_4': 'feature_usage',    // directory, events, careers
    'custom_dimension_5': 'user_cohort'      // graduation_year_range
  },
  
  // Enhanced ecommerce for subscription tracking
  currency: 'INR',
  
  // Privacy settings
  anonymize_ip: true,
  respect_dnt: true,
  
  // Site search tracking
  site_speed_sample_rate: 100,
  
  // Content grouping
  content_group1: 'Page Category',
  content_group2: 'User Journey Stage',
  content_group3: 'Platform Section'
});

// Track page views with enhanced data
function trackPageView(pageTitle, pageLocation, contentGroup = null) {
  gtag('event', 'page_view', {
    page_title: pageTitle,
    page_location: pageLocation,
    content_group1: contentGroup,
    custom_map: {
      'user_type': getUserType(),
      'institution_type': getInstitutionType()
    }
  });
}

// Track alumni-specific events
function trackAlumniEvent(eventName, parameters = {}) {
  gtag('event', eventName, {
    event_category: 'Alumni Engagement',
    event_label: parameters.label || '',
    value: parameters.value || 0,
    custom_map: {
      'engagement_level': parameters.engagement_level || 'medium',
      'feature_usage': parameters.feature || 'general'
    }
  });
}

// Track institutional events
function trackInstitutionalEvent(eventName, parameters = {}) {
  gtag('event', eventName, {
    event_category: 'Institutional Actions',
    event_label: parameters.label || '',
    value: parameters.value || 0,
    custom_map: {
      'institution_type': parameters.institution_type || 'unknown'
    }
  });
}

// Track conversion events for SEO
function trackConversion(conversionType, value = 0) {
  gtag('event', 'conversion', {
    event_category: 'Conversions',
    event_label: conversionType,
    value: value,
    currency: 'INR'
  });
}

// Enhanced scroll tracking for SEO insights
function trackScrollDepth() {
  let maxScroll = 0;
  const scrollDepthMarkers = [25, 50, 75, 90, 100];
  
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    scrollDepthMarkers.forEach(marker => {
      if (scrollPercent >= marker && maxScroll < marker) {
        maxScroll = marker;
        gtag('event', 'scroll_depth', {
          event_category: 'User Engagement',
          event_label: `${marker}%`,
          value: marker
        });
      }
    });
  });
}

// Track time on page for SEO quality signals
function trackTimeOnPage() {
  const startTime = Date.now();
  
  // Track at intervals
  const timeMarkers = [30, 60, 120, 300, 600]; // seconds
  
  timeMarkers.forEach(seconds => {
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        gtag('event', 'time_on_page', {
          event_category: 'User Engagement',
          event_label: `${seconds}s`,
          value: seconds
        });
      }
    }, seconds * 1000);
  });
  
  // Track total time when user leaves
  window.addEventListener('beforeunload', () => {
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    gtag('event', 'session_duration', {
      event_category: 'User Engagement',
      value: totalTime
    });
  });
}

// Track form interactions for conversion optimization
function trackFormInteraction(formName, action) {
  gtag('event', 'form_interaction', {
    event_category: 'Form Engagement',
    event_label: `${formName}_${action}`,
    form_name: formName,
    form_action: action
  });
}

// Track CTA clicks for optimization
function trackCTAClick(ctaText, ctaLocation) {
  gtag('event', 'cta_click', {
    event_category: 'CTA Engagement',
    event_label: ctaText,
    cta_location: ctaLocation
  });
}

// Track search functionality
function trackSiteSearch(searchTerm, resultCount = 0) {
  gtag('event', 'search', {
    search_term: searchTerm,
    event_category: 'Site Search',
    value: resultCount
  });
}

// Track video engagement (if applicable)
function trackVideoEngagement(videoTitle, action, progress = 0) {
  gtag('event', 'video_engagement', {
    event_category: 'Video',
    event_label: `${videoTitle}_${action}`,
    value: progress
  });
}

// Track download events
function trackDownload(fileName, fileType) {
  gtag('event', 'file_download', {
    event_category: 'Downloads',
    event_label: fileName,
    file_extension: fileType
  });
}

// Track external link clicks
function trackExternalClick(url, linkText) {
  gtag('event', 'click', {
    event_category: 'External Links',
    event_label: linkText,
    link_url: url
  });
}

// Helper functions
function getUserType() {
  // Determine user type based on login state, URL, or other indicators
  if (window.location.pathname.includes('/Landing/for-institutes')) return 'institute';
  if (window.location.pathname.includes('/Landing/for-alumni')) return 'alumni';
  if (window.location.pathname.includes('/Landing/for-corporates')) return 'corporate';
  return 'visitor';
}

function getInstitutionType() {
  // Logic to determine institution type
  return 'unknown'; // This would be determined based on user data
}

// Auto-initialize common tracking
document.addEventListener('DOMContentLoaded', function() {
  // Initialize scroll tracking
  trackScrollDepth();
  
  // Initialize time tracking
  trackTimeOnPage();
  
  // Track initial page load
  trackPageView(document.title, window.location.href, 'Alumni Platform');
  
  // Auto-track CTA clicks
  document.querySelectorAll('a[href*="signup"], a[href*="demo"], a[href*="contact"]').forEach(cta => {
    cta.addEventListener('click', function() {
      trackCTAClick(this.textContent.trim(), this.getAttribute('href'));
    });
  });
  
  // Auto-track external links
  document.querySelectorAll('a[href^="http"]:not([href*="alumnlink.com"])').forEach(link => {
    link.addEventListener('click', function() {
      trackExternalClick(this.href, this.textContent.trim());
    });
  });
  
  // Auto-track downloads
  document.querySelectorAll('a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"], a[href$=".xls"], a[href$=".xlsx"]').forEach(downloadLink => {
    downloadLink.addEventListener('click', function() {
      const fileName = this.href.split('/').pop();
      const fileExtension = fileName.split('.').pop();
      trackDownload(fileName, fileExtension);
    });
  });
});

// Export functions for use in React components
window.AlumnLinkAnalytics = {
  trackPageView,
  trackAlumniEvent,
  trackInstitutionalEvent,
  trackConversion,
  trackFormInteraction,
  trackCTAClick,
  trackSiteSearch,
  trackVideoEngagement,
  trackDownload,
  trackExternalClick
};

export {
  trackPageView,
  trackAlumniEvent,
  trackInstitutionalEvent,
  trackConversion,
  trackFormInteraction,
  trackCTAClick,
  trackSiteSearch,
  trackVideoEngagement,
  trackDownload,
  trackExternalClick
};
