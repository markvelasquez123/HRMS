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
  const [isEmployee, setIsEmployee] = useState(false);
  const [isOFW, setIsOFW] = useState(false);

  useEffect(() => {
    if (!initialApplicant) return;

    if (initialApplicant.detailedData || 
        (initialApplicant.street1 && initialApplicant.city)) {
      setApplicant(initialApplicant);
      return;
    }

    const fetchApplicantDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost/HRMSbackend/get_applicants.php', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        
        const foundApplicant = data.details?.find(detail => {
          if (initialApplicant.email && detail.email) {
            return detail.email.toLowerCase() === initialApplicant.email.toLowerCase();
          }
          
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
          setApplicant(initialApplicant);
          setError("Additional applicant details not found");
        }
      } catch (e) {
        console.error('Error fetching applicant:', e);
        setApplicant(initialApplicant); 
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

  
  const handleEmployeeCheck = () => {
    setIsEmployee(true);
    setIsOFW(false);
  };

  const handleOFWCheck = () => {
    setIsOFW(true);
    setIsEmployee(false);
    
    setEmployeeType("");
    setDepartment("");
  };

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

      const response = await fetch('http://localhost/HRMSbackend/pool.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(poolData)
      });

      const responseText = await response.text();
      console.log('Pool API raw response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse pool API response:', parseError);
        console.error('Raw response:', responseText);
        
        // Check if response contains PHP error indicators
        if (responseText.includes('<br />') || responseText.includes('Fatal error') || responseText.includes('Warning:') || responseText.includes('Notice:')) {
          throw new Error(`PHP Error in pool.php. Check server logs and ensure your PHP backend is working correctly.`);
        }
        
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
  
  if (isEmployee) {
    if (!employeeType) return alert("Please select an employment type first");
    if (!department) return alert("Please select a department first");
  } else if (isOFW) {
    
  } else {
    return alert("Please select either Employee or Overseas Filipino Worker");
  }

  setLoading(true);
  
  try {
    if (isOFW) {
      
      const ofwData = {

        firstName: applicant.firstName,
        lastName: applicant.lastName,
        email: applicant.email,
        phone: applicant.phone,
        position: applicant.position,
        department: "OFW",
        employeeType: "OFW",
        dateHired: new Date().toISOString().split('T')[0],
        
        
        birthDay: applicant.birthDay,
        birthMonth: applicant.birthMonth,
        birthYear: applicant.birthYear,
        gender: applicant.gender,
        
        
        street1: applicant.street1,
        street2: applicant.street2 || "",
        city: applicant.city,
        state: applicant.state,
        zip: applicant.zip,
        
        profilePicture: applicant.avatar,
        resumeUrl: applicant.resumeUrl,
        
        
        passport: applicant.passport,
        diploma: applicant.diploma,
        tor: applicant.tor,
        medical: applicant.medical,
        tinId: applicant.tinId,
        nbiClearance: applicant.nbiClearance,
        policeClearance: applicant.policeClearance,
        pagibigNumber: applicant.pagibigNumber,
        philhealthNumber: applicant.philhealthNumber,
      };

      console.log('OFW Data being sent:', ofwData);

      // Step 1: Add to OFW table
      const response = await fetch('http://localhost/HRMSbackend/add_ofw.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(ofwData)
      });

      const responseText = await response.text();
      console.log('OFW API Raw response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw response:', responseText);
        
        if (responseText.includes('<br />') || responseText.includes('Fatal error') || responseText.includes('Warning:') || responseText.includes('Notice:')) {
          throw new Error(`PHP Error in add_ofw.php. Check server logs and ensure your PHP backend is working correctly.`);
        }
        
        throw new Error(`Server returned invalid JSON. First 200 chars: ${responseText.substring(0, 200)}...`);
      }

      if (!response.ok) {
        throw new Error(result.message || result.error || `HTTP error! status: ${response.status}`);
      }

      if (result.success) {
        // Step 2: Remove from applicant table
        try {
          const deleteResult = await fetch('http://localhost/HRMSbackend/delete_applicant.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email: applicant.email })
          });
          
          const deleteResponseText = await deleteResult.text();
          console.log('Delete applicant response:', deleteResponseText);
          
          let deleteResponse;
          try {
            deleteResponse = JSON.parse(deleteResponseText);
          } catch (parseError) {
            console.error('Delete response parse error:', parseError);
            // Continue even if delete response parsing fails
            deleteResponse = { success: true };
          }
          
          if (!deleteResult.ok || !deleteResponse.success) {
            console.warn('Failed to delete from applicant table, but OFW was added successfully');
          }
        } catch (deleteError) {
          console.error('Error deleting from applicant table:', deleteError);
          // Don't throw error here, as OFW was successfully added
        }

        // Step 3: Add to pool
        await insertToPool(applicant, 'Accepted as OFW');
        
        // Step 4: Update status and trigger events
        setStatus("Accepted as OFW");
        
        window.dispatchEvent(new CustomEvent("refreshApplicants"));
        window.dispatchEvent(new CustomEvent("refreshOFW"));
        
        window.dispatchEvent(new CustomEvent("applicantStatusChange", {
          detail: { 
            applicantId: applicant.uid || applicant.email,
            status: "Accepted as OFW",
            applicantRemoved: true // Always true for OFW
          }
        }));

        if (onStatusChange) {
          onStatusChange();
        }
        
        alert("Tanggap ka na");
        handleClose();
      } else {
        throw new Error(result.message || result.error || 'Failed to accept applicant as OFW');
      }
    } else {
      // Employee logic remains the same
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

      console.log('Sending employee data:', employeeData);

      const response = await fetch('http://localhost/HRMSbackend/accept_applicant.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(employeeData)
      });

      const responseText = await response.text();
      console.log('Employee API Raw response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw response:', responseText);
        
        if (responseText.includes('<br />') || responseText.includes('Fatal error') || responseText.includes('Warning:') || responseText.includes('Notice:')) {
          throw new Error(`PHP Error in accept_applicant.php. Check server logs and ensure your PHP backend is working correctly.`);
        }
        
        throw new Error(`Server returned invalid JSON. Response: ${responseText.substring(0, 200)}...`);
      }

      if (!response.ok) {
        throw new Error(result.message || result.error || `HTTP error! status: ${response.status}`);
      }

      if (result.success) {
        setStatus("Accepted");
        
        await insertToPool(applicant, 'Accepted');
        
        window.dispatchEvent(new CustomEvent("refreshApplicants"));
        window.dispatchEvent(new CustomEvent("refreshEmployees"));
        
        window.dispatchEvent(new CustomEvent("applicantStatusChange", {
          detail: { 
            applicantId: applicant.uid || applicant.email,
            status: "Accepted",
            applicantRemoved: result.applicant_removed 
          }
        }));

        if (onStatusChange) {
          onStatusChange();
        }
        
        alert("Applicant successfully accepted and added as employee!");
        handleClose();
      } else {
        throw new Error(result.message || result.error || 'Failed to accept applicant');
      }
    }
  } catch (error) {
    console.error("Error accepting applicant:", error);
    
    if (error.message.includes('fetch')) {
      alert('Network error: Could not connect to server. Please check if the backend is running.');
    } else if (error.message.includes('JSON') || error.message.includes('PHP Error')) {
      alert('Server error: Your PHP backend is returning errors instead of JSON. Check your server logs for PHP errors.');
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

      const poolResult = await insertToPool(applicant, 'Rejected');
      if (poolResult && poolResult.success === false) {
        alert(`Warning: Failed to add to pool table: ${poolResult.error}. Continuing with rejection...`);
      }

      const deleteResult = await fetch('http://localhost/HRMSbackend/delete_applicant.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: applicant.email })
      });
      const deleteResponse = await deleteResult.json();
      if (!deleteResult.ok || !deleteResponse.success) {
        throw new Error(deleteResponse.message || 'Failed to delete applicant from database.');
      }

      setStatus("Rejected");

      window.dispatchEvent(new CustomEvent("refreshApplicants"));
      window.dispatchEvent(new CustomEvent("applicantStatusChange", {
        detail: { 
          applicantId: applicant.uid || applicant.email,
          status: "Rejected"
        }
      }));

      if (onStatusChange) onStatusChange();

      alert("Applicant rejected, added to pool, and removed from applicants.");
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
    if (status === "Accepted as OFW") return "bg-blue-50 text-blue-700 border-blue-200";
    if (status === "Rejected") return "bg-red-50 text-red-700 border-red-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  const getAvatarDisplay = () => {
    if (applicant?.avatar) {
      const avatarUrl = applicant.avatar.startsWith('http') 
        ? applicant.avatar 
        : `http://localhost/HRMSbackend/${applicant.avatar}`;
      
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
          <h2 className="text-xl font-semibold text-gray-900">Details</h2>
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
              <h4 className="font-semibold text-gray-900 mb-3">Contact Info</h4>
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

            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Select Employment Type</h4>
              <div className="flex flex-col space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEmployee}
                    onChange={handleEmployeeCheck}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-800">Employee</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOFW}
                    onChange={handleOFWCheck}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-800">Overseas Filipino Worker</span>
                </label>
              </div>
            </div>

           
            {isEmployee && (
              <div className="space-y-4">
                {renderDropdown("Employee Type", Briefcase, employeeType, employeeTypes, dropdownVisible, setDropdownVisible, setEmployeeType)}
                {renderDropdown("Department", Building, department, departments, departmentDropdownVisible, setDepartmentDropdownVisible, setDepartment)}
              </div>
            )}

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