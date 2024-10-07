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
        {/* Card 1 */}
        <img src={card1} alt="" className="w-full h-auto object-contain" />

        {/* Card 2 */}
        <img src={card2} alt="" className="w-full h-auto object-contain" />

        {/* Card 3 */}
        <img src={card3} alt="" className="w-full h-auto object-contain" />

        {/* Card 4 */}
        <img src={card4} alt="" className="w-full h-auto object-contain" />

        {/* Card 5 */}
        <img src={card5} alt="" className="w-full h-auto object-contain" />

        {/* Card 6 */}
        <img src={card6} alt="" className="w-full h-auto object-contain" />
      </div>
    </div>
  );
};

export default Features;
