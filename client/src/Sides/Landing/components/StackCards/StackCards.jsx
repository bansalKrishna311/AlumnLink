import React, { useEffect, useRef } from 'react';
import './StackCards.css'; // Import any additional CSS if necessary

const StackCards = () => {
  const stackRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const element = stackRef.current;
    const items = itemsRef.current;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        window.addEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    });

    observer.observe(element);

    const handleScroll = () => {
      window.requestAnimationFrame(() => {
        animateStackCards(element, items);
      });
    };

    const animateStackCards = (element, items) => {
      const top = element.getBoundingClientRect().top;

      const cardTop = 100; // Dummy value for card top
      const cardHeight = 300; // Dummy value for card height
      const marginY = 20; // Dummy value for vertical margin

      for (let i = 0; i < items.length; i++) {
        const scrolling = cardTop - top - i * (cardHeight + marginY);
        if (scrolling > 0) {
          const scaleValue = (cardHeight - scrolling * 0.05) / cardHeight;
          items[i].style.transform = `translateY(${marginY * i}px) scale(${scaleValue})`;
        }
      }
    };

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <ul className="stack-cards space-y-4" ref={stackRef}>
      {[...Array(5)].map((_, i) => (
        <li
          key={i}
          className="stack-cards__item card bg-base-200 shadow-lg w-full p-5"
          ref={(el) => (itemsRef.current[i] = el)}
        >
          <h2 className="card-title">Card {i + 1}</h2>
          <p>This is a demo card using DaisyUI and Tailwind CSS.</p>
        </li>
      ))}
    </ul>
  );
};

export default StackCards;
