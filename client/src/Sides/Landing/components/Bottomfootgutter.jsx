import React, { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi'; // Import FiArrowRight from react-icons
import Btn from './Btn';

const Bottomfootgutter = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbyjAE_wAleTTw-KywLQBRvPtzBcPXgJsyCfU88VMbUG6JpN4sIcleEn8djaQwGcqpci/exec', { // Replace with your actual URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText); // Log error response
        alert(`There was an error sending your message: ${errorText}`);
      } else {
        alert('Your message has been sent!');
        setFormData({ name: '', email: '', message: '' }); // Reset form
      }
    } catch (error) {
      console.error('Fetch error:', error); // Log fetch error
      alert('There was an error sending your message.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <footer className="footer bg-base-200 text-base-content p-10 px-36">
        {/* Contact Form Section */}
        <nav className="flex-1 ">
          <h6 className="footer-title">Contact Us</h6>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
              aria-label="Your Name"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
              aria-label="Your Email"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              className="textarea textarea-bordered w-full h-24"
              aria-label="Your Message"
            />
            <Btn 
              text="Get Contacted" 
              Icon={FiArrowRight} 
              onClick={handleSubmit} // Changed to onClick
              disabled={isSubmitting} // Disable button while submitting
            />
          </form>
        </nav>
        {/* Other nav sections */}
        <nav className="flex-1">
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav className="flex-1">
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav className="flex-1">
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
      <footer className="footer bg-base-200 text-base-content border-base-300 border-t px-36 py-4">
        <aside className="grid-flow-col items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="fill-current"
          >
            <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
          </svg>
          <p className="ml-4">
            AlumnLink
            <br />
            Providing reliable tech since 2024
          </p>
        </aside>
        <nav className="md:place-self-center md:justify-self-end">
          <div className="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M23.954 4.569c-.885.392-1.83.656-2.825.775 1.013-.607 1.794-1.564 2.165-2.724-.951.564-2.004.977-3.127 1.198-.896-.956-2.173-1.553-3.594-1.553-2.718 0-4.927 2.209-4.927 4.927 0 .387.045.763.127 1.124-4.092-.205-7.72-2.166-10.148-5.144-.423.724-.666 1.564-.666 2.465 0 1.701.866 3.194 2.183 4.067-.804-.026-1.564-.246-2.228-.616v.061c0 2.382 1.692 4.369 3.937 4.829-.412.112-.846.171-1.292.171-.316 0-.624-.031-.927-.086.624 1.953 2.444 3.375 4.6 3.415-1.68 1.318-3.8 2.108-6.086 2.108-.395 0-.787-.023-1.174-.069 2.179 1.396 4.767 2.206 7.548 2.206 9.049 0 13.986-7.487 13.986-13.952 0-.213-.005-.425-.014-.637.96-.693 1.8-1.558 2.46-2.549l-.047-.020z" />
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 12c0 1.733-.217 3.433-.693 5.048-1.118 4.371-5.066 7.563-9.749 7.953-1.242.175-2.463.203-3.67.203-.912 0-1.822-.041-2.728-.173-5.026-.646-9.66-4.137-11.301-9.086-.333-.98-.5-2.026-.5-3.258s.167-2.277.5-3.258c1.641-4.949 6.275-8.44 11.301-9.086.906-.132 1.816-.173 2.728-.173 1.207 0 2.428.028 3.67.203 4.684.39 8.631 3.582 9.749 7.953 0 1.615.193 3.316.193 5.049zm-2.056 0c0-1.279-.136-2.613-.409-3.943-1.006-4.113-4.019-7.382-8.172-7.92-.604-.107-1.197-.164-1.749-.164-.593 0-1.19.058-1.749.164-4.153.538-7.166 3.807-8.172 7.92-.273 1.33-.409 2.664-.409 3.943s.136 2.613.409 3.943c1.006 4.113 4.019 7.382 8.172 7.92.604.107 1.196.164 1.749.164.593 0 1.19-.058 1.749-.164 4.153-.538 7.166-3.807 8.172-7.92.273-1.33.409-2.664.409-3.943zm-10.267-1.458c.465 0 .827.174 1.083.483.255.308.383.72.383 1.234 0 .499-.129.926-.384 1.246-.256.308-.623.469-1.092.469-.418 0-.777-.175-1.055-.509-.278-.334-.417-.753-.417-1.274 0-.506.139-.926.417-1.259.278-.332.637-.491 1.055-.491zm-3.06-4.378h6.703v3.451h-6.703v-3.451zm1.776-2.64c0-.618.115-1.188.345-1.692.23-.504.574-.934 1.048-1.273.473-.339.967-.533 1.486-.533.532 0 1.029.195 1.55.555.52.36.935.878 1.23 1.532.296.654.444 1.46.444 2.45 0 .966-.147 1.775-.439 2.433-.293.659-.71 1.173-1.248 1.508-.538.334-1.095.507-1.66.507-.532 0-1.027-.155-1.497-.44-.468-.284-.825-.688-1.05-1.156-.227-.47-.341-.962-.341-1.528z" />
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M22.673 4.194c.826 0 1.54.118 2.22.35a.028.028 0 00.008-.014c.053-.215.062-.442.021-.662-.049-.308-.192-.591-.446-.82-.254-.227-.582-.397-.904-.534-.673-.268-1.452-.415-2.261-.415-2.099 0-3.984 1.095-4.994 2.843-.677 1.312-.823 3.025-.413 4.568a.028.028 0 00-.007.016c-.052.214-.062.442-.021.661.049.307.193.591.446.82.254.227.582.398.904.534.673.268 1.452.415 2.261.415 2.099 0 3.984-1.095 4.994-2.843.676-1.312.823-3.025.413-4.568a.028.028 0 00.007-.016c.052-.215.062-.442.021-.661-.049-.308-.192-.591-.446-.82-.254-.227-.582-.397-.904-.534-.673-.268-1.452-.415-2.261-.415zm-4.373 1.306c-.392 0-.715.323-.715.715s.323.715.715.715.715-.323.715-.715-.323-.715-.715-.715zm2.301 1.052c.392 0 .715-.323.715-.715s-.323-.715-.715-.715-.715.323-.715.715.323.715.715.715zm-5.397-1.302c.391 0 .715.323.715.715s-.324.715-.715.715-.715-.323-.715-.715.323-.715.715-.715zm0-1.966c-.959 0-1.736.778-1.736 1.736s.777 1.736 1.736 1.736 1.736-.777 1.736-1.736-.777-1.736-1.736-1.736zm2.623 4.327c-.444.253-1.22.197-1.422-.168-.178-.314-.054-.765.331-1.095a1.552 1.552 0 01.673-.265c.391 0 .715.323.715.715s-.324.715-.715.715z" />
              </svg>
            </a>
          </div>
        </nav>
      </footer>
    </>
  );
};

export default Bottomfootgutter;
