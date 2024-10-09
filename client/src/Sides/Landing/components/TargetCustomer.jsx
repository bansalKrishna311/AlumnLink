import React from "react";
import { FaSchool } from "react-icons/fa";
import { LiaSchoolSolid } from "react-icons/lia";
import { LiaUniversitySolid } from "react-icons/lia";
import { FaBuilding } from "react-icons/fa";

const ResponsiveSection = () => {
  return (
    <div className="hero bg-base-[#ECF2FF] p-8">
      <div className="hero-content flex-col lg:flex-row items-center gap-20">
        {/* Right Image */}
        <div className="flex-1">
          <img
            src="https://d8it4huxumps7.cloudfront.net/uploads/images/66a3848a05626_practice.png?d=996x803"
            alt="Right Side Image"
            className="w-full max-w-2xl rounded-lg"
          />
        </div>

        {/* Left Content */}
        <div className="flex-3">
          <h1 className="font-bold mb-2 text-[46px]">
            <span className="text-[#6b21a8]">Unlock</span>
            <span> Perfection</span>
          </h1>
          <p className="text-gray-600 mb-6 text-[18px]">
            Solve easy to complex problems & get hands-on experience to
            <br />
            get hired by your dream company!
          </p>

          <div className="grid grid-cols-2 gap-y-5">
  {/* Square Background for Each Icon */}
  <div className="w-32 h-32 flex justify-center items-center bg-[#FFDD80] rounded-lg md:-mx-2 sm:m-0">
    <LiaSchoolSolid className="w-24 h-24" color="#333333" />
  </div>
  <div className="w-32 h-32 flex justify-center items-center bg-[#9BC9FF] rounded-lg md:-mx-20 sm:m-0">
    <FaSchool className="w-24 h-24" color="#333333" />
  </div>
  <div className="w-32 h-32 flex justify-center items-center bg-[#9BE6C1] rounded-lg md:-mx-2 sm:m-0">
    <LiaUniversitySolid className="w-28 h-28" color="#333333" />
  </div>
  <div className="w-32 h-32 flex justify-center items-center bg-[#C8BBFF] rounded-lg md:-mx-20 sm:m-0">
    <FaBuilding className="w-24 h-24" color="#333333" />
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default ResponsiveSection;
