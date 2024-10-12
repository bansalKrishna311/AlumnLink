import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../components/ui/Test_Modal";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi"; // Import the FiArrowRight icon

const Btn = () => {
  const images = [
    "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <div className="py-35 flex items-center justify-center z-50 sm:px-8 md:px-8">
      <Modal>
        <ModalTrigger>
          <div>
            <a className="btn rounded-full px-12 transition-transform duration-300 ease-in-out hover:bg-secondary hover:text-white bg-started text-white flex items-center">
              Get Started
              <FiArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </ModalTrigger>

        <ModalBody className="mt-10">
          <ModalContent className="z-50 " >
            <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
              Get Started With{" "}
              <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                AlumnLink
              </span>{" "}
              now! ✈️
            </h4>
            <div className="flex justify-center items-center">
              {images.map((image, idx) => (
                <motion.div
                  key={"images" + idx}
                  style={{
                    rotate: Math.random() * 20 - 10,
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 0,
                    zIndex: 100,
                  }}
                  whileTap={{
                    scale: 1.1,
                    rotate: 0,
                    zIndex: 100,
                  }}
                  className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
                >
                  <img
                    src={image}
                    alt="bali images"
                    width="500"
                    height="500"
                    className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                  />
                </motion.div>
              ))}
            </div>
            <div className="py-10 flex flex-wrap gap-x-4 gap-y-6 items-start justify-start max-w-sm mx-auto">
              <IconWithText icon={PlaneIcon} text="A Software Engineer" />
              <IconWithText icon={ElevatorIcon} text="MERN stack Developer" />
              <IconWithText icon={VacationIcon} text="1+ years of Experience" />
              <IconWithText icon={FoodIcon} text="7+ projects" />
              <IconWithText icon={MicIcon} text="2 Internships" />
              <IconWithText icon={ParachuteIcon} text="Hobbies - Music, Sports" />
            </div>
          </ModalContent>
          <ModalFooter className="gap-4">
            <a href="#" target="_blank" className="no-underline">   
              <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
                Request Demo
              </button>
            </a>
            <a href="#" target="_blank" className="no-underline">
              <button className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm">
                Login/Signup
              </button>
            </a>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
};

// IconWithText Component
const IconWithText = ({ icon: Icon, text }) => (
  <div className="flex items-center justify-center">
    <Icon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
    <span className="text-neutral-700 dark:text-neutral-300 text-sm">{text}</span>
  </div>
);

// Icons
const PlaneIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z" />
  </svg>
);

const VacationIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M17.553 16.75a7.5 7.5 0 0 0 -10.606 0" />
    <path d="M18 3.804a6 6 0 0 0 -8.196 2.196" />
    <path d="M6 9v0a5.964 5.964 0 0 0 2 -3.75" />
    <path d="M17 10a5.985 5.985 0 0 0 2 3.75" />
  </svg>
);

const ElevatorIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M14 12h-4v-4h4v4z" />
    <path d="M14 8h4v4h-4v-4z" />
    <path d="M10 16v-2h4v2" />
    <path d="M10 20v-2h4v2" />
    <path d="M4 12h4v-2H4v2z" />
    <path d="M4 16h4v-2H4v2z" />
    <path d="M4 8h4V6H4v2z" />
  </svg>
);

const FoodIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M10 8h4v4h-4z" />
    <path d="M7 8v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2 -2V8" />
  </svg>
);

const MicIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 1v5m0 4v4" />
    <path d="M6 11h12a6 6 0 0 1 0 12h-12a6 6 0 0 1 0 -12z" />
  </svg>
);

const ParachuteIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 2l5 5h-10l5 -5z" />
    <path d="M8 7v12h8V7" />
    <path d="M12 15v6" />
  </svg>
);

export default Btn;
