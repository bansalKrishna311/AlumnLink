import React, { useState, useEffect } from 'react';

const CardSlider = () => {
  const [openCard, setOpenCard] = useState(1); // Default card is 1
  const [lastInteractedCard, setLastInteractedCard] = useState(1); // Track last interacted card

  const cards = [
    { 
      id: 1, 
      title: 'Comprehensive Alumni Management Platform', 
      content: 'A powerful platform to manage alumni networks with integrated mobile app features.', 
      image: '/path/to/image1.jpg',
      icon: '/path/to/icon1.png', 
      button: 'Start Now',
    },
    { 
      id: 2, 
      title: 'Dedicated Support Services', 
      content: 'Expert guidance for running successful alumni programs and engagement.', 
      image: '/path/to/image2.jpg',
      icon: '/path/to/icon2.png', 
      button: 'Get Support',
    },
    { 
      id: 3, 
      title: 'Tailored Engagement Solutions', 
      content: 'Custom offerings that cater to various alumni personas, fostering deeper connections.', 
      image: '/path/to/image3.jpg',
      icon: '/path/to/icon3.png', 
      button: 'Explore Solutions',
    },
    { 
      id: 4, 
      title: 'Career Assistance & Job Opportunities', 
      content: 'Job boards and networking to help alumni connect with potential employers.', 
      image: '/path/to/image4.jpg',
      icon: '/path/to/icon4.png', 
      button: 'View Jobs',
    },
    { 
      id: 5, 
      title: 'Alumni Relations Leadership Program', 
      content: 'A structured training program for administrators to drive alumni relations.', 
      image: '/path/to/image5.jpg',
      icon: '/path/to/icon5.png', 
      button: 'Learn More',
    },
  ];

  // Handle scroll and keep the last hovered card open
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY + window.innerHeight < document.documentElement.scrollHeight) {
        setOpenCard(lastInteractedCard); // Keep the last hovered card open
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastInteractedCard]);

  return (
    <div className="hidden md:flex p-4 px-32 overflow-x-auto justify-center items-center bg-cover" style={{ backgroundImage: 'url(/path/to/your/background-image.jpg)' }}>
      {cards.map((card) => (
        <div
          key={card.id}
          onMouseEnter={() => {
            setOpenCard(card.id);  // Open the card on hover
            setLastInteractedCard(card.id);  // Keep track of the last hovered card
          }}
          className={`relative flex flex-col items-start justify-center transition-all duration-500 ease-in-out group 
            ${openCard === card.id ? 'w-[500px] z-10 bg-base-100 shadow-xl' : 'w-[250px] bg-base-200'}
            h-80 border border-base-300`}
          style={{
            boxShadow: openCard === card.id ? '0 10px 40px rgba(0, 0, 0, 0.15)' : '0 5px 10px rgba(0, 0, 0, 0.1)',
            marginRight: openCard === card.id ? '0' : '-1px', // Remove gap between cards
          }}
        >
          {/* Icon section */}
          <img
            src={card.icon}
            alt={`${card.title} Icon`}
            className="absolute top-4 left-4 w-12 h-12 rounded-full"
          />

          {/* Title and Content */}
          <div className="absolute top-20 left-4 right-4 transition-opacity duration-300 ease-in-out">
            <h3 className="text-lg font-semibold text-base-content">{card.title}</h3>
            <p className="text-sm text-base-content">{card.content}</p>
          </div>

          {/* Image section */}
          <img
            src={card.image}
            alt={card.title}
            className="absolute inset-0 object-cover w-full h-full "
          />

          {/* Button */}
          <div className={`absolute bottom-4 left-4 transition-opacity duration-300 ${openCard === card.id ? 'opacity-100' : 'opacity-0'}`}>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              {card.button} ➜
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSlider;
