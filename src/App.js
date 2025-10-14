import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import ScrollToTop from "./common/scrollToTop";
import Header from "./components/sidebar";
import Homepage from "./pages/Homepage/homepage";
import EmployeePage from "./pages/Employee/employee";
import LoginPage from "./pages/log_in/login";
import { ToastContainer } from "react-toastify";
import ApplicantPage from "./pages/Applicant/applicant";
import Pool from "./pages/pool/pool";
import Settings from "./pages/settings/settings";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navBar";
import Statistics from "./pages/stats/stats";
import OverseasEmployees from "./pages/Employee/OverseasEmployees";

function Layout({ onUpdatePool, poolData }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isLoginPage = location.pathname === "/";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (Hidden on Login Page) */}
      {!isLoginPage && (
        <div
          className={`sidebar ${isSidebarOpen ? "w-2" : "w-2"}  duration-300`}
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)}
        >
          <Header isHeaderOpen={isSidebarOpen} />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1  duration-300 ${
          isLoginPage ? "" : isSidebarOpen ? "ml-16" : "ml-16"
        }`}
      >
        {/* Navbar (Only Show When Logged In) */}
        {!isLoginPage && (
          <Navbar toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
        )}

        <Routes>
          <Route path="/Homepage" element={<Homepage />} />
          <Route path="/EmployeePage" element={<EmployeePage />} />
          <Route path="/ApplicantPage" element={<ApplicantPage onUpdatePool={onUpdatePool} />} />
          <Route path="/Pool" element={<Pool poolData={poolData} />} />
          <Route path="/OverseasEmployees" element={<OverseasEmployees />} />
          <Route path="/Statistics" element={<Statistics />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>

        <ToastContainer />
      </div>
    </div>
  );
}

function App() {
  const [poolData, setPoolData] = useState([]);

  const updatePool = (applicant) => {
    setPoolData((prev) => [...prev, applicant]);
  };

  return (
    <Router>
      <ScrollToTop />
      <Layout onUpdatePool={updatePool} poolData={poolData} />
    </Router>
  );
}

export const URL = '192.168.0.217';

export default App;
