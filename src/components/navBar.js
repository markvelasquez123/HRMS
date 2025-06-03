import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react"; // Importing the hamburger icon

const Navbar = ({ toggleSidebar }) => {
  const [profilePic, setProfilePic] = useState("https://i.pinimg.com/736x/93/44/ee/9344ee2e15ea931f5ecbe2b70df8b5ab.jpg");

  useEffect(() => {
    // Get profile picture from localStorage
    const savedProfilePic = localStorage.getItem('userProfilePic');
    if (savedProfilePic) {
      setProfilePic(savedProfilePic);
    }

    // Listen for changes in localStorage
    const handleStorageChange = () => {
      const newProfilePic = localStorage.getItem('userProfilePic');
      if (newProfilePic) {
        setProfilePic(newProfilePic);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <nav className="py-1 mb-0 bg-white border-gray-200 dark:bg-gray-900 w-full">
      <div className="w-full flex items-center justify-between px-6 py-2">
        <button onClick={toggleSidebar} className="text-gray-700 dark:text-gray-300">
          <Menu size={28} />
        </button>

        {/* User Avatar */}
        <button
          type="button"
          className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 ml-auto"
          id="user-menu-button"
          aria-expanded="false"
          data-dropdown-toggle="user-dropdown"
          data-dropdown-placement="bottom"
        >
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={profilePic}
            alt="User Avatar"
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
