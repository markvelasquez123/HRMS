import React from "react";
import MainCards from "../../components/homepage/mainCards";
import Logo from "../../assets/Mainlogo.png";
import Navbar from "../../components/navBar";


const HomePage = () => {
  return(
    <div className="flex flex-col min-h-screen font-sans bg-gray-100">

      

      <main className="flex-1 px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto">
          
          
          
          
          <MainCards />
        </div>
      </main>
      
      
    </div>
  );
};

export default HomePage;
