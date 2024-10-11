import React from 'react';

export default function Content() {
  return (
    <div className={`py-8 px-36 h-full w-full flex flex-col justify-end ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bg-base-100' : 'bg-[#f2eafa]'}`}>
      <Section1 />
      <Section2 />
    </div>
  );
}

const Section1 = () => {
  return (
    <div>
      <Nav />
    </div>
  );
}

const Section2 = () => {
  return (
    <div className='flex justify-between items-end'>
      <h1 className='text-4xl md:text-[10vw] leading-[0.8] mt-10 text-base-content'>AlumnLink</h1>
      <p className='text-base-content'>©copyright</p>
    </div>
  );
}

const Nav = () => {
  return (
    <div className='flex shrink-0 gap-20'>
      <div className='flex flex-col gap-2'>
        <h3 className='mb-2 uppercase text-base-content'>About</h3>
        <p className='text-base-content'>Home</p>
        <p className='text-base-content'>Projects</p>
        <p className='text-base-content'>Our Mission</p>
        <p className='text-base-content'>Contact Us</p>
      </div>
      <div className='flex flex-col gap-2'>
        <h3 className='mb-2 uppercase text-base-content'>Education</h3>
        <p className='text-base-content'>News</p>
        <p className='text-base-content'>Learn</p>
        <p className='text-base-content'>Certification</p>
        <p className='text-base-content'>Publications</p>
      </div>
    </div>
  );
}
