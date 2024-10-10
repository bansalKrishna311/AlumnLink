import React, { useEffect } from 'react';
import { ScrollObserver, valueAtPercentage } from 'aatjs';
import cardImage1 from "../../../../assets/StackCards/11.png";
import cardImage2 from "../../../../assets/StackCards/22.png";
import cardImage3 from "../../../../assets/StackCards/33.png";
import cardImage4 from "../../../../assets/StackCards/44.png";
import cardImage5 from "../../../../assets/StackCards/55.png";
import cardImage6 from "../../../../assets/StackCards/66.png";

const StackCards = () => {
  useEffect(() => {
    const cardsContainer = document.querySelector('.cards');
    const cards = document.querySelectorAll('.card');

    if (cardsContainer && cards.length > 0) {
      cardsContainer.style.setProperty('--cards-count', cards.length);
      cardsContainer.style.setProperty('--card-height', ${cards[0].clientHeight}px);

      Array.from(cards).forEach((card, index) => {
        const offsetTop = 20 + index * 20; // Fine-tune spacing between cards
        card.style.paddingTop = ${offsetTop}px;

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

  const cardData = [
    {
      title: "Build Lasting Connections",
      description:
        "Join a community where every connection counts. Reconnect with peers, share experiences, and foster lifelong bonds.",
      image: cardImage1,
    },
    {
      title: "Unlock Career Opportunities",
      description:
        "Discover job openings, internships, and career advancements tailored just for you. Your next big break is just a click away.",
      image: cardImage2,
    },
    {
      title: "Expand Your Professional Circle",
      description:
        "Connect with industry leaders, alumni, and professionals from diverse fields to elevate your career journey.",
      image: cardImage3,
    },
    {
      title: "Guidance from Experts",
      description:
        "Tap into the wisdom of seasoned mentors. Get career advice, insights, and personalized guidance for your growth.",
      image: cardImage4,
    },
    {
      title: "Exclusive Events & Discussions",
      description:
        "Be part of interactive webinars, networking sessions, and alumni meetups. Stay engaged with the latest trends.",
      image: cardImage5,
    },
    {
      title: "Accelerate Your Career",
      description:
        "Leverage our curated resources, tools, and connections to fast-track your professional and personal growth.",
      image: cardImage6,
    },
  ];

  return (
    <div>
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-20 p-4">
        <h1 className="text-center text-xl font-bold">Navbar</h1>
      </div>

      {/* Heading */}
      <h1 className="text-center text-3xl font-bold mt-[80px] z-10 relative">Explore Our Stack Cards</h1>

      {/* Cards section */}
      <div className="cards w-full max-w-3xl mx-auto mt-16 grid grid-rows-[repeat(var(--cards-count),var(--card-height))] gap-10">
        {cardData.map((card, index) => (
          <div className="card sticky top-16" key={index}>
            <div className="card__inner bg-white rounded-lg shadow-xl transform transition-transform origin-top">
              <div className="card__image-container w-full h-64 overflow-hidden rounded-t-lg">
                <img
                  className="card__image w-full  object-fill"
                  src={card.image}
                  alt={Card ${index + 1}}
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
      <div className="h-[90vh]"></div>
    </div>
  );
};

export default StackCards;