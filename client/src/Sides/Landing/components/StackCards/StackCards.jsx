import React, { useEffect, useRef } from 'react';
import { ScrollObserver, valueAtPercentage } from 'aatjs'; // Ensure this library is installed and imported
import cardImage1 from "../../../../assets/StackCards/11.png";
import cardImage2 from "../../../../assets/StackCards/22.png";
import cardImage3 from "../../../../assets/StackCards/33.png";
import cardImage4 from "../../../../assets/StackCards/44.png";
import cardImage5 from "../../../../assets/StackCards/55.png";
import cardImage6 from "../../../../assets/StackCards/66.png";
// import ParticlesComponent fr om './ParticlesComponent'; 
// import ParticlesComponent from './'; // Import the ParticlesComponent

const StackCards = () => {
  const cardRefs = useRef([]); // Store references to each card

  useEffect(() => {
    const cardsContainer = document.querySelector('.cards');
    const cards = document.querySelectorAll('.card');

    if (cardsContainer && cards.length > 0) {
      cardsContainer.style.setProperty('--cards-count', cards.length);
      cardsContainer.style.setProperty('--card-height', `${cards[0].clientHeight}px`);

      Array.from(cards).forEach((card, index) => {
        const offsetTop = 20 + index * 20; // Fine-tune spacing between cards
        card.style.paddingTop = `${offsetTop}px`;

        if (index === cards.length - 1) return; // Skip last card, no animation needed for it

        const toScale = 1 - (cards.length - 1 - index) * 0.1;
        const nextCard = cards[index + 1];
        const cardInner = card.querySelector('.card__inner');

        ScrollObserver.Element(nextCard, {
          offsetTop,
          offsetBottom: window.innerHeight - card.clientHeight,
        }).onScroll(({ percentageY }) => {
          cardInner.style.transform = `scale(${valueAtPercentage({
            from: 1,
            to: toScale,
            percentage: percentageY,
          })})`;
          cardInner.style.filter = `brightness(${valueAtPercentage({
            from: 1,
            to: 0.6,
            percentage: percentageY,
          })})`;
        });
      });
    }
  }, []);

  const scrollToCard = (index) => {
    // Scroll to the card with the provided index
    cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  const cardData = [
    {
      id: "Connect",
      title: "Build Lasting Connections",
      description:
        "Join a community where every connection counts. Reconnect with peers, share experiences, and foster lifelong bonds.",
      image: cardImage1,
    },
    {
      id: "Opportunities",
      title: "Unlock Career Opportunities",
      description:
        "Discover job openings, internships, and career advancements tailored just for you. Your next big break is just a click away.",
      image: cardImage2,
    },
    {
      id: "Network",
      title: "Expand Your Professional Circle",
      description:
        "Connect with industry leaders, alumni, and professionals from diverse fields to elevate your career journey.",
      image: cardImage3,
    },
    {
      id: "Engage",
      title: "Guidance from Experts",
      description:
        "Tap into the wisdom of seasoned mentors. Get career advice, insights, and personalized guidance for your growth.",
      image: cardImage4,
    },
    {
      id: "Mentorship",
      title: "Exclusive Events & Discussions",
      description:
        "Be part of interactive webinars, networking sessions, and alumni meetups. Stay engaged with the latest trends.",
      image: cardImage5,
    },
    {
      id: "Grow",
      title: "Accelerate Your Career",
      description:
        "Leverage our curated resources, tools, and connections to fast-track your professional and personal growth.",
      image: cardImage6,
    },
  ];

  return (
    <div>
      {/* <ParticlesComponent /> Include ParticlesComponent here */}
      {/* Action Section as Navbar */}
      <div className='bg-base-[#ECF2FF] pb-5 pt-14 sm:opacity-0 md:opacity-100 opacity-0'>
        <div className="flex items-center justify-start space-x-6 p-3 bg-white rounded-lg shadow-md overflow-x-auto mx-6 relative">
          {/* Blue indicator */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-started rounded-l-full"></div>

          <div className="flex items-center bg-[#DFC5FE] rounded-full p-2 ml-6">
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m2 0a2 2 0 11-4 0 2 2 0 114 0z"
              />
            </svg>
            <span className="ml-2 mr-4 font-medium text-[12px] text-nowrap">I'm here to</span>
          </div>

          {/* Buttons with onClick for scrolling */}
          {cardData.map((card, index) => (
            <button
              key={card.id}
              onClick={() => scrollToCard(index)}
              className="px-4 py-2 text-nowrap text-[12px] bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all"
            >
              {card.id}
            </button>
          ))}

          <div className="flex-grow"></div>
          <span className="text-gray-400 ml-auto text-nowrap whitespace-nowrap">
            Find the best product for your business
          </span>
        </div>
      </div>

      {/* Stack Cards Section */}
      <div className="cards w-full max-w-3xl mx-auto mt-16 grid grid-rows-[repeat(var(--cards-count),var(--card-height))] gap-10 p-2">
        {cardData.map((card, index) => (
          <div className="card sticky top-16" key={index} ref={(el) => (cardRefs.current[index] = el)}>
            <div className="card__inner bg-white rounded-lg shadow-xl transform transition-transform origin-top">
              <div className="card__image-container w-full h-64 overflow-hidden rounded-t-lg">
                <img
                  className="card__image w-full object-fill"
                  src={card.image}
                  alt={`Card ${index + 1}`}
                  loading="lazy"
                />
              </div>
              <div className="card__content p-6">
                <h1 className="card__title text-3xl font-bold text-gray-900 mb-2">{card.title}</h1>
                <p className="card__description text-lg text-gray-700">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Spacer for scrolling */}
      <div className="h-[40vh]"></div>
    </div>
  );
};

export default StackCards;
