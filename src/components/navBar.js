import React, { useState, useEffect } from "react";
import { X, User, Phone, Mail, MapPin, Cake, Briefcase, Building, FileText, DollarSign } from "lucide-react";
import Logo1 from "../assets/Mainlogo.png";
import Logo3 from "../assets/Peaklogo.png";
import Logo2 from "../assets/Rigellogo.png";
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const [profilePic, setProfilePic] = useState("https://i.pinimg.com/736x/93/44/ee/9344ee2e15ea931f5ecbe2b70df8b5ab.jpg");
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [Company, setCompany] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const updateCompany = () => {
  try {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const newCompany = userData?.Company || ""; 
    setCompany(newCompany);
  } catch (e) {
    setCompany("");
  }
};

    updateCompany();
    const pollInterval = setInterval(() => {
      updateCompany();
    }, 1);

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

  const CompanyLogo = [
    { company: "Asia Navis", Logo: Logo1 },
    { company: "Rigel", Logo: Logo2 },
    { company: "PeakHR", Logo: Logo3 }
  ];
  
  const activeLogo = CompanyLogo.find((item) => item.company === Company) || CompanyLogo[0];

  const fetchUser = async () => {
    const EmailAddress = sessionStorage.getItem('userEmail');

    if (!EmailAddress) {
      console.error("No user email found in sessionStorage.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost/HRMSbackend/test3.php", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });

      const data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        const user = data.find(emp => emp.EmailAddress === EmailAddress);
        
        if (user) {
          setUserData(user);
          sessionStorage.setItem('userData', JSON.stringify(user));
          
          if (user.ProfilePicture) {
            setProfilePic(`http://localhost/HRMSbackend/uploads/${user.ProfilePicture}`);
          }
        } else {
          console.warn("No user found with email:", EmailAddress);
        }
      } else {
        console.warn("No employee data returned");
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const getAvatarDisplay = () => {
    if (userData?.ProfilePicture) {
      return <img src={`http://localhost/HRMSbackend/uploads/${userData.ProfilePicture}`} alt={`${userData.FirstName} ${userData.LastName}`} className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100 mx-auto" />;
    }
    return (
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center ring-4 ring-gray-100 mx-auto">
        <User className="w-8 h-8 text-blue-600" />
      </div>
    );
  };

  return (
    <>
      <nav className="py-1 mb-0 bg-white border-gray-200 dark:bg-gray-900 w-full">
        <div className="w-full flex items-center justify-between px-6 py-2">
          <button onClick={toggleSidebar} className="text-gray-700 dark:text-gray-300"></button>
          <header className="bg-white">
            <div className="max-w-7xl mx-auto py-4 px-6">
              <Link to="/Homepage">
                <img src={activeLogo.Logo} alt="Logo" className="h-12" />
              </Link>
            </div>
          </header>
          
          <button
            type="button"
            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 ml-4"
            onClick={handleAvatarClick}
          >
            <img className="w-12 h-12 rounded-full object-cover" src={profilePic} alt="User Avatar" />
          </button>
        </div>
      </nav>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full md:w-[400px] h-full shadow-2xl transform transition-transform duration-300 translate-x-0">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
              <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto h-full pb-20">
              <div className="p-6 space-y-6">
                <div className="text-center">
                  {getAvatarDisplay()}
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold text-gray-900">{userData.FirstName} {userData.LastName}</h3>
                    <p className="text-sm text-blue-600 font-medium mt-1">{userData.PositionApplied}</p>
                    <p className="text-sm text-gray-500">{userData.Department}</p>
                    <div className="inline-block px-3 py-1 mt-3 rounded-full border bg-green-50 text-green-700 border-green-200 text-sm font-medium">Active</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Mail className="w-4 h-4 text-gray-600 mr-2" />
                    Contact Information
                  </h4>
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-900">{userData.EmailAddress}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-900">{userData.ContactNumber}</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <MapPin className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-900 leading-relaxed">{userData.HomeAddress}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Cake className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium text-blue-900">Birth Date</span>
                    </div>
                    <span className="text-sm text-blue-800 ml-6">{userData.Birthdate}</span>
                  </div>
                  {userData.Gender && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <User className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium text-purple-900">Gender</span>
                      </div>
                      <span className="text-sm text-purple-800 ml-6">{userData.Gender}</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Briefcase className="w-4 h-4 text-gray-600 mr-2 flex-shrink-0" />
                    Employment Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">Employee ID</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{userData.IDNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Building className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">Company</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{userData.Company}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Building className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">Type</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{userData.EmployeeType}</span>
                    </div>
                    {userData.Salary && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <DollarSign className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">Salary</span>
                        </div>
                        <span className="text-sm font-medium text-green-600">₱{userData.Salary}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Cake className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">Hire Date</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{userData.DateHired}</span>
                    </div>
                  </div>
                </div>
                
                {userData.Passport && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText className="w-4 h-4 text-gray-600 mr-2 flex-shrink-0" />
                      Documents
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <a href={`http://localhost/HRMSbackend/uploads/${userData.Passport}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors">
                        <FileText className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span>View Passport</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>  
        </div>
      )}
      <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-40 ${showModal ? "block" : "hidden"}`} onClick={handleClose}></div>
    </>
  );
};

export default Navbar;