import React from 'react';
import card1 from '../../../assets/hero/1.png';
import card2 from '../../../assets/hero/2.png';
import card3 from '../../../assets/hero/3.png';
import card4 from '../../../assets/hero/4.png';
import card5 from '../../../assets/hero/5.png';
import card6 from '../../../assets/hero/6.png';

const Features = () => {
  return (
    <div className="bg-transparent min-h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-6">
        {/* Cards with hover effects */}
        {[card1, card2, card3, card4, card5, card6].map((card, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-500 ease-in-out hover:translate-y-[-10px]"
            style={{
              width: '260px', // Set max width
              height: '124px', // Set max height
              transformOrigin: 'bottom',
            }}
          >
            <img 
              src={card} 
              alt={`Card ${index + 1}`} 
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out" 
              style={{
                maxWidth: '100%',  // Ensure it scales within the container
                maxHeight: '100%', // Ensure it scales within the container
              }}
            />
            <div className="absolute inset-0 transition-opacity duration-500 ease-in-out" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
