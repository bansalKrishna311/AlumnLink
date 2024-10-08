import React from 'react';

const CardSlider = () => {
  const cards = [
    { id: 1, title: 'Card 1', content: 'This is card 1', image: '/path/to/image1.jpg' },
    { id: 2, title: 'Card 2', content: 'This is card 2', image: '/path/to/image2.jpg' },
    { id: 3, title: 'Card 3', content: 'This is card 3', image: '/path/to/image3.jpg' },
    { id: 4, title: 'Card 4', content: 'This is card 4', image: '/path/to/image4.jpg' },
    { id: 5, title: 'Card 5', content: 'This is card 5', image: '/path/to/image5.jpg' },
  ];

  return (
    <div className="flex p-4 overflow-x-auto justify-center align-middle items-center">
      {cards.map((card) => (
        <div
          key={card.id}
          className="relative flex flex-col items-center justify-center w-[150px] h-80 bg-gray-200 border border-gray-300 shadow-md transition-all duration-300 group hover:w-[500px] hover:z-10 hover:bg-white hover:shadow-2xl"
        >
          {/* Default content */}
          <div className="flex flex-col items-center transition-opacity duration-300 group-hover:opacity-0 opacity-100">
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-sm text-gray-600">{card.content}</p>
          </div>

          {/* Image on hover */}
          <img
            src={card.image}
            alt={card.title}
            className="absolute inset-0 object-cover w-full h-full rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>
      ))}
    </div>
  );
};

export default CardSlider;