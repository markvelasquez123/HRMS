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
  
  
  export const employees = [
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

