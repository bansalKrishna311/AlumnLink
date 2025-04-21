import React from "react";

const images = [
    "https://bmnmsbiymz.ufs.sh/f/1V3V2P4kpAumqWLC0dVXl8GxJUCebYMr3An0agj2yWpiqVvf",
    "https://bmnmsbiymz.ufs.sh/f/1V3V2P4kpAum2yUOpgWvT53OZ1aHF8mkfdPiU0cDoMlRG9zL",
    "https://bmnmsbiymz.ufs.sh/f/1V3V2P4kpAumzE9eFQAhYxgKZ6AOMFluBUJEmvVjiwbnNWpq",
    "https://bmnmsbiymz.ufs.sh/f/1V3V2P4kpAumIMqBstR21jqluvKkFoRaDpPfCGTtxewIs74z",
    "https://bmnmsbiymz.ufs.sh/f/1V3V2P4kpAumyA6pe5Gvj9LGdSxXKPThlzeQcWmgO61ZJ87U",
    "https://bmnmsbiymz.ufs.sh/f/1V3V2P4kpAumPGoet0Z89C4GnNKHTXFvruVyAOm6ZwU2Sibo",
];

const Stats = () => {
  return (
    <div className="w-full h-full mt-12 mb-8 flex flex-col items-center lg:justify-center justify-start bg-white p-6">
      
      {/* Header Section */}
      <div className="w-11/12 mx-auto flex flex-col align-middle justify-start">
  <div className="flex mb-5 items-center">
    {/* <span className="border-l-2 border-[#fe6019] h-6 mr-3"></span>
    <h1 className="text-sm md:text-lg font-semibold ">Event Stats</h1> */}
  </div>
  <h1 className="text-2xl md:text-4xl font-semibold">
    A Glimpse of  
    <span className="text-[#fe6019] text-2xl md:text-5xl md:py-2 block mb-5">
      Our Exciting Moments
    </span>
  </h1>
</div>

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-4 w-11/12 mx-auto h-screen">
        <div className="col-span-1 row-span-1 overflow-hidden rounded-lg relative group">
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 z-10"></div>
          <img 
            src={images[0]} 
            alt="Image 1" 
            className="w-full h-full object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105" 
          />
        </div>
        <div className="col-span-1 row-span-1 overflow-hidden rounded-lg relative group">
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 z-10"></div>
          <img 
            src={images[1]} 
            alt="Image 2" 
            className="w-full h-full object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105" 
          />
        </div>
        <div className="col-span-1 row-span-2 overflow-hidden rounded-lg relative group">
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 z-10"></div>
          <img 
            src={images[2]} 
            alt="Image 3" 
            className="w-full h-full object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105" 
          />
        </div>
        <div className="col-span-2 row-span-1 overflow-hidden rounded-lg relative group">
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 z-10"></div>
          <img 
            src={images[3]} 
            alt="Image 4" 
            className="w-full h-full object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105" 
          />
        </div>
        <div className="col-span-1 row-span-1 overflow-hidden rounded-lg relative group">
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 z-10"></div>
          <img 
            src={images[4]} 
            alt="Image 5" 
            className="w-full h-full object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105" 
          />
        </div>
        <div className="col-span-2 row-span-1 overflow-hidden rounded-lg relative group">
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 z-10"></div>
          <img 
            src={images[5]} 
            alt="Image 6" 
            className="w-full h-full object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105" 
          />
        </div>
      </div>
    </div>
  );
};

export default Stats;