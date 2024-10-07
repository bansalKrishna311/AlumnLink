import React from 'react';
import card1 from '../../../assets/hero/1.png';
import card2 from '../../../assets/hero/2.png';
import card3 from '../../../assets/hero/3.png';
import card4 from '../../../assets/hero/4.png';
import card5 from '../../../assets/hero/5.png';
import card6 from '../../../assets/hero/6.png';

const Features = () => {
  return (
    <div className="bg-base-200 p-8 min-h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Cards with hover effects */}
        {[card1, card2, card3, card4, card5, card6].map((card, index) => (
          <div 
            key={index}
            className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-y-105 hover:translate-y-[-10px]"
            style={{ transformOrigin: 'bottom' }} // Set transform origin to bottom
          >
            <img src={card} alt="" className="w-full h-auto object-cover transition-transform duration-300 ease-in-out" />
            <div className="absolute inset-0 transition-opacity duration-300 ease-in-out" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
