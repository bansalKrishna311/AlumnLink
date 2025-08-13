import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { axiosInstance } from '@/lib/axios';
import SEO from '../../components/SEO';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Use the axios instance from axios.js
      const response = await axiosInstance.post('/contact/submit', formData);
      
      if (response.data.success) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'Failed to submit. Please try again later.');
    } finally {
      setIsSubmitting(false);
      
      // Reset success message after 5 seconds
      if (isSubmitted) {
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      }
    }
  };

  return (
    <div className="pt-28 pb-16">
      <SEO 
        title="Contact AlumnLink - Get In Touch With India's Alumni Platform Experts | Support & Sales"
        description="Contact AlumnLink's team for alumni platform support, sales inquiries, or partnership opportunities. Reach out via email, phone, or our contact form. We're here to help transform your alumni engagement."
        keywords="contact alumnlink, alumni platform support, alumnlink customer service, alumni software inquiry, educational technology contact, alumni platform demo, alumnlink sales team, alumni engagement help"
        url="https://www.alumnlink.com/landing/contact"
        canonical="https://www.alumnlink.com/landing/contact"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact AlumnLink",
          "description": "Get in touch with AlumnLink for support, sales inquiries, or partnership opportunities.",
          "url": "https://www.alumnlink.com/landing/contact",
          "mainEntity": {
            "@type": "Organization",
            "name": "AlumnLink",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "availableLanguage": ["English", "Hindi"]
            }
          }
        }}
        breadcrumbs={[
          { name: "Home", url: "https://www.alumnlink.com" },
          { name: "Contact", url: "https://www.alumnlink.com/landing/contact" }
        ]}
      />
      
      {/* Contact Hero Section */}
      <div className="bg-gradient-to-b from-[#fe6019]/5 to-white py-12">
        <div className="container w-11/12 mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Get in Touch</h1>
            <p className="text-lg text-gray-600 mb-8">
              Have questions about AlumnLink? We're here to help you connect with your alumni community.
            </p>
            <div className="w-24 h-1 bg-[#fe6019] mx-auto rounded-full"></div>
          </motion.div>
        </div>
      </div>

      {/* Contact Form and Info */}
      <div className="py-16 bg-white">
        <div className="container w-11/12 mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1"
            >
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Us a Message</h2>
                
                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                  >
                    <CheckCircle className="mx-auto text-green-500 mb-3" size={40} />
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Thank You!</h3>
                    <p className="text-green-700">
                      Your message has been sent successfully. We'll get back to you as soon as possible.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        {error}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#fe6019] focus:border-[#fe6019] transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#fe6019] focus:border-[#fe6019] transition-colors"
                          placeholder="Your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#fe6019] focus:border-[#fe6019] transition-colors"
                        placeholder="What is this regarding?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#fe6019] focus:border-[#fe6019] transition-colors resize-none"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full px-6 py-3 bg-[#fe6019] text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                          isSubmitting 
                            ? 'opacity-70 cursor-not-allowed' 
                            : 'hover:bg-[#fe6019]/90 hover:shadow-md'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:w-1/3"
            >
              <div className="bg-gray-50 rounded-xl p-8 h-full border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#fe6019]/10 p-3 rounded-full text-[#fe6019]">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Our Location</h3>
                      <p className="text-gray-600">
                        123 Alumni Way<br />
                        San Francisco, CA 94103<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-[#fe6019]/10 p-3 rounded-full text-[#fe6019]">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Email Us</h3>
                      <p className="text-gray-600">
                        <a href="mailto:support@alumnlink.com" className="hover:text-[#fe6019] transition-colors">
                          support@alumnlink.com
                        </a><br />
                        <a href="mailto:info@alumnlink.com" className="hover:text-[#fe6019] transition-colors">
                          info@alumnlink.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-[#fe6019]/10 p-3 rounded-full text-[#fe6019]">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Call Us</h3>
                      <p className="text-gray-600">
                        <a href="tel:+1-800-123-4567" className="hover:text-[#fe6019] transition-colors">
                          +1 (800) 123-4567
                        </a><br />
                        <a href="tel:+1-415-555-6789" className="hover:text-[#fe6019] transition-colors">
                          +1 (415) 555-6789
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-[#fe6019]/10 p-3 rounded-full text-[#fe6019]">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Business Hours</h3>
                      <p className="text-gray-600">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 2:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>

              
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50">
        <div className="container w-11/12 mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Find quick answers to common questions about AlumnLink
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6">
              {[
                {
                  question: "How do I sign up for AlumnLink?",
                  answer: "You can sign up by clicking the 'Get Started' button at the top of our website. Follow the registration process, verify your email, and you'll be ready to connect with your alumni network."
                },
                {
                  question: "Is AlumnLink available for all educational institutions?",
                  answer: "Yes, AlumnLink is designed for universities, colleges, high schools, and other educational institutions. If your school isn't already on our platform, you can contact us to learn about getting your institution set up."
                },
                {
                  question: "How much does it cost to use AlumnLink?",
                  answer: "AlumnLink offers different pricing tiers based on institution size and features needed. Basic alumni accounts are free, while institutions pay a subscription fee. Contact our sales team for detailed pricing information."
                },
                {
                  question: "How can I verify my alumni status on the platform?",
                  answer: "During registration, you'll be asked to provide information that can be verified by your institution. This may include graduation year, student ID, or email address. Each institution may have different verification requirements."
                },
                {
                  question: "Can I delete my account if I no longer wish to use AlumnLink?",
                  answer: "Yes, you can delete your account at any time through your account settings. If you need assistance, our support team is available to help you through the process."
                }
              ].map((faq, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + (index * 0.1) }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex gap-4">
                    <div className="bg-[#fe6019]/10 p-3 rounded-full text-[#fe6019] h-fit">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <a href="mailto:support@alumnlink.com" className="inline-flex items-center gap-2 text-[#fe6019] font-medium hover:underline">
                <Mail size={16} />
                Contact our support team
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section (placeholder) */}
      <div className="h-96 bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <MapPin size={40} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">Map loading...</p>
            <p className="text-sm text-gray-400">
              (An interactive map would be displayed here in production)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;