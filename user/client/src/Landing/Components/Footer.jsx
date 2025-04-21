import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Column 1 - Quick Links */}
        <div className="space-y-4">
          <h3 className="text-[#fe6019] text-lg font-bold  pb-2">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[#fe6019] transition">Home</a></li>
            <li><a href="#" className="hover:text-[#fe6019] transition">Events</a></li>
            <li><a href="#" className="hover:text-[#fe6019] transition">Alumni Directory</a></li>
            <li><a href="#" className="hover:text-[#fe6019] transition">Career Services</a></li>
            <li><a href="#" className="hover:text-[#fe6019] transition">Mentorship Program</a></li>
          </ul>
        </div>
        
        {/* Column 2 - Resources */}
        <div className="space-y-4 border-l-2 border-[#fe6019] pl-8">
          <h3 className="text-[#fe6019] text-lg font-bold  pb-2">
            Resources
          </h3>
          <ul className="space-y-2 ">
            <li><a href="#" className="hover:text-[#fe6019] transition">Newsletters</a></li>
            <li><a href="#" className="hover:text-[#fe6019] transition">Photo Gallery</a></li>
            <li><a href="#" className="hover:text-[#fe6019] transition">Blog</a></li>
            <li><a href="#" className="hover:text-[#fe6019] transition">Contact Us</a></li>
            <li><a href="#" className="hover:text-[#fe6019] transition">FAQs</a></li>
          </ul>
        </div>
        
        {/* Column 3 - Contact Info */}
        <div className="space-y-4 border-l-2 border-[#fe6019] pl-8">
          <h3 className="text-[#fe6019] text-lg font-bold  pb-2">
            Contact Us
          </h3>
          <address className="not-italic">
            <p className="mb-2">Alumni Relations Office</p>
            <p className="mb-2">123 University Avenue</p>
            <p className="mb-2">City, State 12345</p>
            <p className="mb-2">Phone: (123) 456-7890</p>
            <p>Email: alumni@university.edu</p>
          </address>
        </div>
        
        {/* Column 4 - Social Media & Newsletter */}
        <div className="space-y-4 border-l-2 border-[#fe6019] pl-8">
          <h3 className="text-[#fe6019] text-lg font-bold  pb-2">
            Stay Connected
          </h3>
          <div className="flex space-x-4">
            <a href="#" className="text-white hover:text-[#fe6019] transition text-2xl">
              <FaFacebook />
            </a>
            <a href="#" className="text-white hover:text-[#fe6019] transition text-2xl">
              <FaTwitter />
            </a>
            <a href="#" className="text-white hover:text-[#fe6019] transition text-2xl">
              <FaLinkedin />
            </a>
            <a href="#" className="text-white hover:text-[#fe6019] transition text-2xl">
              <FaInstagram />
            </a>
            <a href="#" className="text-white hover:text-[#fe6019] transition text-2xl">
              <FaYoutube />
            </a>
          </div>
          
          <div className="mt-4">
            <p className="mb-2">Subscribe to our newsletter</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-2 bg-gray-800 text-white rounded-l focus:outline-none focus:ring-2 focus:ring-[#fe6019] w-full"
              />
              <button className="bg-[#fe6019] hover:bg-[#e05515] text-white px-4 py-2 rounded-r font-medium transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-700 text-center text-gray-400">
        <p>© {new Date().getFullYear()} University Alumni Portal. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="#" className="hover:text-[#fe6019] transition">Privacy Policy</a>
          <span>|</span>
          <a href="#" className="hover:text-[#fe6019] transition">Terms of Service</a>
          <span>|</span>
          <a href="#" className="hover:text-[#fe6019] transition">Accessibility</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;