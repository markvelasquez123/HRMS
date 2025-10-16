import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { URL } from "../../constant.js";

const MainCards = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [applicantCount, setApplicantCount] = useState(0);
  const [poolCount, setPoolCount] = useState(0);
  const [ofwCount, setOfwCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentOrg, setCurrentOrg] = useState('');

  
  useEffect(() => {
    const checkSessionStorage = () => {
      const userDataString = sessionStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const userCompany = userData.Company;
        
       
        let orgPrefix = '';
        if (userCompany === 'Rigel') {
          orgPrefix = 'RGL';
        } else if (userCompany === 'Asia Navis') {
          orgPrefix = 'ASN';
        } else if (userCompany === 'PeakHR') {
          orgPrefix = 'PHR';
        } else if (userCompany === 'Admin') {
          orgPrefix = 'Admin';
        }
        
      
        if (orgPrefix !== currentOrg) {
          console.log("Organization changed to:", orgPrefix);
          setCurrentOrg(orgPrefix);
        }
      }
    };

    
    checkSessionStorage();

    
    const interval = setInterval(checkSessionStorage, 1);

    return () => clearInterval(interval);
  }, [currentOrg]);

  
  useEffect(() => {
    if (!currentOrg) return;

    const fetchCounts = async () => {
      try {
        setLoading(true);
        
        console.log("Fetching counts for organization:", currentOrg);
        
        // Employee count
        const employeeResponse = await axios.get(
          `http://${URL}/HRMSbackend/test.php?action=get&org=${currentOrg}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        
        
        if (Array.isArray(employeeResponse.data)) {
          setEmployeeCount(employeeResponse.data.length);
          console.log(`Employee count updated: ${employeeResponse.data.length}`);
        } else {
          console.warn("Employee response is not an array:", employeeResponse.data);
          setEmployeeCount(0);
        }

        // Applicant count
        const applicantResponse = await axios.get(
          `http://${URL}/HRMSbackend/get_applicants.php?action=get&org=${currentOrg}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        
   
        if (applicantResponse.data && Array.isArray(applicantResponse.data.summary)) {
          const applicantCount = applicantResponse.data.summary.length;
          setApplicantCount(applicantCount);
          console.log(`Applicant count updated: ${applicantCount}`);
        } else if (applicantResponse.data.error) {
          console.warn("Applicant API error:", applicantResponse.data.error);
          setApplicantCount(0);
        } else {
          console.warn("Unexpected applicant response format:", applicantResponse.data);
          setApplicantCount(0);
        }

        // Pool count
        const poolResponse = await axios.get(
          `http://${URL}/HRMSbackend/get_pool_data.php`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            params: {
              action: 'get',
              org: currentOrg,
            },
            withCredentials: true,
          }
        );


       
        if (poolResponse.data && poolResponse.data.success && Array.isArray(poolResponse.data.data)) {
          const poolCount = poolResponse.data.data.length;
          setPoolCount(poolCount);
          console.log(`Pool count updated: ${poolResponse.data.data.length}`);
        } else if (poolResponse.data && !poolResponse.data.success) {
          console.warn("Pool API error:", poolResponse.data.message);
          setPoolCount(0);
        } else {
          console.warn("Unexpected pool response format:", poolResponse.data);
          setPoolCount(0);
        }

        // OFW count
        const ofwResponse = await axios.get(
          `http://${URL}/HRMSbackend/get_ofw.php`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            params: {
              org: currentOrg,
            },
            withCredentials: true,
          }
        );

      
        if (ofwResponse.data && ofwResponse.data.success && Array.isArray(ofwResponse.data.data)) {
          const ofwCount = ofwResponse.data.data.length;
          setOfwCount(ofwCount);
          console.log(`OFW count updated: ${ofwCount}`);
        } else if (ofwResponse.data && !ofwResponse.data.success) {
          console.warn("OFW API error:", ofwResponse.data.error);
          setOfwCount(0);
        } else {
          console.warn("Unexpected OFW response format:", ofwResponse.data);
          setOfwCount(0);
        }
        
      } catch (error) {
        console.error("Error fetching counts:", error);
        
        setEmployeeCount(0);
        setApplicantCount(0);
        setPoolCount(0);
        setOfwCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [currentOrg]); 

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }
  
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Link to="/EmployeePage" className="no-underline">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:bg-blue-50 cursor-pointer transition h-32">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Employee</h3>
          <span className="text-4xl font-bold text-blue-600">{employeeCount}</span>
        </div>
      </Link>
      <Link to="/ApplicantPage" className="no-underline">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:bg-green-50 cursor-pointer transition h-32">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Applicant</h3>
          <span className="text-4xl font-bold text-green-600">{applicantCount}</span>
        </div>
      </Link>
      <Link to="/Pool" className="no-underline">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:bg-purple-50 cursor-pointer transition h-32">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Pool</h3>
          <span className="text-4xl font-bold text-purple-600">{poolCount}</span>
        </div>
      </Link>
      <Link to="/OverseasEmployees" className="no-underline">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:bg-red-50 cursor-pointer transition h-32">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">OFW</h3>
          <span className="text-4xl font-bold text-red-600">{ofwCount}</span>
        </div>
      </Link>
      <Link to="/Statistics" className="no-underline">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 cursor-pointer transition h-32">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Statistics</h3>
        </div>
      </Link>
      <Link to="/Settings" className="no-underline">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 cursor-pointer transition h-32">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Settings</h3>
        </div>
      </Link>
    </div>
  );
};

export default MainCards;