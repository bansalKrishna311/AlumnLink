import React from 'react'
import Hero from './Sides/Landing/components/Hero'
import Navbar from './Sides/Landing/components/Navbar'
import LogoSlider from './Sides/Landing/components/LogoSlider'
import Slider from './Sides/Landing/components/Slider'

const App = () => {
  return (<>
    <Navbar/>
    <Hero/>
   <LogoSlider/>
   {/* <Slider/> */}

    </>
  )
}

export default App