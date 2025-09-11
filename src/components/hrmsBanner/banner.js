import React from "react";

export default function HRMSBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
      
      <div className="absolute inset-0 bg-black bg-opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative px-6 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            
            <div className="mb-6">
              <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
                Human Resource Management System
              </h1>
            </div>

            
            <p className="mx-auto max-w-2xl text-lg leading-8 text-blue-100 lg:text-xl">
              Streamline your workforce management with our comprehensive HRMS platform. 
              Manage employees, track performance, and optimize your human capital efficiently.
            </p>
          </div>
        </div>
      </div>

      
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white bg-opacity-10 blur-xl"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-yellow-300 bg-opacity-20 blur-xl"></div>
    </div>
  );
}