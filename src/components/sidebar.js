import { Link, useLocation, useNavigate } from "react-router-dom";
import "./sidebar.css";
import MainLogo from "../assets/Mainlogo.png";
import SubLogo from "../assets/icon-asn.png";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const Header = ({ isHeaderOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <aside className={`fixed top-0 left-0 m-0 sidebar h-screen ${isHeaderOpen ? "w-44" : "w-16"} flex flex-col items-center transition-all duration-300 bg-white shadow-md z-50`}>
      {/* Logo Section */}
      <div className="my-1 flex items-center flex-col">
        <img 
          src={isHeaderOpen ? MainLogo : SubLogo} 
          alt="Logo" 
          className="justify-start items-start w-full h-[2.5rem] mb-2 mt-4 transition-all duration-300 hover:opacity-90" 
        />
      </div>

      {/* Navigation Links */}
      <ul className="w-full flex flex-col">
        {[
          { to: "/Homepage", label: "Home", icon: "home", color: "text-blue-600" },
          { to: "/EmployeePage", label: "Employee", icon: "users", color: "text-green-600" },
          { to: "/ApplicantPage", label: "Applicant", icon: "user", color: "text-purple-600" },
          { to: "/Pool", label: "Pool", icon: "database", color: "text-yellow-600" },
          { to: "/Statistics", label: "Statistics", icon: "chart-bar", color: "text-red-600" },
          { to: "/Settings", label: "Settings", icon: "cog", color: "text-gray-600" },
        ].map((item) => (
          <li key={item.to} className="w-full px-2 py-1">
            <Link
              to={item.to}
              className={`flex items-center w-full p-[0.8rem] rounded-lg transition-all duration-300 ${
                location.pathname === item.to 
                  ? "bg-blue-50 text-blue-600" 
                  : "hover:bg-gray-50 hover:text-blue-600"
              } ${isHeaderOpen ? "justify-start pl-4" : "justify-center"}`}
            >
              <i className={`fas fa-${item.icon} ${item.color} text-lg transition-transform duration-300`} />
              {isHeaderOpen && (
                <span className="ml-2 text-gray-700 font-medium">
                  {item.label}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <div className="mt-auto w-full px-2 py-4">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full p-[0.8rem] rounded-lg transition-all duration-300 hover:bg-red-50 hover:text-red-600 ${
            isHeaderOpen ? "justify-start pl-4" : "justify-center"
          }`}
        >
          <i className="fas fa-sign-out-alt text-red-600 text-lg transition-transform duration-300" />
          {isHeaderOpen && (
            <span className="ml-2 text-gray-700 font-medium">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Header;