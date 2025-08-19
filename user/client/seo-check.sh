#!/bin/bash

# AlumnLink SEO Health Check Script
# Run this script to check SEO status and submit to search engines

echo "🔍 AlumnLink SEO Health Check Starting..."
echo "========================================"

# Check if site is accessible
echo "📡 Checking site accessibility..."
if curl -s --head https://www.alumnlink.com | head -n 1 | grep -q "200 OK"; then
    echo "✅ Site is accessible"
else
    echo "❌ Site is not accessible"
    exit 1
fi

# Check robots.txt
echo "🤖 Checking robots.txt..."
if curl -s https://www.alumnlink.com/robots.txt | grep -q "User-agent:"; then
    echo "✅ robots.txt is accessible"
else
    echo "❌ robots.txt not found or invalid"
fi

# Check sitemap.xml
echo "🗺️  Checking sitemap.xml..."
if curl -s https://www.alumnlink.com/sitemap.xml | grep -q "<urlset"; then
    echo "✅ sitemap.xml is accessible"
    
    # Count URLs in sitemap
    url_count=$(curl -s https://www.alumnlink.com/sitemap.xml | grep -c "<url>")
    echo "📊 Sitemap contains $url_count URLs"
else
    echo "❌ sitemap.xml not found or invalid"
fi

# Check SSL certificate
echo "🔒 Checking SSL certificate..."
if curl -s -I https://www.alumnlink.com | grep -q "200 OK"; then
    echo "✅ SSL certificate is valid"
else
    echo "❌ SSL certificate issue detected"
fi

# Check page speed (basic)
echo "⚡ Checking page load time..."
load_time=$(curl -o /dev/null -s -w '%{time_total}' https://www.alumnlink.com)
if (( $(echo "$load_time < 3.0" | bc -l) )); then
    echo "✅ Page loads in ${load_time}s (Good)"
elif (( $(echo "$load_time < 5.0" | bc -l) )); then
    echo "⚠️  Page loads in ${load_time}s (Average)"
else
    echo "❌ Page loads in ${load_time}s (Poor - needs optimization)"
fi

# Check meta description
echo "📝 Checking meta description..."
meta_desc=$(curl -s https://www.alumnlink.com | grep -o '<meta name="description" content="[^"]*"' | sed 's/<meta name="description" content="//' | sed 's/"//')
if [ -n "$meta_desc" ]; then
    desc_length=${#meta_desc}
    echo "✅ Meta description found ($desc_length characters)"
    if [ $desc_length -lt 120 ] || [ $desc_length -gt 160 ]; then
        echo "⚠️  Meta description length should be 120-160 characters"
    fi
else
    echo "❌ Meta description not found"
fi

# Check Open Graph tags
echo "📱 Checking Open Graph tags..."
og_title=$(curl -s https://www.alumnlink.com | grep -o 'property="og:title"[^>]*content="[^"]*"' | head -1)
if [ -n "$og_title" ]; then
    echo "✅ Open Graph title found"
else
    echo "❌ Open Graph title missing"
fi

# Check structured data
echo "🏗️  Checking structured data..."
if curl -s https://www.alumnlink.com | grep -q 'application/ld+json'; then
    echo "✅ Structured data (JSON-LD) found"
else
    echo "❌ Structured data missing"
fi

# Submit sitemap to search engines (if not already done)
echo "📨 Submitting sitemap to search engines..."

# Google Search Console (requires setup)
echo "🔍 Google: Please submit manually to Search Console"
echo "   URL: https://search.google.com/search-console"

# Bing Webmaster Tools (requires setup)
echo "🔍 Bing: Please submit manually to Webmaster Tools"
echo "   URL: https://www.bing.com/webmasters"

# IndexNow API (Microsoft/Yandex)
if command -v curl &> /dev/null; then
    echo "📡 Attempting IndexNow submission..."
    curl -X POST "https://api.indexnow.org/indexnow" \
         -H "Content-Type: application/json" \
         -d '{
           "host": "www.alumnlink.com",
           "key": "YOUR_INDEXNOW_KEY",
           "urlList": [
             "https://www.alumnlink.com/",
             "https://www.alumnlink.com/Landing/about",
             "https://www.alumnlink.com/Landing/for-institutes"
           ]
         }' &> /dev/null
    if [ $? -eq 0 ]; then
        echo "✅ IndexNow submission attempted"
    else
        echo "⚠️  IndexNow submission failed (may need API key)"
    fi
fi

echo ""
echo "🎯 SEO Recommendations:"
echo "======================="
echo "1. 📊 Set up Google Analytics 4 and Search Console"
echo "2. 📝 Create regular blog content (2-3 posts/week)"
echo "3. 🔗 Build quality backlinks from education sites"
echo "4. 📱 Optimize for mobile and Core Web Vitals"
echo "5. 🎯 Target long-tail keywords in content"
echo "6. 📧 Implement email marketing for engagement"
echo "7. 🤝 Build local citations and partnerships"
echo "8. 📹 Create video content for YouTube SEO"

echo ""
echo "📈 Next Steps:"
echo "=============="
echo "1. Run this script weekly to monitor SEO health"
echo "2. Check Google Search Console for indexing issues"
echo "3. Monitor keyword rankings with SEO tools"
echo "4. Analyze competitor strategies"
echo "5. Create location-specific landing pages"
echo "6. Optimize images with descriptive alt text"
echo "7. Implement user-generated content strategy"

echo ""
echo "✅ SEO Health Check Complete!"
echo "$(date)"
