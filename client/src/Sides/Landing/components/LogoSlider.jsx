import React from 'react';
import logo from '../../../../src/assets/logo copy.png'; // Light mode logo

const LogoSlider = () => {
  return (
    <div className="w-full overflow-hidden"> {/* Added overflow-hidden */}
      <div className="inline-flex flex-nowrap">
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
          <li>
            <img src={logo} alt="Facebook" />
          </li>
          <li>
            <img src={logo} alt="Disney" />
          </li>
          <li>
            <img src={logo} alt="Airbnb" />
          </li>
          <li>
            <img src={logo} alt="Apple" />
          </li>
          <li>
            <img src={logo} alt="Spark" />
          </li>
          <li>
            <img src={logo} alt="Samsung" />
          </li>
          <li>
            <img src={logo} alt="Quora" />
          </li>
          <li>
            <img src={logo} alt="Sass" />
          </li>
        </ul>
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
          <li>
            <img src={logo} alt="Facebook" />
          </li>
          <li>
            <img src={logo} alt="Disney" />
          </li>
          <li>
            <img src={logo} alt="Airbnb" />
          </li>
          <li>
            <img src={logo} alt="Apple" />
          </li>
          <li>
            <img src={logo} alt="Spark" />
          </li>
          <li>
            <img src={logo} alt="Samsung" />
          </li>
          <li>
            <img src={logo} alt="Quora" />
          </li>
          <li>
            <img src={logo} alt="Sass" />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LogoSlider;
