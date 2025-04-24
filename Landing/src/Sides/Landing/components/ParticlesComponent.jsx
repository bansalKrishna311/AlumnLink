import React, { useEffect } from 'react';

const ParticlesComponent = ({ theme }) => {
  useEffect(() => {
    // Dynamically load particles.js from the CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.async = true;

    const initializeParticles = () => {
      // Set particle colors based on the theme
      const particlesConfig = {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: theme === 'dark' ? "#ffffff" : "#808080", // White in dark mode, grey in light mode
          },
          shape: {
            type: "circle",
            stroke: {
              width: 0,
              color: "#000000",
            },
            polygon: {
              nb_sides: 3,
            },
            image: {
              src: "img/github.svg",
              width: 100,
              height: 100,
            },
          },
          opacity: {
            value: 0.5,
            random: true,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 3,
            random: false,
            anim: {
              enable: false,
              speed: 0,
              size_min: 0.1,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: theme === 'dark' ? "#ffffff" : "#000", // White in dark mode, grey in light mode
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 6, // Increased speed from 6 to 10
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: "window",
          events: {
            onhover: {
              enable: true,
              mode: "repulse",
            },
            onclick: {
              enable: false,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3,
            },
            repulse: {
              distance: 100,
              duration: 0.4,
            },
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: true,
      };

      // Check if particles.js is loaded before initializing
      if (window.particlesJS) {
        window.particlesJS('particles-js', particlesConfig);
      }
    };

    // Load the script and initialize particles
    script.onload = initializeParticles;
    document.body.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, [theme]); // Run effect when the theme changes

  return (
    <div
      id="particles-js"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    ></div>
  );
};

export default ParticlesComponent;
