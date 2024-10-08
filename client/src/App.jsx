import React from 'react'
import Hero from './Sides/Landing/components/Hero'
import Navbar from './Sides/Landing/components/Navbar'
import LogoSlider from './Sides/Landing/components/LogoSlider'
import StackCards from './Sides/Landing/components/StackCards/StackCards'

const App = () => {
  return (<>
    <Navbar/>
    <Hero/>
   {/* <LogoSlider/> */}
<StackCards/>
    </>
  )
}

export default App