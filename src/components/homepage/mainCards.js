import { useState, useEffect } from "react";
import axios from "axios";

const MainCards = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [applicantCount, setApplicantCount] = useState(0);
  const [poolCount, setPoolCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        
        // Fetch employees from the backend
        const employeeResponse = await axios.get(
          "http://localhost/HRMSbackend/employee.php?action=get",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        // Check if response data is an array and set count
        if (Array.isArray(employeeResponse.data)) {
          setEmployeeCount(employeeResponse.data.length);
          console.log(`Employee count updated: ${employeeResponse.data.length}`);
        } else {
          console.warn("Employee response is not an array:", employeeResponse.data);
          setEmployeeCount(0);
        }

        // Fetch applicants from the same endpoint as ApplicantPage.js
        const applicantResponse = await axios.get(
          "http://localhost/HRMSbackend/get_applicants.php",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        // Handle the same response structure as ApplicantPage.js
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

        // Fetch pool data from the same endpoint as Pool component
        const poolResponse = await axios.get(
          "http://localhost/HRMSbackend/get_pool_data.php",
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        // Handle pool response structure matching the Pool component
        if (poolResponse.data && poolResponse.data.success && Array.isArray(poolResponse.data.data)) {
          const poolCount = poolResponse.data.data.length;
          setPoolCount(poolCount);
          console.log(`Pool count updated: ${poolCount}`);
        } else if (poolResponse.data && !poolResponse.data.success) {
          console.warn("Pool API error:", poolResponse.data.message);
          setPoolCount(0);
        } else {
          console.warn("Unexpected pool response format:", poolResponse.data);
          setPoolCount(0);
        }
        
      } catch (error) {
        console.error("Error fetching counts:", error);
        // Set counts to 0 on error to avoid displaying undefined
        setEmployeeCount(0);
        setApplicantCount(0);
        setPoolCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
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
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Employees</h3>
        <span className="text-4xl font-bold text-blue-600">{employeeCount}</span>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Applicants</h3>
        <span className="text-4xl font-bold text-green-600">{applicantCount}</span>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Pool</h3>
        <span className="text-4xl font-bold text-purple-600">{poolCount}</span>
      </div>
    </div>
  );
};

export default MainCards;