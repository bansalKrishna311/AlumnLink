import React from "react";
import JoinNetwork from "./joinNetwork";
import JNImageSlider from "./JNImageSlider";
import { useQueryClient } from "@tanstack/react-query";

const JoinNetworkCalling = () => {
  const queryClient = useQueryClient();

  return (
    <div className="min-h-screen flex flex-col justify-start items-center pt-4">
      <h1 className="text-4xl font-bold text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-800 via-purple-400 to-blue-600 mt-6 mb-4">
        Want to be a part of Alumlink?
      </h1>

      <p className="text-lg text-gray-700 text-center mb-6">
        Join a growing network of alumni, professionals, and students. Expand
        your connections and opportunities through the Alumlink community.
      </p>

      <JNImageSlider />

      <p className="text-3xl font-bold text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-400 to-gray-700 mt-6 mb-4">
        Join Now and be part of your Alma Mater
      </p>

      {/* Buttons Container */}
      <div className="flex flex-row gap-4 justify-center items-center mt-6">
        <div className="relative">
          <JoinNetwork />
        </div>
      </div>
    </div>
  );
};

export default JoinNetworkCalling;
