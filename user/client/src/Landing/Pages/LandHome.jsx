import React from "react";
import Events from "../Components/Home/Events";
import Testimonial from "../Components/Home/Testimonial";
import About from "../Components/Home/About";
import Impact from "../Components/Home/Impact";
import Gallery from "../Components/Home/Gallery";
import Stats from "../Components/Home/Stats";



const LandHome = () => {
  return (
    <div>
{/* <Box
      sx={{
        height: "100vh",
        background: "url('/hero-bg.jpg') center/cover no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
      }}
    >
      <Stack spacing={4}>
        <Typography variant="h2" sx={{ fontWeight: "bold" }}>
          Reconnect. Relive. Reignite.
        </Typography>
        <Typography variant="h6">
          Join the most engaging alumni network and stay connected with your alma mater.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="primary" href="/join">
            Join Now
          </Button>
          <Button variant="outlined" color="secondary" href="/explore">
            Explore Alumni
          </Button>
          <Button variant="text" color="inherit" href="/login">
            Log In
          </Button>
        </Stack>
      </Stack>
    </Box> */}
    <About />
    <Impact />
    <Gallery />
    {/* <CelebrationComponent /> */}
    {/* <Footer /> */}
    {/* <Header /> */}
    <Events/>
    
    <Stats/>
    <Testimonial/>
    </div>
    
  );
};

export default LandHome;