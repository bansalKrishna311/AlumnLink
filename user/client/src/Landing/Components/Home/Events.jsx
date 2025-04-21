import { useState } from "react";

function Events() {
  // Default to step 2 (Copy The Snippet) if desired
  const [activeStep, setActiveStep] = useState(2);

  return (
    <section className="relative w-full overflow-hidden z-[1] px-4 py-12 md:py-[70px]">
      <div className="container w-11/12 mx-auto relative">
        <div className="grid grid-cols-12 relative">
          <div className=" mx-auto flex flex-col align-middle justify-start">
            <div className="flex mb-5 items-center">
              <span className="border-l-2 border-[#fe6019] h-6 mr-3"></span>
              <h1 className="text-sm md:text-lg font-bold capitalize">
                Our Innovative Events
              </h1>
            </div>
            <h1 className="w-[100vw] text-2xl md:text-4xl font-semibold">
              Pioneering the Future with
              <span className="text-[#fe6019] text-2xl md:text-5xl md:py-2 block mb-5">
                Disruptive Ideas & Technology
              </span>
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-12 mt-20">
          <div className="col-span-12 lg:col-span-5">
            <ul className="relative z-[1] sm:pl-[125px] sm:before:contents-[''] sm:before:absolute sm:before:-z-[1] before:bg-gradient-to-b before:from-[rgba(0,0,0,0.19)] dark:before:from-gray-500 before:to-80% before:to-transparent dark:before:to-transparent before:left-0 before:-top-[8px] before:w-[77px] before:h-full before:rounded-full">
              <li
                className={`relative cursor-pointer ${activeStep === 1 ? "opacity-100" : "opacity-50"
                  }`}
                onMouseEnter={() => setActiveStep(1)}
                onClick={() => setActiveStep(1)}
                onTouchStart={() => setActiveStep(1)}
              >
                <span className="hidden sm:flex justify-center items-center absolute w-[60px] h-[60px] -left-[117px] top-0 bg-black rounded-full text-[20px] text-white font-display shadow-[3px_0_0_#fe6019]">
                  <span>01</span>
                </span>
                <h4
                  className="display-xs-medium md:display-s-medium font-display wow fadeInUp font-bold"
                  data-wow-delay=".1s"
                  style={{
                    visibility: "visible",
                    animationDelay: "0.1s",
                    animationName: "fadeInUp",
                  }}
                >
                  Godigitify Nexus
                </h4>
                <p
                  className="text-sm-regular  mt-3 wow fadeInUp"
                  data-wow-delay=".2s"
                  style={{
                    visibility: "visible",
                    animationDelay: "0.2s",
                    animationName: "fadeInUp",
                  }}
                >
                  Explore the advancements in AI, its impact across industries,
                  and what the future holds for artificial intelligence.
                </p>
              </li>
              <li
                className={`relative cursor-pointer mt-12 ${activeStep === 2 ? "opacity-100" : "opacity-50"
                  }`}
                onMouseEnter={() => setActiveStep(2)}
                onClick={() => setActiveStep(2)}
                onTouchStart={() => setActiveStep(2)}
              >
                <span className="hidden sm:flex justify-center items-center absolute w-[60px] h-[60px] -left-[117px] top-0 bg-black rounded-full text-[20px] text-white font-display shadow-[3px_0_0_#fe6019]">
                  <span>02</span>
                </span>
                <h4
                  className="display-xs-medium md:display-s-medium font-display wow fadeInUp font-bold"
                  data-wow-delay=".1s"
                  style={{
                    visibility: "visible",
                    animationDelay: "0.1s",
                    animationName: "fadeInUp",
                  }}
                >
                  Techlearns Academy
                </h4>
                <p
                  className="text-sm-regular 0 mt-3 wow fadeInUp"
                  data-wow-delay=".2s"
                  style={{
                    visibility: "visible",
                    animationDelay: "0.2s",
                    animationName: "fadeInUp",
                  }}
                >
                  Learn from industry experts how AI and ML are transforming
                  healthcare, finance, education, and more.
                </p>
              </li>
              <li
                className={`relative cursor-pointer mt-12 ${activeStep === 3 ? "opacity-100" : "opacity-50"
                  }`}
                onMouseEnter={() => setActiveStep(3)}
                onClick={() => setActiveStep(3)}
                onTouchStart={() => setActiveStep(3)}
              >
                <span className="hidden sm:flex justify-center items-center absolute w-[60px] h-[60px] -left-[117px] top-0 bg-black rounded-full text-[20px] text-white font-display shadow-[3px_0_0_#fe6019]">
                  <span>03</span>
                </span>
                <h4
                  className="display-xs-medium md:display-s-medium font-display wow fadeInUp font-bold"
                  data-wow-delay=".1s"
                  style={{
                    visibility: "visible",
                    animationDelay: "0.1s",
                    animationName: "fadeInUp",
                  }}
                >
                  Wirely
                </h4>
                <p
                  className="text-sm-regular  mt-3 wow fadeInUp"
                  data-wow-delay=".2s"
                  style={{
                    visibility: "visible",
                    animationDelay: "0.2s",
                    animationName: "fadeInUp",
                  }}
                >
                  A discussion on the ethical concerns surrounding AI, data
                  privacy, and responsible innovation in AI/ML.
                </p>
              </li>
            </ul>
          </div>
          <div className="col-span-12 lg:col-start-8 lg:col-span-5 flex items-center relative mt-8 lg:mt-0">
            <div className="relative w-full h-full">
              {activeStep === 1 && (
                <iframe
                  src="https://www.godigitify.com/"

                  title="Find The Perfect Component"
                  className="w-full h-[315px] rounded-lg shadow-3xl"
                ></iframe>
              )}
              {activeStep === 2 && (
                <iframe
                  src="https://techlearns.in/"

                  title="Copy The Snippet"
                  className="w-full h-[315px] rounded-lg shadow-3xl"
                ></iframe>
              )}
              {activeStep === 3 && (
                <iframe
                  src="https://img.freepik.com/free-vector/abstract-coming-soon-new-arrival-background-with-splatter-effect_1017-54591.jpg?t=st=1743371449~exp=1743375049~hmac=16cb316dc6831d63ec18fbf3c259c8f415f6c9c88952fbb5ccd4ea9f1cd4eb83&w=370&auto=format"
                  title="Make It Yours"
                  className="w-full h-[315px] rounded-lg shadow-3xl"
                ></iframe>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Events;
