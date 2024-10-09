import React from 'react'
import Hero from './Sides/Landing/components/Hero'
import Navbar from './Sides/Landing/components/Navbar'
import LogoSlider from './Sides/Landing/components/LogoSlider'
import StackCards from './Sides/Landing/components/StackCards/StackCards'
import Action from './Sides/Landing/components/Action'
import TargetCustomer from './Sides/Landing/components/TargetCustomer'

const App = () => {
  return (<>
    <Navbar/>
    <Hero/>
    <Action/>
   {/* <LogoSlider/> */}
<StackCards/>
<TargetCustomer/>
    </>
  )
}

export default App