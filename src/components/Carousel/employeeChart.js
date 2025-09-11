import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import photo1 from '../../assets/employee1.jpg';
import photo2 from '../../assets/employee2.jpg';
import photo3 from '../../assets/employee3.jpg';
import photo4 from '../../assets/employee4.jpg';
import photo5 from '../../assets/employee5.jpg';
import photo6 from '../../assets/employee6.jpg';
import photo7 from '../../assets/employee7.jpg';
import photo8 from '../../assets/employee8.jpg';
import photo9 from '../../assets/employee9.jpg';
import photo10 from '../../assets/employee10.jpg';

const OrgChartCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const employees = [
    {
      id: 1,
      name: "Maria Santos",
      position: "Chief Executive Officer",
      age: 45,
      sex: "Female",
      photo: photo1
    },
    {
      id: 2,
      name: "Juan Dela Cruz",
      position: "Chief Technology Officer",
      age: 38,
      sex: "Male",
      photo: photo2
    },
    {
      id: 3,
      name: "Ana Rodriguez",
      position: "HR Director",
      age: 42,
      sex: "Female",
      photo: photo3
    },
    {
      id: 4,
      name: "Carlos Mendoza",
      position: "Finance Manager",
      age: 40,
      sex: "Male",
      photo: photo4
    },
    {
      id: 5,
      name: "Isabel Garcia",
      position: "Marketing Director",
      age: 36,
      sex: "Female",
      photo: photo5
    },
    {
      id: 6,
      name: "Roberto Cruz",
      position: "Operations Manager",
      age: 44,
      sex: "Male",
      photo: photo6
    },
    {
      id: 7,
      name: "Carmen Reyes",
      position: "Sales Director",
      age: 39,
      sex: "Female",
      photo: photo7
    },
    {
      id: 8,
      name: "Miguel Torres",
      position: "IT Manager",
      age: 35,
      sex: "Male",
      photo: photo8
    },
    {
      id: 9,
      name: "Sofia Villanueva",
      position: "Accounting Manager",
      age: 41,
      sex: "Female",
      photo: photo9
    },
    {
      id: 10,
      name: "Pedro Ramos",
      position: "Project Manager",
      age: 37,
      sex: "Male",
      photo: photo10
    },
    {
      id: 11,
      name: "Luz Miranda",
      position: "Quality Manager",
      age: 43,
      sex: "Female",
      photo: photo1
    },
    {
      id: 12,
      name: "Antonio Silva",
      position: "Security Manager",
      age: 46,
      sex: "Male",
      photo: photo2
    },
    {
      id: 13,
      name: "Rosa Morales",
      position: "Training Manager",
      age: 38,
      sex: "Female",
      photo: photo3
    },
    {
      id: 14,
      name: "Francisco Lopez",
      position: "Logistics Manager",
      age: 42,
      sex: "Male",
      photo: photo4
    },
    {
      id: 15,
      name: "Elena Castro",
      position: "Customer Service Manager",
      age: 34,
      sex: "Female",
      photo: photo5
    },
    {
      id: 16,
      name: "Ricardo Fernandez",
      position: "Production Manager",
      age: 45,
      sex: "Male",
      photo: photo6
    },
    {
      id: 17,
      name: "Gloria Herrera",
      position: "Research Manager",
      age: 40,
      sex: "Female",
      photo: photo7
    },
    {
      id: 18,
      name: "Manuel Gutierrez",
      position: "Maintenance Manager",
      age: 48,
      sex: "Male",
      photo: photo8
    },
    {
      id: 19,
      name: "Cristina Jimenez",
      position: "Legal Counsel",
      age: 43,
      sex: "Female",
      photo: photo9
    },
    {
      id: 20,
      name: "Diego Vargas",
      position: "Business Analyst",
      age: 33,
      sex: "Male",
      photo: photo10
    }
  ];

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