
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Card,
  CardBody,
  Typography,
  CardHeader,
  Avatar,
} from "@material-tailwind/react";

// Testimonial Card Component
function TestimonialCard({ img, client, title, clientInfo, clientImage }) {
  return (
    <Card
      shadow={false}
      className="bg-gray-50 rounded-2xl p-6 py-6 w-[95%] h-[30vh] lg:h-[30vh] flex flex-col justify-between"
    >
      <CardHeader color="transparent" floated={false} shadow={false} className="flex items-center">
        <Typography color="blue-gray" className="lg:mb-20 mb-4 text-base lg:text-base my-auto text-justify" variant="paragraph">
          &quot;{title}&quot;
        </Typography>
      </CardHeader>
      <CardBody className="px-2 lg:px-4 py-0 flex flex-wrap gap-x-6 justify-between">
        <div>
          <div className="flex flex-wrap gap-3">
            <Avatar src={clientImage} className="h-12 w-12 rounded-full" />
            <div>
              <Typography variant="h6" color="blue-gray" className="!text-[#fe6019]">
                {client}
              </Typography>

              <Typography variant="paragraph" className="font-normal !text-gray-500">
                {clientInfo}
              </Typography>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// Testimonials Data
const testimonials = [
  {
    title:
      "An outstanding experience working with this team. Their innovative approach and commitment to excellence are truly remarkable.",
    client: "Rajat Mehta",
    clientInfo: "CEO, TechVision Pvt. Ltd.",
    img: "https://sviet.ac.in/wp-content/uploads/2020/07/Tata.jpg",
    clientImage: "https://bmnmsbiymz.ufs.sh/f/1V3V2P4kpAumcie7BiH8VXEy6oP2FKNmz4aCbwtxqpB9gkJD",
  },
  {
    title:
      "Their expertise and innovative mindset make them a valuable partner in the industry. Highly recommended for groundbreaking solutions.",
    client: "Neha Sharma",
    clientInfo: "VP, FutureTech Innovations",
    img: "https://sviet.ac.in/wp-content/uploads/2022/01/info.png",
    clientImage: "https://bmnmsbiymz.ufs.sh/f/1V3V2P4kpAumcie7BiH8VXEy6oP2FKNmz4aCbwtxqpB9gkJD",
  },
  {
    title:
      "Their commitment to delivering cutting-edge solutions and professionalism is unparalleled. An excellent choice for innovation-driven projects.",
    client: "Amit Verma",
    clientInfo: "Founder, StartX Solutions",
    img: "https://sviet.ac.in/wp-content/uploads/2020/07/First-Lady.jpg",
    clientImage: "https://bmnmsbiymz.ufs.sh/f/1V3V2P4kpAumcie7BiH8VXEy6oP2FKNmz4aCbwtxqpB9gkJD",
  },
  {
    title:
      "A dedicated team that consistently delivers high-quality results. Their innovative solutions have significantly impacted our business growth.",
    client: "Pooja Singh",
    clientInfo: "Director, Digital Ventures",
    img: "https://sviet.ac.in/wp-content/uploads/2022/01/uu.png",
    clientImage: "https://bmnmsbiymz.ufs.sh/f/1V3V2P4kpAumcie7BiH8VXEy6oP2FKNmz4aCbwtxqpB9gkJD",
  },
];

// Testimonial Section with Carousel
export function Testimonial() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 720,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          vertical: false,
          verticalSwiping: false,
        },
      },
    ],
  };

  return (
    <section className="w-full py-8 lg:py-10">
      {/* Section Title */}
      <div className="container w-11/12 mx-auto">
        <div className="mx-auto flex flex-col align-middle justify-start">
          <div className="flex mb-5 items-center">
            <span className="border-l-2 border-[#fe6019] h-6 mr-3"></span>
            <h1 className="text-sm md:text-lg font-bold capitalize">
              Reviews by Companies
            </h1>
          </div>
          <h1 className="text-2xl md:text-4xl font-semibold max-w-5xl">
            What Industry Leaders Say About Us
            <span className="text-[#fe6019] text-2xl md:text-5xl md:py-2 block mb-5">
              Innovation, Excellence & Impact
            </span>
          </h1>
        </div>




        {/* Testimonials */}
        <Slider {...settings} className="py-8">
          {testimonials.map((props, key) => (
            <TestimonialCard key={key} {...props} />
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default Testimonial;
