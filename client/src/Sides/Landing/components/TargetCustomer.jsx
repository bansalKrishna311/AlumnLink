import React from "react";
import { FaSchool } from "react-icons/fa";
import { LiaSchoolSolid, LiaUniversitySolid } from "react-icons/lia";
import { FaBuilding } from "react-icons/fa";

const TargetCustomer = () => {
  return (
    <div className="hero bg-[#f2eafa] py-10 lg:py-20">

      <div className="hero-content flex-col lg:flex-row items-center gap-10 lg:gap-20">
        {/* Left Content */}
        <div className="flex-1">
          <h1 className="font-bold mb-2 text-[36px] md:text-[46px] text-center">
            <span className="text-[#6b21a8]">Unique</span>
            <span> Solutions</span>
          </h1>
          <p className="text-gray-600 mb-6 text-[16px] md:text-[18px] text-center">
          We recognize that every alumni network has its own distinct needs. Discover how our tailored solutions <br/>cater to those specific requirements.
          </p>

          {/* Flexbox for Icons */}
          <div className="flex flex-col lg:flex-row justify-evenly  gap-5 ">
            {/* Icon for Schools */}
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 lg:w-24 lg:h-24 flex justify-center items-center bg-[#FFDD80] rounded-lg">
                <LiaSchoolSolid className="w-12 h-12 lg:w-14 lg:h-14 z-10" color="#333333" />
              </div>
              <p className="mt-2 text-center text-sm font-semibold">Schools</p>
            </div>

            {/* Icon for Colleges */}
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 lg:w-24 lg:h-24 flex justify-center items-center bg-[#9BC9FF] rounded-lg">
                <FaSchool className="w-12 h-12 lg:w-14 lg:h-14 z-10" color="#333333" />
              </div>
              <p className="mt-2 text-center text-sm font-semibold">Colleges</p>
            </div>

            {/* Icon for Universities */}
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 lg:w-24 lg:h-24 flex justify-center items-center bg-[#9BE6C1] rounded-lg">
                <LiaUniversitySolid className="w-12 h-12 lg:w-16 lg:h-16 z-10" color="#333333" />
              </div>
              <p className="mt-2 text-center text-sm font-semibold">Universities</p>
            </div>

            {/* Icon for Offices */}
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 lg:w-24 lg:h-24 flex justify-center items-center bg-[#C8BBFF] rounded-lg">
                <FaBuilding className="w-10 h-10 lg:w-12 lg:h-12 z-10" color="#333333" />
              </div>
              <p className="mt-2 text-center text-sm font-semibold">Offices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetCustomer;
