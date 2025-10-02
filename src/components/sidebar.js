import { Link, useLocation, useNavigate } from "react-router-dom";
import "./sidebar.css";
import SubLogo from "../assets/icon-asn.png";
import SubLogoRigel from "../assets/icon-rigel.png";
import SubLogoPeak from "../assets/icon-peak.png";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const Header = ({isHeaderOpen }) => {
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
      subLogo: SubLogo,
    },
    {
      company: "rigel",
      subLogo: SubLogoRigel,
    },
    {
      company: "peak hr",
      subLogo: SubLogoPeak,
    },
  ];

  // pick logo based on logged in company 
  const activeLogo =
    CompanyLogo.find((item) => item.company === company) || CompanyLogo[0];

  return (
    <aside
      className={`fixed top-0 left-0 m-0 ${
        isHeaderOpen ? "" : ""
      } flex flex-col items-center duration-300 w-16 h-screen bg-white shadow-lg`}
    >
      
   
      <div className="my-1 flex items-center justify-center w-full">
        <img
          src={activeLogo.subLogo}
          alt="Logo"
          className="w-8 h-8 mb-2 mt-4 transition-all duration-300 hover:opacity-90"
        />
      </div>

      {/*restriction happen*/}
      {/* {(() => {
        const isAsiaNavis = company === "asia navis";
        const links = [
          { to: "/Homepage", icon: "home", color: "text-blue-600" },
          ...(isAsiaNavis
            ? [{ to: "/EmployeePage", icon: "users", color: "text-green-600" }]
            : []),
          { to: "/ApplicantPage", icon: "user", color: "text-purple-600" },
          { to: "/Pool", icon: "database", color: "text-yellow-600" },
          { to: "/OverseasEmployees", icon: "globe", color: "text-indigo-600" },
          ...(isAsiaNavis
            ? [{ to: "/Statistics", icon: "chart-bar", color: "text-red-600" }]
            : []),
          { to: "/Settings", icon: "cog", color: "text-gray-600" },
        ];

        if (!isAsiaNavis) {
          return (
            <ul className="w-full flex flex-col items-center">
              {links
                .filter((link) => link.to !== "/EmployeePage" && link.to !== "/Statistics")
                .map((item) => (
                  <li key={item.to} className="w-full flex justify-center px-1 py-1">
                    <Link
                      to={item.to}
                      className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 ${
                        location.pathname === item.to
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-50 hover:text-blue-600"
                      }`}
                    >
                      <i
                        className={`fas fa-${item.icon} ${item.color} text-lg transition-transform duration-300`}
                      />
                    </Link>
                  </li>
                ))}
            </ul>
          );
        } else {
          return (
            <ul className="w-full flex flex-col items-center">
              {links.map((item) => (
                <li key={item.to} className="w-full flex justify-center px-1 py-1">
                  <Link
                    to={item.to}
                    className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 ${
                      location.pathname === item.to
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    <i
                      className={`fas fa-${item.icon} ${item.color} text-lg transition-transform duration-300`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          );
        }
      })()} */}

      <div className="mt-auto w-full flex justify-center px-1 py-4">
        <button
          onClick={handleLogout}
          className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 hover:bg-red-50 hover:text-red-600`}
        >
          <i className="fas fa-sign-out-alt text-red-600 text-lg transition-transform duration-300" />
        </button>
      </div>
    </aside>
  );
};

export default Header;