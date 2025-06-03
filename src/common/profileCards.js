import { useState } from "react";

const ProfileCard = ({ name, fname, status, position, department, image, dateHired, birthDate, onClick }) => {
  return (
    <div
      className="relative bg-[#b1d2f3]  shadow-md rounded-lg p-6 w-64 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
      onClick={onClick}
    >
      <div className="relative w-24 h-24 mx-auto">
        <img
          src={image}
          alt={name}
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
        />
      </div>
      <h2 className="mt-4 text-lg font-bold text-gray-900">{name}</h2>
      <p className="text-gray-600 text-sm">{position}</p>
    </div>
  );
};

const ProfileCards = ({ searchQuery, selectedDepartment }) => {
  const [selectedPerson, setSelectedPerson] = useState(null);

  const team = [
    {
      name: "John Doe",
      fname: "John Robert Doe",
      position: "Software Engineer",
      image: "https://tse2.mm.bing.net/th?id=OIP.KYD7SuQWxmDjywtcaeAr4gAAAA&pid=Api&P=0&h=180",
      status: "Single",
      department: "IT Department",
      dateHired: "June 02, 2019",
      birthDate: "March 7, 2001"
    },
    {
      name: "Jane Smith",
      fname: "Jane Cole Smith",
      position: "Product Manager",
      image: "https://tse4.mm.bing.net/th?id=OIP.5qk-71ZqxrCAjnTOdl36uwAAAA&pid=Api&P=0&h=180",
      status: "Married",
      department: "Product Management",
      dateHired: "August 15, 2020",
      birthDate: "June 6, 1999",
    },
    {
      name: "Mike Johnson",
      fname: "Mike Swift Johnson",
      position: "UI/UX Designer",
      image: "https://tse1.mm.bing.net/th?id=OIP.xxxxxxxx&pid=Api&P=0&h=180",
      status: "Single",
      department: "Design",
      dateHired: "March 10, 2021",
      birthDate: "Feb 17, 1994",
    },
    {
      name: "Sarah Williams",
      fname: "Sarah Geronimo Williams",
      position: "Marketing Specialist",
      image: "https://tse3.mm.bing.net/th?id=OIP.xxxxxxxx&pid=Api&P=0&h=180",
      status: "Engaged",
      department: "Marketing",
      dateHired: "November 5, 2018",
      birthDate: "April 21, 1981",
    },
  ];

  // Filtering logic (only searches by name now)
  const filteredTeam = team.filter(person => {
    const matchesSearch = searchQuery
      ? person.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesDepartment = selectedDepartment
      ? person.department === selectedDepartment
      : true;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="flex flex-wrap justify-center gap-8 p-6">
      {filteredTeam.map((person, index) => (
        <ProfileCard key={index} {...person} onClick={() => setSelectedPerson(person)} />
      ))}

      {/* Modal for showing employee details */}
      {selectedPerson && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-96 relative">
            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-black"
              onClick={() => setSelectedPerson(null)}
            >
              ✕
            </button>
            <img
              src={selectedPerson.image}
              alt={selectedPerson.name}
              className="w-24 h-24 mx-auto rounded-full border-4 border-gray-300"
            />
            <h3 className="text-2xl font-semibold mt-4">{selectedPerson.name}</h3>
            <p className="text-gray-600 font-semibold">Fullname: {selectedPerson.fname}</p>

            <p className="text-lg text-gray-600">{selectedPerson.position}</p>
            <p className="text-gray-600">Status: {selectedPerson.status}</p>
            <p className="text-gray-600">Department: {selectedPerson.department}</p>
            <p className="text-gray-600">Date Hired: {selectedPerson.dateHired}</p>
            <p className="text-gray-600">Birth Date: {selectedPerson.birthDate}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCards;
  