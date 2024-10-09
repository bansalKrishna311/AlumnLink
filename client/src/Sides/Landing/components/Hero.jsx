import React from 'react';
import Features from './Features';
import Btn from './Btn';

const Hero = () => {
  return (
    <div className="hero bg-base-[#ECF2FF] md:pt-20">
      <div className="hero-content flex-col lg:flex-row-reverse align-middle justify-center items-center gap-24">
        <div className='max-w-full mt-14'>
        <Features/>
        </div>
        
        <div className='lg:mt-14 md:mt-0 '>
        <h1 className="font-bold flex items-center">
  <span className='text-[#6b21a8] me-2 text-[28px] sm:text-[40px] md:text-[52px]'>Unlock</span>
  <p className='text-[28px] sm:text-[48px] md:text-[52px]'>Your Network</p>
</h1>



          {/* Avatar */}
          <div className="flex items-center mt-2">
            <div className="flex -space-x-2 rtl:space-x-reverse p-1 rounded-full border-2 border-dashed border-gray-400">
              <div className="avatar">
                <div className="w-7 h-7 rounded-full">
                  <img
                    src="https://img.freepik.com/free-photo/portrait-cheerful-handsome-man-plaid-shirt-looking-camera-smiling-grey-wall_176420-3399.jpg?t=st=1728283155~exp=1728286755~hmac=60c8de24e5d329bceacfe3683badce0eb222ddc62320cb0b27191afca2ad85c9&w=360"
                    alt="Avatar 1"
                    className="w-full h-full rounded-full object-fill"
                  />
                </div>
              </div>
              <div className="avatar">
                <div className="w-7 h-7 rounded-full">
                  <img
                    src="https://img.freepik.com/free-photo/curly-artist-holding-paintbrushes_114579-26901.jpg?t=st=1728283468~exp=1728287068~hmac=36fc559c461829e161bbd75ae794fa47b7f7a6278ca868cd925727b93c9ae459&w=360"
                    alt="Avatar 2"
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>
              <div className="avatar">
                <div className="w-7 h-7 rounded-full">
                  <img
                    src="https://img.freepik.com/free-photo/indoor-picture-cheerful-handsome-young-man-having-folded-hands-looking-directly-smiling-sincerely-wearing-casual-clothes_176532-10257.jpg?t=st=1728283496~exp=1728287096~hmac=44cb2eec6b63743d640de9a737533b27db35a8b7ece9722f9e17f292b247e8b2&w=1060"
                    alt="Avatar 3"
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Avatar end */}

          <p className="py-6 text-gray-500 font-medium">
            AlumnLink offers a unique platform to engage with alumni networks,  share<br /> experiences, and collaborate on projects that enhance career <br />development and professional growth.
          </p>

          <div className='w-[200px] -ms-5'>
          <Btn/>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Hero;
