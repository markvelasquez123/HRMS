import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';



function OrgChartCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rules, setRules] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [employees, setEmployees] = useState([]);

  const getRules = () => {
        fetch("http://localhost/HRMSbackend/rules.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setRules(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const getrulesInterval = () => {
    if (!rules.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = rules.length - 2;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 10000);
    

    return () => clearInterval(interval);

  }

  useEffect(() => {
    getRules();
    getrulesInterval();

  }, [rules.length]);



  if (loading){
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error fetching data: {error.message}</p>
  }

  

  

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = rules.length - 2;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = rules.length - 2;
      return prevIndex <= 0 ? maxIndex : prevIndex - 1;
    });
  };


  return (
    <div className="w-full py-8">
      <div className="bg-gradient-to-br from-blue-600 to-blue-100 shadow-xl px-0 py-10 md:px-0 md:py-14 rounded-none relative w-full">
        <div className="flex items-center mb-8 px-8">
          <h5 className="text-4xl font-extrabold text-white tracking-tight">{rules[currentIndex]?.part}</h5>

        </div>

        <div className="flex justify-center items-center min-h-[180px] w-full">
          <div className="relative w-full max-w-4xl mx-auto">
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow hover:bg-blue-50 p-3 rounded-full transition border border-blue-100"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-blue-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow hover:bg-blue-50 p-3 rounded-full transition border border-blue-100"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-blue-600" />
            </button>

            <div className="mx-24 bg-white rounded-xl shadow-md px-8 py-8 flex flex-col items-center border border-blue-500">
              <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                
                {rules[currentIndex]?.title}
              </h3>
              <h4 className="text-base font-medium text-blue-600 mb-2 text-center">
                {rules[currentIndex]?.description}
              </h4>
              
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {rules.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentIndex === i ? 'bg-blue-600 scale-110' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-500 font-medium">
            Rule {currentIndex + 1} of {rules.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrgChartCarousel;