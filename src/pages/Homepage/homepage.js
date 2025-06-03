import React, { useState } from "react";
import MainCards from "../../components/homepage/mainCards";
import Todos from "../../components/homepage/todo";
import Navbar from "../../components/navBar";

const HomePage = () => {


  return (
    <div className="min-h-screen font-sans bg-gray-100 flex flex-col px-6 sm:px-4">

      <div className="w-full ">
     
        <h2 className="text-2xl font-bold pt-8 pb-4 text-gray-700">Dashboard</h2>
      </div>
      <MainCards/>
      <Todos/>
    </div>
  );
};

export default HomePage;
