import { Link, useLocation, useNavigate } from "react-router-dom";
import "./sidebar.css";
import logoAsia from "../assets/Mainlogo.png";
import SubLogo from "../assets/icon-asn.png";
import logoRigel from "../assets/Rigellogo.png";
import SubLogoRigel from "../assets/icon-rigel.png";
import logoPeak from "../assets/Peaklogo.png";
import SubLogoPeak from "../assets/icon-peak.png";
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

  // get data in sessionStorage
  let company = "";
  try {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    company = userData?.company?.toLowerCase() || "";
  } catch (e) {
    company = "";
  }

  // list of logos 
  const CompanyLogo = [
    {
      company: "asia navis",
      logo: logoAsia,
      subLogo: SubLogo,
    },
    {
      company: "rigel",
      logo: logoRigel,
      subLogo: SubLogoRigel,
    },
    {
      company: "peak hr",
      logo: logoPeak,
      subLogo: SubLogoPeak, 
    },
  ];

  // pick logo based on logged in company 
  const activeLogo =
    CompanyLogo.find((item) => item.company === company) || CompanyLogo[0];

  return (
    <aside
      className={`fixed top-0 left-0 m-0 sidebar h-screen ${
        isHeaderOpen ? "w-44" : "w-16"
      } flex flex-col items-center transition-all duration-300 bg-white shadow-md z-50`}
    >
      
      <div className="my-1 flex items-center flex-col">
        <img
          src={isHeaderOpen ? activeLogo.logo : activeLogo.subLogo}
          alt="Logo"
          className="justify-start items-start w-full h-[2.5rem] mb-2 mt-4 transition-all duration-300 hover:opacity-90"
        />
      </div>

      {/*restriction happen*/}
      {(() => {
        const isAsiaNavis = company === "asia navis";
        const links = [
  { to: "/Homepage", label: "Home", icon: "home", color: "text-blue-600" },
  ...(isAsiaNavis
    ? [{ to: "/EmployeePage", label: "Employee", icon: "users", color: "text-green-600" }]
    : []),
  { to: "/ApplicantPage", label: "Applicant", icon: "user", color: "text-purple-600" },
  { to: "/Pool", label: "Pool", icon: "database", color: "text-yellow-600" },
  { to: "/OverseasEmployees", label: "OFWs", icon: "globe", color: "text-indigo-600" },
  ...(isAsiaNavis
    ? [{ to: "/Statistics", label: "Statistics", icon: "chart-bar", color: "text-red-600" }]
    : []),
  { to: "/Settings", label: "Settings", icon: "cog", color: "text-gray-600" },
  
];


        if (!isAsiaNavis) {
          return (
            <ul className="w-full flex flex-col">
              {links
                .filter((link) => link.to !== "/EmployeePage" && link.to !== "/Statistics")
                .map((item) => (
                  <li key={item.to} className="w-full px-2 py-1">
                    <Link
                      to={item.to}
                      className={`flex items-center w-full p-[0.8rem] rounded-lg transition-all duration-300 ${
                        location.pathname === item.to
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-50 hover:text-blue-600"
                      } ${isHeaderOpen ? "justify-start pl-4" : "justify-center"}`}
                    >
                      <i
                        className={`fas fa-${item.icon} ${item.color} text-lg transition-transform duration-300`}
                      />
                      {isHeaderOpen && (
                        <span className="ml-2 text-gray-700 font-medium">{item.label}</span>
                      )}
                    </Link>
                  </li>
                ))}
            </ul>
          );
        } else {
          return (
            <ul className="w-full flex flex-col">
              {links.map((item) => (
                <li key={item.to} className="w-full px-2 py-1">
                  <Link
                    to={item.to}
                    className={`flex items-center w-full p-[0.8rem] rounded-lg transition-all duration-300 ${
                      location.pathname === item.to
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-50 hover:text-blue-600"
                    } ${isHeaderOpen ? "justify-start pl-4" : "justify-center"}`}
                  >
                    <i
                      className={`fas fa-${item.icon} ${item.color} text-lg transition-transform duration-300`}
                    />
                    {isHeaderOpen && (
                      <span className="ml-2 text-gray-700 font-medium">{item.label}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          );
        }
      })()}

      <div className="mt-auto w-full px-2 py-4">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full p-[0.8rem] rounded-lg transition-all duration-300 hover:bg-red-50 hover:text-red-600 ${
            isHeaderOpen ? "justify-start pl-4" : "justify-center"
          }`}
        >
          <i className="fas fa-sign-out-alt text-red-600 text-lg transition-transform duration-300" />
          {isHeaderOpen && <span className="ml-2 text-gray-700 font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Header;
