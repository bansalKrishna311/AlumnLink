import React from 'react'
import Hero from './Sides/Landing/components/Hero'
import Navbar from './Sides/Landing/components/Navbar'
import LogoSlider from './Sides/Landing/components/LogoSlider'
import StackCards from './Sides/Landing/components/StackCards/StackCards'
import CardSlider from './Sides/Landing/components/CardSlider'
import Action from './Sides/Landing/components/Action'
import Bottomfootgutter from './Sides/Landing/components/Bottomfootgutter'

const App = () => {
  return (<>
    <Navbar/>
    <Hero/>
    <Action/>
   {/* <LogoSlider/> */}
<StackCards/>
<CardSlider/>
<Bottomfootgutter/>

    </>
  )
}

export default App