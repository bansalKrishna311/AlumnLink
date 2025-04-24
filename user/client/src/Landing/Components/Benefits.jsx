import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Lock, LifeBuoy } from 'lucide-react';
import SectionHeading from './SectionHeading';

const Benefits = () => {
  // Benefits data
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

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <SectionHeading
              badge="Why choose AlumnLink"
              badgeColor="purple"
              title="Purpose-built for alumni engagement"
              description="Unlike generic community platforms, AlumnLink is designed specifically for educational institutions and their unique alumni engagement needs."
              centered={false}
            />

            <div className="space-y-6">
              {benefits.map((benefit, i) => (
                <motion.div 
                  key={i} 
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-gradient-to-br from-white to-[#fff8f5] p-3 rounded-lg shadow-sm border border-gray-100 h-fit">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Dashboard mockup */}
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Header bar */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 flex justify-between items-center">
                  <div className="font-bold">AlumnLink Dashboard</div>
                  <div className="flex gap-4">
                    <div className="text-sm">Admin</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700"></div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Alumni Engagement Overview</h3>
                    <div className="flex gap-2">
                      <div className="px-3 py-1 bg-gradient-to-r from-[#fff8f5] to-[#ffe8de] rounded-md text-sm">This Month</div>
                      <div className="px-3 py-1 bg-gray-100 rounded-md text-sm">Export</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Active Members", value: "3,420", change: "+12%" },
                      { label: "New Registrations", value: "142", change: "+8%" },
                      { label: "Event Attendees", value: "867", change: "+18%" }
                    ].map((stat, i) => (
                      <div key={i} className="bg-gradient-to-br from-[#fff8f5] to-[#ffe8de] p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                        <div className="flex items-end justify-between">
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-xs text-green-500">{stat.change}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-6 bg-gradient-to-br from-[#fff8f5] to-[#ffe8de] p-4 rounded-lg">
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
                  
                  <div className="bg-gradient-to-br from-[#fff8f5] to-[#ffe8de] p-4 rounded-lg">
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;