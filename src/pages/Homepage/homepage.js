import React from "react";
import MainCards from "../../components/homepage/mainCards";
import OrgChartCarousel from "../../components/Carousel/rules";
import HRMSBanner from "../../components/hrmsBanner/banner";

import Navbar from "../../components/navBar";

const HomePage = () => {
  return(
    <div className="flex flex-col min-h-screen font-sans bg-gray-100">

      
      <HRMSBanner />

      
      <div className="mb-8">
        <OrgChartCarousel />
      </div>

      
      <main className="flex-1 py-4">
        <MainCards />
      </main>
      
    </div>
  );
};

export default HomePage;