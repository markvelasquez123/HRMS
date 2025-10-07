import React, { useState, useEffect } from "react";

export default function HRMSBanner() {
  const [Company, setCompany] = useState("");

  useEffect(() => {
    const updateCompany = () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const newCompany = userData?.Company || "";  // Remove .toLowerCase()
        setCompany(newCompany);
      } catch (e) {
        setCompany("");
      }
    };

    // Initial load
    updateCompany();

    // binabasa every 1ms ang sessionStorage
    const pollInterval = setInterval(() => {
      updateCompany();
    }, 1);

    // Listen for custom event (for same tab updates)
    const handleCompanyChange = () => {
      updateCompany();
    };

    window.addEventListener('companyChanged', handleCompanyChange);
    window.addEventListener('storage', handleCompanyChange);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('companyChanged', handleCompanyChange);
      window.removeEventListener('storage', handleCompanyChange);
    };
  }, []);

  const companyGradients = {
    "Asia Navis": "from-blue-600 to-blue-300",
    "PeakHR": "from-orange-500 to-blue-500",
    "Rigel": "from-teal-600 to-cyan-400",
  };

  const currentGradient = companyGradients[Company] || companyGradients["Asia Navis"];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${currentGradient} text-white`}>
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
              Efficiently manage and track all your employees in one place. Our HRMS platform makes workforce management simple and effective.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white bg-opacity-10 blur-xl"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-yellow-300 bg-opacity-20 blur-xl"></div>
    </div>
  );
}