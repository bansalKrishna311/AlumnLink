import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, BookOpen, AlertCircle } from 'lucide-react';

const Terms = () => {
  return (
    <div className="pt-28 pb-16">
      {/* Terms Hero Section */}
      <div className="bg-gradient-to-b from-[#fe6019]/5 to-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Terms and Conditions</h1>
            <p className="text-lg text-gray-600 mb-8">
              Last updated: April 24, 2025
            </p>
            <div className="w-24 h-1 bg-[#fe6019] mx-auto rounded-full"></div>
          </motion.div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="prose prose-lg max-w-none"
            >
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="text-[#fe6019]" size={28} />
                  <h2 className="text-2xl font-bold text-gray-800 m-0">Introduction</h2>
                </div>
                <p className="text-gray-600">
                  Welcome to AlumnLink. These Terms and Conditions govern your use of our website, mobile applications, and services (collectively, the "Platform"). By accessing or using our Platform, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the Platform.
                </p>
                <p className="text-gray-600">
                  AlumnLink provides an online platform connecting educational institutions with their alumni networks, offering features such as alumni directories, event management, fundraising tools, job boards, and communication systems.
                </p>
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="text-[#fe6019]" size={28} />
                  <h2 className="text-2xl font-bold text-gray-800 m-0">User Accounts</h2>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Account Creation</h3>
                <p className="text-gray-600">
                  To use certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                </p>
                
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Account Security</h3>
                <p className="text-gray-600">
                  You are responsible for safeguarding the password you use to access the Platform and for any activities or actions under your password. We encourage you to use "strong" passwords (passwords that use a combination of upper and lower case letters, numbers, and symbols) with your account.
                </p>
                
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Account Types</h3>
                <p className="text-gray-600">
                  AlumnLink offers different types of accounts:
                </p>
                <ul>
                  <li className="text-gray-600">
                    <strong>Alumni Accounts:</strong> For graduates of educational institutions to connect with their alma mater and fellow alumni.
                  </li>
                  <li className="text-gray-600">
                    <strong>Admin Accounts:</strong> For institutional administrators to manage their alumni network and content.
                  </li>
                  <li className="text-gray-600">
                    <strong>Superadmin Accounts:</strong> For platform owners to oversee the entire system.
                  </li>
                </ul>
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="text-[#fe6019]" size={28} />
                  <h2 className="text-2xl font-bold text-gray-800 m-0">Acceptable Use Policy</h2>
                </div>
                <p className="text-gray-600">
                  You agree not to engage in any of the following prohibited activities:
                </p>
                <ul>
                  <li className="text-gray-600">
                    Copying, distributing, or disclosing any part of the Platform in any medium.
                  </li>
                  <li className="text-gray-600">
                    Using any automated system, including "robots," "spiders," "offline readers," etc., to access the Platform.
                  </li>
                  <li className="text-gray-600">
                    Transmitting spam, chain letters, or other unsolicited communications.
                  </li>
                  <li className="text-gray-600">
                    Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Platform.
                  </li>
                  <li className="text-gray-600">
                    Uploading or transmitting viruses, malware, or other malicious code.
                  </li>
                  <li className="text-gray-600">
                    Using the Platform for any illegal or unauthorized purpose.
                  </li>
                </ul>
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="text-[#fe6019]" size={28} />
                  <h2 className="text-2xl font-bold text-gray-800 m-0">Content and Intellectual Property</h2>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">User Content</h3>
                <p className="text-gray-600">
                  Our Platform allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Platform, including its legality, reliability, and appropriateness.
                </p>
                <p className="text-gray-600">
                  By posting Content on or through the Platform, you represent and warrant that: (i) the Content is yours and/or you have the right to use it and the right to grant us the rights and license as provided in these Terms, and (ii) that the posting of your Content on or through the Platform does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or entity.
                </p>
                
                <h3 className="text-xl font-semibold mb-2 text-gray-800">AlumnLink Content</h3>
                <p className="text-gray-600">
                  Unless otherwise indicated, the Platform and all content and other materials therein, including, without limitation, the AlumnLink logo and all designs, text, graphics, pictures, information, data, software, and files relating to the Platform (collectively, "AlumnLink Content") are the proprietary property of AlumnLink or our licensors and are protected by intellectual property laws.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Termination</h2>
                <p className="text-gray-600">
                  We may terminate or suspend your account and bar access to the Platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                </p>
                <p className="text-gray-600">
                  If you wish to terminate your account, you may simply discontinue using the Platform, or notify us that you wish to delete your account.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Limitation of Liability</h2>
                <p className="text-gray-600">
                  In no event shall AlumnLink, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Platform; (ii) any conduct or content of any third party on the Platform; (iii) any content obtained from the Platform; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Changes to These Terms</h2>
                <p className="text-gray-600">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
                <p className="text-gray-600">
                  By continuing to access or use our Platform after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Platform.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h2>
                <p className="text-gray-600">
                  If you have any questions about these Terms, please <a href="/landing/contact" className="text-[#fe6019] hover:underline">contact us</a>.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Agreement CTA */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Agree to Our Terms?</h2>
              <p className="text-gray-600 mb-6">
                By using AlumnLink, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/signup" className="btn px-8 py-3 bg-[#fe6019] text-white font-medium rounded-lg hover:bg-[#fe6019]/90 transition-all">
                  Sign Up Now
                </a>
                <a href="/login" className="btn px-8 py-3 border border-[#fe6019] text-[#fe6019] font-medium rounded-lg hover:bg-[#fe6019]/5 transition-all">
                  Login
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;