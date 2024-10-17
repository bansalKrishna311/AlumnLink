import React from 'react';
import Content from './Content';
import FooterBg from './footerbg'; // Import the FooterBg component

export default function StickyFooter({ theme }) {
  return (
    <div
      className="relative bg-base-200 h-[80vh]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      {/* Particles background */}
      <FooterBg theme={theme} />
      
      <div className="fixed bottom-0 h-[600px] w-full">
        <section className="bg-blue-50 dark:bg-slate-800" id="contact">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <div className="mb-4">
              <div className="mb-6 max-w-3xl text-center sm:text-center md:mx-auto md:mb-8">
                <p className="text-base font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-200">
                  Contact
                </p>
                <h2 className="font-heading mb-2 font-bold tracking-tight text-gray-900 dark:text-white text-3xl sm:text-4xl">
                  Get in Touch
                </h2>
                <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-600 dark:text-slate-400">
                  In hac habitasse platea dictumst
                </p>
              </div>
            </div>
            <div className="flex items-stretch justify-center">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="h-full pr-4">
                  <p className="mt-2 mb-8 text-base text-gray-600 dark:text-slate-400">
                    Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                    Duis nec ipsum orci. Ut scelerisque sagittis ante, ac tincidunt sem venenatis ut.
                  </p>
                  <ul className="mb-4 md:mb-0">
                    {/* Address */}
                    <li className="flex mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-900 text-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          className="h-5 w-5">
                          <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                          <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
                        </svg>
                      </div>
                      <div className="ml-4 text-gray-600 dark:text-slate-400">
                        <h3 className="mb-1 text-base font-medium leading-6 text-gray-900 dark:text-white">Our Address</h3>
                        <p>1230 Maecenas Street Donec Road, New York, EEUU</p>
                      </div>
                    </li>
                    {/* Contact */}
                    <li className="flex mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-900 text-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          className="h-5 w-5">
                          <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"></path>
                          <path d="M15 7a2 2 0 0 1 2 2"></path>
                          <path d="M15 3a6 6 0 0 1 6 6"></path>
                        </svg>
                      </div>
                      <div className="ml-4 text-gray-600 dark:text-slate-400">
                        <h3 className="mb-1 text-base font-medium leading-6 text-gray-900 dark:text-white">Contact</h3>
                        <p>Mobile: +1 (123) 456-7890</p>
                        <p>Mail: tailnext@gmail.com</p>
                      </div>
                    </li>
                    {/* Working Hours */}
                    <li className="flex mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-900 text-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          className="h-5 w-5">
                          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                          <path d="M12 7v5l3 3"></path>
                        </svg>
                      </div>
                      <div className="ml-4 text-gray-600 dark:text-slate-400">
                        <h3 className="mb-1 text-base font-medium leading-6 text-gray-900 dark:text-white">Working hours</h3>
                        <p>Mon - Fri: 08:00 - 17:00</p>
                        <p>Sat & Sun: 08:00 - 12:00</p>
                      </div>
                    </li>
                  </ul>
                </div>
                {/* Contact Form */}
                <div className="card max-w-6xl p-5 md:p-8" id="form">
                  <h2 className="mb-3 text-xl font-bold dark:text-white">Ready to Get Started?</h2>
                  <form id="contactForm">
                    <div className="mb-4">
                      <input type="text" id="name" autoComplete="given-name" placeholder="Your name"
                        className="w-full rounded-md border border-gray-400 py-2 px-3 shadow-md dark:text-gray-300" name="name" />
                      <input type="email" id="email" autoComplete="email" placeholder="Your email address"
                        className="w-full mt-2 rounded-md border border-gray-400 py-2 px-3 shadow-md dark:text-gray-300" name="email" />
                    </div>
                    <textarea id="textarea" name="textarea" cols="30" rows="3" placeholder="Write your message..."
                      className="w-full rounded-md border border-gray-400 py-2 px-3 shadow-md dark:text-gray-300"></textarea>
                    <div className="text-center mt-4">
                      <button type="submit" className="w-full bg-blue-800 text-white px-6 py-3 font-xl rounded-md">Send Message</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
