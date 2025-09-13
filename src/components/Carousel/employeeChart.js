import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { employees, boldAlert } from './emparray';


const OrgChartCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);



  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = employees.length - 5;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [employees.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = employees.length - 5;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = employees.length - 5;
      return prevIndex <= 0 ? maxIndex : prevIndex - 1;
    });
  };

  const visibleEmployees = employees.slice(currentIndex, currentIndex + 5);

  return (
    <div className="w-full">
      <div className="bg-white shadow-lg px-6 py-8 relative">
        
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50 p-3 rounded-full transition"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50 p-3 rounded-full transition"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-5 gap-6">
            {visibleEmployees.map((employee) => (
              <div key={employee.id} className="flex flex-col items-center">
               
                <div className="mb-3">
                  <img
                    src={employee.photo}
                    alt={employee.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-100"
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-1 line-clamp-2">
                    {employee.name}
                  </h3>
                  <p className="text-xs text-blue-600 mb-2 line-clamp-2">
                    {employee.position}
                  </p>
                  
                  <div className="text-xs text-gray-500">
                    <div>Age: {employee.age}</div>
                    <div>{employee.sex}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(employees.length / 5) }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition ${
                  Math.floor(currentIndex / 5) === i ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-2">
          <span className="text-sm text-gray-500">
            Showing {currentIndex + 1}-{Math.min(currentIndex + 5, employees.length)} of {employees.length} employees
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrgChartCarousel;