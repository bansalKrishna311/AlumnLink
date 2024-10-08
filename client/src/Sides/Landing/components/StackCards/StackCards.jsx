import React, { useEffect } from 'react';
import { ScrollObserver, valueAtPercentage } from 'aatjs';

const StackCards = () => {
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

  const cardData = [
    {
      title: "Card Title 1",
      description: "Description for the first card. Lorem ipsum dolor sit amet.",
      image: "https://images.unsplash.com/photo-1620207418302-439b387441b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=100",
    },
    {
      title: "Card Title 2",
      description: "Description for the second card. Sed ut perspiciatis unde omnis iste natus error.",
      image: "https://images.unsplash.com/photo-1620207418302-439b387441b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=100",
    },
    {
      title: "Card Title 3",
      description: "Description for the third card. At vero eos et accusamus et iusto odio dignissimos.",
      image: "https://images.unsplash.com/photo-1620207418302-439b387441b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=100",
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
                  className="card__image w-full h-full object-cover"
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
      <div className="h-[90vh]"></div>
    </div>
  );
};

export default StackCards;
