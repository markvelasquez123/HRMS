import React, { useState, useEffect } from "react";
import { X, Check, ChevronDown, FileText, User, Phone, Mail, MapPin, Cake, Briefcase, Building } from "lucide-react";

const ApplicantSidebar = ({ applicant: initialApplicant, onClose, onStatusChange }) => {
  const [visible, setVisible] = useState(false);
  const [applicant, setApplicant] = useState(initialApplicant);
  const [status, setStatus] = useState("Pending");
  const [employeeType, setEmployeeType] = useState("");
  const [department, setDepartment] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [departmentDropdownVisible, setDepartmentDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialApplicant) return;

    // If the initial applicant already has detailed data, use that
    if (initialApplicant.detailedData || 
        (initialApplicant.street1 && initialApplicant.city)) {
      setApplicant(initialApplicant);
      return;
    }

    const fetchApplicantDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost/QMS-ASIANAVIS/HRMSBACKEND/HRMSbackend/get_applicants.php', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        
        // Try to find matching applicant in details
        const foundApplicant = data.details?.find(detail => {
          // Match by email if available
          if (initialApplicant.email && detail.email) {
            return detail.email.toLowerCase() === initialApplicant.email.toLowerCase();
          }
          // Fall back to name and position match
          return (
            detail.firstName && detail.lastName && detail.position &&
            detail.firstName.toLowerCase() === initialApplicant.firstName?.toLowerCase() &&
            detail.lastName.toLowerCase() === initialApplicant.lastName?.toLowerCase() &&
            detail.position.toLowerCase() === initialApplicant.position?.toLowerCase()
          );
        });
        
        if (foundApplicant) {
          setApplicant({ ...initialApplicant, ...foundApplicant });
        } else {
          setApplicant(initialApplicant); // Use whatever data we have
          setError("Additional applicant details not found");
        }
      } catch (e) {
        console.error('Error fetching applicant:', e);
        setApplicant(initialApplicant); // Fall back to initial data
        setError(`Failed to fetch additional details: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantDetails();
  }, [initialApplicant]);

  useEffect(() => setVisible(true), []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 300);
  };

  // Function to insert data into pool table
  const insertToPool = async (applicantData, statusValue) => {
    try {
      console.log('insertToPool called with:', { applicantData, statusValue });
      
      const poolData = {
        name: `${applicantData.firstName} ${applicantData.lastName}`,
        position: applicantData.position,
        department: department || 'Unassigned',
        phone: applicantData.phone || '',
        status: statusValue
      };

      console.log('Sending pool data:', poolData);

      const response = await fetch('http://localhost/QMS-ASIANAVIS/HRMSBACKEND/HRMSbackend/pool.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(poolData)
      });

      console.log('Pool API response status:', response.status);
      console.log('Pool API response headers:', response.headers);

      const responseText = await response.text();
      console.log('Pool API raw response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse pool API response:', parseError);
        console.error('Raw response was:', responseText);
        throw new Error(`Invalid JSON response from pool API: ${responseText.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      console.log('Successfully inserted to pool table:', result);
      return result;
    } catch (error) {
      console.error('Error inserting to pool table:', error);
      return { success: false, error: error.message };
    }
  };

  const handleAccept = async () => {
    if (!employeeType) return alert("Please select an employment type first");
    if (!department) return alert("Please select a department first");

    setLoading(true);
    
    try {
      const employeeData = {
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        email: applicant.email,
        phone: applicant.phone,
        position: applicant.position,
        department: department,
        employeeType: employeeType,
        dateHired: new Date().toISOString(),
        birthDay: applicant.birthDay,
        birthMonth: applicant.birthMonth,
        birthYear: applicant.birthYear,
        gender: applicant.gender,
        street1: applicant.street1,
        street2: applicant.street2 || "",
        city: applicant.city,
        state: applicant.state,
        zip: applicant.zip,
        avatar: applicant.avatar,
        resumeUrl: applicant.resumeUrl,
      };

      console.log('Sending data:', employeeData);

      const response = await fetch('http://localhost/QMS-ASIANAVIS/HRMSBACKEND/HRMSbackend/accept_applicant.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(employeeData)
      });

      console.log('Response status:', response.status);

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response text:', responseText);
        throw new Error(`Server returned invalid JSON. Response: ${responseText.substring(0, 200)}...`);
      }

      if (!response.ok) {
        throw new Error(result.message || result.error || `HTTP error! status: ${response.status}`);
      }

      if (result.success) {
        setStatus("Accepted");
        
        // Insert to pool table with 'Accepted' status
        await insertToPool(applicant, 'Accepted');
        
        // Dispatch events to refresh both applicants and employees lists
        window.dispatchEvent(new CustomEvent("refreshApplicants"));
        window.dispatchEvent(new CustomEvent("refreshEmployees"));
        
        // Dispatch specific event for this applicant being accepted/removed
        window.dispatchEvent(new CustomEvent("applicantStatusChange", {
          detail: { 
            applicantId: applicant.uid || applicant.email,
            status: "Accepted",
            applicantRemoved: result.applicant_removed 
          }
        }));

        // Call the onStatusChange callback if provided
        if (onStatusChange) {
          onStatusChange();
        }
        
        alert("Applicant successfully accepted and added as employee!");
        handleClose();
      } else {
        throw new Error(result.message || result.error || 'Failed to accept applicant');
      }
    } catch (error) {
      console.error("Error accepting applicant:", error);
      
      if (error.message.includes('fetch')) {
        alert('Network error: Could not connect to server. Please check if the backend is running.');
      } else if (error.message.includes('JSON')) {
        alert('Server error: Invalid response format. Check server logs for details.');
      } else {
        alert(`Failed to accept applicant: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      
      console.log('Starting reject process for:', applicant);
      
      // Insert to pool table with 'Rejected' status
      console.log('Attempting to insert to pool table...');
      const poolResult = await insertToPool(applicant, 'Rejected');
      
      console.log('Pool insertion result:', poolResult);
      
      if (poolResult && poolResult.success === false) {
        console.error('Failed to insert to pool table:', poolResult.error);
        alert(`Warning: Failed to add to pool table: ${poolResult.error}. Continuing with rejection...`);
      } else if (poolResult && poolResult.success) {
        console.log('Successfully added to pool table');
      }
      
      // You can add API call here to handle rejection in backend if needed
      // For now, just update the status locally
      
      setStatus("Rejected");
      
      // Dispatch events to refresh the applicants list
      window.dispatchEvent(new CustomEvent("refreshApplicants"));
      
      // Dispatch specific event for this applicant being rejected
      window.dispatchEvent(new CustomEvent("applicantStatusChange", {
        detail: { 
          applicantId: applicant.uid || applicant.email,
          status: "Rejected"
        }
      }));

      // Call the onStatusChange callback if provided
      if (onStatusChange) {
        onStatusChange();
      }
      
      alert("Applicant rejected and added to pool.");
      handleClose();
    } catch (error) {
      console.error("Error rejecting applicant:", error);
      alert(`Failed to reject applicant: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = () => {
    if (status === "Accepted") return "bg-green-50 text-green-700 border-green-200";
    if (status === "Rejected") return "bg-red-50 text-red-700 border-red-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  const getAvatarDisplay = () => {
    if (applicant?.avatar) {
      const avatarUrl = applicant.avatar.startsWith('http') 
        ? applicant.avatar 
        : `http://localhost/QMS-ASIANAVIS/HRMSBACKEND/HRMSbackend/${applicant.avatar}`;
      
      return (
        <div className="flex justify-center">
          <img 
            src={avatarUrl}
            alt="Profile" 
            className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100"
            onError={(e) => {
              console.error('Avatar failed to load:', avatarUrl);
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    }
    
    return (
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center ring-4 ring-gray-100">
          <User className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    );
  };

  if (!applicant) return null;

  const employeeTypes = ["Regular", "Project Based", "Contractual"];
  const departments = ["PMS", "Accounting", "Technical", "Admin", "Utility", "HR", "IT", "Marketing", "Engineering"];

  const contactInfo = [
    { icon: Mail, text: applicant.email },
    { icon: Phone, text: applicant.phone },
    { icon: MapPin, text: `${applicant.street1} ${applicant.street2 ? `, ${applicant.street2}` : ''}, ${applicant.city}, ${applicant.state} ${applicant.zip}` }
  ];

  const documents = [
    { label: "Resume", url: applicant.resumeUrl },
    { label: "Passport", url: applicant.passport },
    { label: "Diploma", url: applicant.diploma },
    { label: "TOR", url: applicant.tor },
    { label: "Medical Certificate", url: applicant.medical },
    { label: "TIN ID", url: applicant.tinId },
    { label: "NBI Clearance", url: applicant.nbiClearance },
    { label: "Police Clearance", url: applicant.policeClearance },
    { label: "Pag-IBIG Number", url: applicant.pagibigNumber },
    { label: "PhilHealth Number", url: applicant.philhealthNumber },
  ].filter(({ url }) => url);

  const renderDropdown = (label, icon, value, options, isVisible, setVisible, setValue) => (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        {React.createElement(icon, { className: "w-4 h-4 mr-2" })}
        {label}
      </label>
      <div
        onClick={() => setVisible(!isVisible)}
        className="border border-gray-300 px-4 py-3 rounded-lg cursor-pointer flex justify-between items-center hover:border-blue-400 transition-colors bg-white"
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value || `Select ${label}`}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isVisible ? 'rotate-180' : ''}`} />
      </div>
      {isVisible && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
          {options.map((option) => (
            <li
              key={option}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
              onClick={() => {
                setValue(option === "Project Based" ? "Project-Based" : option);
                setVisible(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
      <div className={`bg-white w-full md:w-[500px] h-full shadow-2xl transform transition-transform duration-300 ${
        visible ? "translate-x-0" : "translate-x-full"
      }`}>
        
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Applicant Details</h2>
          <button 
            onClick={handleClose} 
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-pulse text-gray-500">Loading...</div>
              </div>
            )}

            <div className="text-center">
              {getAvatarDisplay()}
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {applicant.firstName} {applicant.lastName}
                </h3>
                <p className="text-sm text-blue-600 font-medium mt-1">{applicant.position}</p>
                <div className={`inline-block px-3 py-1 mt-3 rounded-full border text-sm font-medium ${getStatusBadgeClass()}`}>
                  {status}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
              {contactInfo.map(({ icon: Icon, text }, index) => (
                <div key={index} className="flex items-center text-sm">
                  <Icon className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-900">{text}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Cake className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-900">Birthday</span>
                </div>
                <span className="text-sm text-blue-800">
                  {applicant.birthMonth}/{applicant.birthDay}/{applicant.birthYear}
                </span>
              </div>
              
              {applicant.gender && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-sm font-medium text-purple-900">Gender</span>
                  </div>
                  <span className="text-sm text-purple-800">{applicant.gender}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {renderDropdown("Employee Type", Briefcase, employeeType, employeeTypes, dropdownVisible, setDropdownVisible, setEmployeeType)}
              {renderDropdown("Department", Building, department, departments, departmentDropdownVisible, setDepartmentDropdownVisible, setDepartment)}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Documents
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid gap-2">
                  {documents.map(({ label, url }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                    >
                      <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                disabled={loading}
                onClick={handleAccept}
                className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 font-medium"
              >
                <Check className="w-4 h-4" />
                <span>{loading ? 'Processing...' : 'Accept'}</span>
              </button>
              <button
                disabled={loading}
                onClick={handleReject}
                className="flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 font-medium"
              >
                <X className="w-4 h-4" />
                <span>{loading ? 'Processing...' : 'Reject'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantSidebar;