import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import ApplicantSidebar from "../../components/applicant/applicantSidebar";
import importExcel from "../../components/Excelimport/importExcel"; 
import PositionDropdown from "../../components/applicant/PositionDropdown";
import AddApplicant from "../../components/applicant/AddApplicantForm"
const API_URL = "http://localhost/HRMSbackend/get_applicants.php";

const ApplicantPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removedApplicants, setRemovedApplicants] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [applicantsPerPage] = useState(15);
 
  const [selectedPosition, setSelectedPosition] = useState("");

  const hasFetchedRef = useRef(false); 
  const isFetchingRef = useRef(false); 

  const fetchApplicants = async () => {
  if (isFetchingRef.current) {
    console.log("Already fetching, skipping...");
    return;
  }
  
  try {
    isFetchingRef.current = true;
    setLoading(true);
    console.log("Fetching applicants...");
    
    // Get userData from sessionStorage
    const userDataString = sessionStorage.getItem('userData');
    
    if (!userDataString) {
      setError("User data not found. Please log in again.");
      setApplicants([]);
      setLoading(false);
      isFetchingRef.current = false;
      return;
    }

    // Parse userData JSON
    const userData = JSON.parse(userDataString);
    const userCompany = userData.Company; // Get Company field
    
    if (!userCompany) {
      setError("User company not found. Please log in again.");
      setApplicants([]);
      setLoading(false);
      isFetchingRef.current = false;
      return;
    }

    // Map company name to prefix
    let orgPrefix = '';
    if (userCompany === 'Rigel') {
      orgPrefix = 'RGL';
    } else if (userCompany === 'Asia Navis') {
      orgPrefix = 'ASN';
    } else if (userCompany === 'PeakHR') {
      orgPrefix = 'PHR';
    } else {
      setError(`Unknown company: ${userCompany}`);
      setApplicants([]);
      setLoading(false);
      isFetchingRef.current = false;
      return;
    }

    console.log("User Company:", userCompany, "Prefix:", orgPrefix);
    
    // Send the prefix to backend
    const response = await fetch(`${API_URL}?org=${orgPrefix}`, {
      method: 'GET',
      headers: { "Content-Type": "application/json" },
      credentials: 'include'
    });

    if (response.status === 401) {
      setError("Please log in to view applicants.");
      setApplicants([]);
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Received data:", responseData);
    
    if (responseData && Array.isArray(responseData.summary)) {
      const mergedApplicants = responseData.summary.map((summary, index) => {
        const details = responseData.details?.find(detail => 
          (detail.EmailAddress && detail.EmailAddress === summary.EmailAddress) ||
          (detail.FirstName === summary.FirstName && detail.LastName === summary.LastName)
        ) || {};
        return {
          ...summary,
          ...details,
          
          uid: summary.appID || `applicant_${index}`, 
          firstName: summary.FirstName || "N/A",
          lastName: summary.LastName || "N/A",
          email: summary.EmailAddress || "N/A",
          phone: summary.ContactNumber || details.ContactNumber || "N/A",
          position: summary.PositionApplied || details.PositionApplied || "N/A"
        };
      });
      
      console.log("Setting applicants, count:", mergedApplicants.length);
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
    isFetchingRef.current = false;
  }
};

  useEffect(() => {
    if (!hasFetchedRef.current) {
      console.log("Initial mount - fetching data");
      hasFetchedRef.current = true;
      fetchApplicants();
    }
    return () => {
      console.log("Component unmounting or re-rendering");
    };
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      console.log("Refresh event triggered");
      fetchApplicants();
    };

    const handleApplicantStatusChange = (event) => {
      console.log("Status change event:", event.detail);
      const { applicantId, status } = event.detail;
      if (status === "Accepted" || status === "Rejected") {
        setApplicants((currentApplicants) => {
          const filtered = currentApplicants.filter((applicant) => applicant.uid !== applicantId);
          console.log("Filtered applicants, count:", filtered.length);
          return filtered;
        });
        
        setRemovedApplicants((prev) => {
          if (!prev.includes(applicantId)) {
            return [...prev, applicantId];
          }
          return prev;
        });
      }
    };

    window.addEventListener("refreshApplicants", handleRefresh);
    window.addEventListener("applicantStatusChange", handleApplicantStatusChange);

    return () => {
      window.removeEventListener("refreshApplicants", handleRefresh);
      window.removeEventListener("applicantStatusChange", handleApplicantStatusChange);
    };
  }, []);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedPosition]);

  const handleSelectApplicant = (applicant) => {
    setSelectedApplicant(applicant);
  };

  const renderAvatar = (applicant) => {
    const hasError = imageErrors[applicant.uid];
    
    if (applicant?.ProfilePicture && applicant.ProfilePicture.trim() !== '' && !hasError) {
      const avatarUrl = applicant.ProfilePicture.startsWith('http') 
        ? applicant.ProfilePicture 
        : `http://localhost/HRMSbackend/${applicant.ProfilePicture}`;
      return (
        <div className="relative">
          <img 
            src={avatarUrl}
            alt={`${applicant.firstName} ${applicant.lastName}`}
            className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
            onError={() => {
              setImageErrors(prev => ({ ...prev, [applicant.uid]: true }));
            }}
          />
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
    const matchesSearch = (
      applicant.firstName?.toLowerCase().includes(searchLower) ||
      applicant.lastName?.toLowerCase().includes(searchLower)
    );
    const matchesPosition = selectedPosition === "" || applicant.position === selectedPosition;
    
    return matchesSearch && matchesPosition;
  });
  
  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant);
  const totalPages = Math.ceil(filteredApplicants.length / applicantsPerPage);

  const handleExport = () => {
    importExcel(filteredApplicants, 'Applicants');
  };

  console.log("Render - Total applicants:", applicants.length, "Current page:", currentPage, "Showing:", currentApplicants.length);

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
      {showAddForm && (
        <AddApplicant
          onClose={() => setShowAddForm(false)} 
        />
      )}
      <div className="p-6 text-gray-800">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-semibold text-gray-800">
            Applicant
          </h2>
          <div className="flex items-center gap-4">
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              onClick={handleExport}>
              Export Excel File
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Name"
                className="border border-gray-300 p-2 pl-10 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <PositionDropdown onPositionChange={setSelectedPosition} />
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              onClick={() => setShowAddForm(true)}>
                Add Applicant
            </button>
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Picture</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">E-Mail</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Position</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentApplicants.length > 0 ? (
                  currentApplicants.map((applicant) => (
                    <tr 
                      key={applicant.uid} 
                      className="hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => handleSelectApplicant(applicant)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{renderAvatar(applicant)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{applicant.uid.slice(0, 8)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{applicant.firstName} {applicant.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.position}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No applicants found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

         {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {(() => {
                const maxVisiblePages = 5;
                const halfVisible = Math.floor(maxVisiblePages / 2);
                let startPage = Math.max(currentPage - halfVisible, 1);
                let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
                
                if (endPage - startPage < maxVisiblePages - 1) {
                  startPage = Math.max(endPage - maxVisiblePages + 1, 1);
                }
                
                const pages = [];
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i);
                }
                
                return pages.map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      pageNumber === currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ));
              })()}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantPage;