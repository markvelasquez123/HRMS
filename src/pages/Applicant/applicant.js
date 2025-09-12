import React, { useState, useEffect } from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import ApplicantSidebar from "../../components/applicant/applicantSidebar";

const API_URL = "http://localhost/HRMSbackend/get_applicants.php";

const ApplicantPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleRefresh = () => {
      fetchApplicants();
    };

    const handleApplicantStatusChange = (event) => {
      const { applicantId, status } = event.detail;

      if (status === "Accepted" || status === "Rejected") {
        setApplicants((currentApplicants) =>
          currentApplicants.filter((applicant) => applicant.uid !== applicantId)
        );

        const removedApplicants =
          JSON.parse(localStorage.getItem("removedApplicants")) || [];

        if (!removedApplicants.includes(applicantId)) {
          removedApplicants.push(applicantId);
          localStorage.setItem("removedApplicants", JSON.stringify(removedApplicants));
        }
      }
    };

    window.addEventListener("refreshApplicants", handleRefresh);
    window.addEventListener("applicantStatusChange", handleApplicantStatusChange);

    fetchApplicants();

    return () => {
      window.removeEventListener("refreshApplicants", handleRefresh);
      window.removeEventListener("applicantStatusChange", handleApplicantStatusChange);
    };
  }, []);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (responseData && Array.isArray(responseData.summary)) {
        
        const mergedApplicants = responseData.summary.map((summary, index) => {
          
          const details = responseData.details?.find(detail => 
            (detail.email && detail.email === summary.email) ||
            (detail.firstName === summary.firstName && 
             detail.lastName === summary.lastName)
          ) || {};

          return {
            ...summary,
            ...details,
            uid: summary.email || `applicant_${index}`,
            firstName: summary.firstName || "N/A",
            lastName: summary.lastName || "N/A",
            email: summary.email || "N/A",
            phone: summary.phone || details.phone || "N/A",
            position: summary.position || details.position || "N/A"
          };
        });

        setApplicants(mergedApplicants);
        setError("");
      } else if (responseData.error) {
        setApplicants([]);
        setError(responseData.error);
      } else {
        setApplicants([]);
        setError("Unexpected response format from server.");
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError("Failed to fetch applicants.");
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApplicant = (applicant) => {
    setSelectedApplicant(applicant);
  };

  const renderAvatar = (applicant) => {
    if (applicant?.avatar && applicant.avatar.trim() !== '') {
      const avatarUrl = applicant.avatar.startsWith('http') 
        ? applicant.avatar 
        : `http://localhost/HRMSbackend/${applicant.avatar}`;
      
      return (
        <div className="relative">
          <img 
            src={avatarUrl}
            alt={`${applicant.firstName} ${applicant.lastName}`}
            className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div 
            className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200"
            style={{ display: 'none' }}
          >
            <FaUser className="w-6 h-6 text-gray-500" />
          </div>
        </div>
      );
    }
    
    return (
      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200">
        <FaUser className="w-6 h-6 text-gray-500" />
      </div>
    );
  };

  const filteredApplicants = applicants.filter((applicant) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      applicant.firstName?.toLowerCase().includes(searchLower) ||
      applicant.lastName?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-x-hidden">
      {selectedApplicant && (
        <ApplicantSidebar
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onStatusChange={() => {
            setSelectedApplicant(null);
            fetchApplicants();
          }}
        />
      )}
      <div className="p-6 text-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Applicant</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Name"
                className="border border-gray-300 p-2 pl-10 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 bg-white rounded-xl shadow-lg">
            <p className="text-gray-600">Loading....</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 bg-white rounded-xl shadow-lg">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-6 bg-white rounded-xl shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Picture
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    E-Mail
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Position
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplicants.map((applicant, index) => (
                  <tr 
                    key={`${applicant.uid}_${index}`} 
                    className="hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                    onClick={() => handleSelectApplicant(applicant)}
                    title={`Click to view ${applicant.firstName} ${applicant.lastName}'s details`}
                  >
                    <td className="px-6 py-4">
                      {renderAvatar(applicant)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {applicant.firstName} {applicant.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{applicant.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{applicant.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{applicant.position}</div>
                    </td>
                  </tr>
                ))}
                {filteredApplicants.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">
                      No Applicants Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantPage;