import React from "react";
import Hero from "../Components/Hero";
import SectionHeading from "../Components/SectionHeading";
import FeatureCard from "../Components/FeatureCard";
import PricingTier from "../Components/PricingTier";
import FAQ from "../Components/FAQ";
import CallToAction from "../Components/CallToAction";
import { ArrowRight, Users, BarChart2, Clock, Zap, Lock, LifeBuoy, Award } from "lucide-react";
import { Link } from "react-router-dom";

const LandHome = () => {
  // Pricing tiers data
  const pricingTiers = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for small alumni groups just getting started",
      features: [
        "Up to 500 alumni profiles",
        "Basic event management",
        "Discussion forums",
        "Email notifications",
        "Community moderation"
      ],
      limitations: [
        "Limited analytics",
        "No API access",
        "Community support only"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "Ideal for growing institutions with active alumni",
      features: [
        "Up to 10,000 alumni profiles",
        "Advanced event management",
        "Job board & career center",
        "Fundraising campaigns",
        "Comprehensive analytics",
        "Custom branding options",
        "Email & chat support",
        "API access"
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large institutions with complex requirements",
      features: [
        "Unlimited alumni profiles",
        "Full platform customization",
        "White-label options",
        "Advanced data & analytics",
        "SSO & advanced security",
        "Dedicated account manager",
        "Priority 24/7 support",
        "Custom API integration"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  // How it works steps
  const howItWorksSteps = [
    {
      step: 1,
      title: "Set up your institution",
      description: "Configure your branding, import alumni data, and customize your community portal to match your institution's identity.",
      icon: <Users size={32} />
    },
    {
      step: 2,
      title: "Engage your alumni",
      description: "Launch discussions, create events, share job opportunities, and send personalized communications to drive engagement.",
      icon: <BarChart2 size={32} />
    },
    {
      step: 3,
      title: "Grow your network",
      description: "Analyze engagement data, optimize your approach, and continuously expand your alumni community's reach and impact.",
      icon: <Award size={32} />
    }
  ];

  // Benefits
  const benefits = [
    {
      title: "Save time and resources",
      description: "Automate repetitive tasks and streamline alumni management with purpose-built tools.",
      icon: <Clock className="text-[#fe6019]" />
    },
    {
      title: "Increase engagement rates",
      description: "Drive more meaningful interactions with personalized communication tools and targeted content.",
      icon: <Zap className="text-[#fe6019]" />
    },
    {
      title: "Enterprise-grade security",
      description: "Protect your alumni data with advanced security features and compliance standards.",
      icon: <Lock className="text-[#fe6019]" />
    },
    {
      title: "Dedicated support team",
      description: "Get help when you need it with our responsive support team and comprehensive resources.",
      icon: <LifeBuoy className="text-[#fe6019]" />
    }
  ];

  // FAQ questions and answers
  const faqs = [
    {
      question: "How long does it take to set up AlumnLink?",
      answer: "Most institutions are up and running within 1-2 weeks. Our onboarding team will guide you through the entire process, from data import to customization and launch."
    },
    {
      question: "Can we import our existing alumni database?",
      answer: "Yes! AlumnLink supports imports from various formats including CSV, Excel, and direct API connections with major CRM and database systems."
    },
    {
      question: "How secure is our alumni data on the platform?",
      answer: "We employ enterprise-grade security measures including encryption at rest and in transit, regular security audits, and compliance with GDPR, CCPA, and other privacy regulations."
    },
    {
      question: "Do alumni need to create accounts to use the platform?",
      answer: "Yes, alumni will need to create accounts to engage with the community, but we offer various authentication options including email, social login, and SSO to make the process seamless."
    },
    {
      question: "Can we customize the platform to match our branding?",
      answer: "Absolutely! All plans include basic customization options for colors, logos, and page layouts. The Professional and Enterprise plans offer more advanced customization capabilities."
    },
    {
      question: "What kind of support do you offer?",
      answer: "All customers receive access to our knowledge base and community forum. Professional plans include email and chat support, while Enterprise plans get priority support with a dedicated account manager."
    }
  ];

  return (
    <div>
      {/* Hero section */}
      <Hero />

      {/* How it works section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <SectionHeading
            badge="How It Works"
            badgeColor="blue"
            title="Build stronger alumni bonds in three easy steps"
            description="AlumnLink makes it simple to launch, grow, and manage your alumni community with powerful tools designed specifically for educational institutions."
          />

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {howItWorksSteps.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                  <div className="bg-gray-50 text-[#fe6019] w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <div className="absolute top-8 right-8 size-8 bg-[#fe6019] text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 flex-grow">{step.description}</p>
                </div>
                
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="text-[#fe6019]" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/landing/about"
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-800 py-3 px-6 rounded-lg font-medium"
            >
              Learn more about our platform
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits / Why Choose Us */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <SectionHeading
                badge="Why choose AlumnLink"
                badgeColor="purple"
                title="Purpose-built for alumni engagement"
                description="Unlike generic community platforms, AlumnLink is designed specifically for educational institutions and their unique alumni engagement needs."
                centered={false}
              />

              <div className="space-y-6">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 h-fit">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="relative">
                {/* Dashboard mockup */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                  {/* Header bar */}
                  <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                    <div className="font-bold">AlumnLink Dashboard</div>
                    <div className="flex gap-4">
                      <div className="text-sm">Admin</div>
                      <div className="w-8 h-8 rounded-full bg-gray-600"></div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Alumni Engagement Overview</h3>
                      <div className="flex gap-2">
                        <div className="px-3 py-1 bg-gray-100 rounded-md text-sm">This Month</div>
                        <div className="px-3 py-1 bg-gray-100 rounded-md text-sm">Export</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { label: "Active Members", value: "3,420", change: "+12%" },
                        { label: "New Registrations", value: "142", change: "+8%" },
                        { label: "Event Attendees", value: "867", change: "+18%" }
                      ].map((stat, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                          <div className="flex items-end justify-between">
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-xs text-green-500">{stat.change}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Engagement by Content Type</h4>
                        <div className="flex gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            Jobs
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            Events
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            Discussions
                          </div>
                        </div>
                      </div>
                      
                      <div className="h-24 flex items-end gap-2">
                        {[65, 40, 75, 55, 80, 50, 90].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t overflow-hidden flex flex-col">
                            <div className="h-full flex">
                              <div className="w-1/3 bg-blue-500" style={{ height: `${h * 0.4}%` }}></div>
                              <div className="w-1/3 bg-green-500" style={{ height: `${h * 0.3}%` }}></div>
                              <div className="w-1/3 bg-purple-500" style={{ height: `${h * 0.3}%` }}></div>
                            </div>
                            <div className="text-[10px] text-center text-gray-500 mt-1">
                              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Recent Activities</h4>
                      <div className="space-y-2">
                        {[
                          "New job posted by Microsoft",
                          "Homecoming event registration open",
                          "18 new members joined today",
                          "Fundraising campaign reached 80% of goal"
                        ].map((activity, i) => (
                          <div key={i} className="text-sm p-2 bg-white rounded flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#fe6019]"></div>
                            {activity}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 bg-[#fe6019]/10 w-32 h-32 rounded-full blur-xl -z-10"></div>
                <div className="absolute -bottom-6 -left-6 bg-blue-100 w-32 h-32 rounded-full blur-xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <SectionHeading
            badge="Simple, transparent pricing"
            badgeColor="green"
            title="Choose the plan that fits your institution"
            description="All plans include a 14-day free trial with no credit card required. Cancel anytime."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, i) => (
              <PricingTier key={i} tier={tier} index={i} />
            ))}
          </div>

          <div className="mt-12 bg-gray-50 rounded-xl p-8 text-center max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-2 text-gray-800">Need a custom solution?</h3>
            <p className="text-gray-600 mb-4">
              Contact our sales team to discuss your specific requirements and get a customized quote.
            </p>
            <Link
              to="/landing/contact"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Contact Sales
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <SectionHeading
            badge="Frequently asked questions"
            badgeColor="yellow"
            title="Common questions about AlumnLink"
            description="Everything you need to know about the platform and how it can help your institution."
          />

          <FAQ faqs={faqs} columns={2} />

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link
              to="/landing/contact"
              className="inline-flex items-center gap-2 text-[#fe6019] font-medium hover:underline"
            >
              Contact our team for more information
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CallToAction
        title="Ready to strengthen your alumni community?"
        description="Start your free trial today and see how AlumnLink can transform your alumni engagement."
        primaryButtonText="Get Started Free"
        primaryButtonLink="/signup"
        secondaryButtonText="Schedule a Demo"
        secondaryButtonLink="/landing/contact"
      />
    </div>
  );
};

export default LandHome;