import React, { useState } from "react";
import JoinNetwork from "./joinNetwork";
import JNImageSlider from "./JNImageSlider";
// import ImagesSliderDemo from "./ImageSliderDemo";

const JoinNetworkCalling = () => {
  const [isJoinButtonVisible, setIsJoinButtonVisible] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Function to show the form when button is clicked
  const openForm = () => {
    setIsJoinButtonVisible(false); // Hide the "Join Network" button
    setIsFormVisible(true); // Show the form
  };

  return (
    <div className="min-h-screen flex flex-col justify-start items-center pt-4">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-800 via-purple-400 to-blue-600 mt-6 mb-4">
        Want to be the part of Alumlink?
      </h1>

      <p className="text-lg text-gray-700 text-center mb-6">
        Join a growing network of alumni, professionals, and students. Expand
        your connections and opportunities through the Alumlink community.
      </p>
      <JNImageSlider />
      {/* <ImagesSliderDemo /> */}
      <p className="text-3xl font-bold text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-400 to-gray-700 mt-6 mb-4">
        Join Now and be the part of your Alma Mater
      </p>

      <div className="relative mt-6">
        
            <JoinNetwork />
         
      </div>
    </div>
  );
};

export default JoinNetworkCalling;
