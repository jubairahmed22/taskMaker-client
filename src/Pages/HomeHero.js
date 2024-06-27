import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";


const HomeHero = () => {


  return (
    <>
      <div className="h-screen bg-green-900 flex flex-col justify-center items-center">
        <img className="w-96 h-86" src="https://i.ibb.co/KF76Qfd/team-checking-giant-check-list-background.png" alt=""></img>
      <h1 className="text-center text-4xl text-white font-roboto font-extrabold">Task Maker</h1>
      <p className="text-center text-lg text-white font-roboto font-extrabold mt-2">List Application</p>

      <div className="w-[400px] flex flex-row gap-5 mt-10">
      <Link className="w-full py-5 bg-green-300 text-green-900 text-xl font-bold font-roboto flex justify-center items-center" to="/login">Login</Link>
      <Link className="w-full py-5 bg-green-300 text-green-900 text-xl font-bold font-roboto flex justify-center items-center" to="/signup">Sign Up</Link>
      </div>
      </div>
    </>
  );
};

export default HomeHero;
