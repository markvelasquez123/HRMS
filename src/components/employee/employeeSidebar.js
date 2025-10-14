import React, { useState, useEffect } from "react";
import { X, Download, FileText, User, Phone, Mail, MapPin, Briefcase, Calendar, CheckCircle, AlertCircle, Clock, Shield, Edit, Cake, Building } from "lucide-react";
import EditEmployeeModal from './EditEmployee';
import { URL } from "../../constant.js";
const UPDATE_API_URL = `http://${URL}/HRMSbackend/update_employee.php`;
const RETIRE_API_URL = `http://${URL}/HRMSbackend/retire_employee.php`;

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return date.toLocaleDateString();
};

const EmployeeSidebar = ({ employee: initialEmployee, onClose, onEmployeeRemoved, onEmployeeUpdated }) => {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showResignPrompt, setShowResignPrompt] = useState(false);
  const [resignationDate, setResignationDate] = useState("");
  const [resignationReason, setResignationReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(initialEmployee);

  useEffect(() => {
    setVisible(true);
    if (initialEmployee) {
      setCurrentEmployee(initialEmployee);
    }
  }, [initialEmployee]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const getAvatarDisplay = () => {
    if (currentEmployee?.ProfilePicture) {
      return (
        <img 
          src={"http://"+ URL +"/HRMSbackend/uploads/${currentEmployee.ProfilePicture}"} 
          alt={`${currentEmployee.FirstName} ${currentEmployee.LastName}`} 
          className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-white" 
        />
      );
    }
    return (
      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-white shadow-lg">
        <User size={40} />
      </div>
    );
  };

  const handleResign = async () => {
    if (!resignationDate) {
      alert("Please select a resignation date");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(RETIRE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: currentEmployee.IDNumber,
          resignationDate,
          resignationReason,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      alert("Employee resignation processed successfully");
      if (onEmployeeRemoved) {
        onEmployeeRemoved(currentEmployee.IDNumber);
      }
      handleClose();
    } catch (error) {
      console.error("Error in handleResign:", error);
      alert(`Failed to process resignation: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setShowResignPrompt(false);
    }
  };

  const handleUpdateEmployee = async (updatedData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(UPDATE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      setCurrentEmployee(updatedData);
      if (onEmployeeUpdated) {
        onEmployeeUpdated(updatedData);
      }
      setShowEditModal(false);
      alert("Employee details updated successfully");
    } catch (error) {
      console.error("Error in handleUpdateEmployee:", error);
      alert(`Failed to update employee details: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const documentsList = [
    { label: "Resume", url: currentEmployee?.ResumeFile, required: true },
    { label: "Passport", url: currentEmployee?.Passport, required: false },
    { label: "Diploma", url: currentEmployee?.Diploma, required: true },
    { label: "TOR", url: currentEmployee?.Tor, required: true },
    { label: "Medical Certificate", url: currentEmployee?.Medical, required: true },
    { label: "TIN ID", url: currentEmployee?.TinID, required: true },
    { label: "NBI Clearance", url: currentEmployee?.NBIClearance, required: true },
    { label: "Police Clearance", url: currentEmployee?.PoliceClearance, required: true },
    { label: "Pag-IBIG", url: currentEmployee?.PagIbig, required: true },
    { label: "PhilHealth", url: currentEmployee?.PhilHealth, required: true }
  ];

  const renderDocumentStatus = (doc) => {
    const isCompleted = !!doc.url;
    const isRequired = doc.required;
    
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (isRequired) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  const renderFileLink = (url) => {
    if (url) {
      const fullUrl = "http://"+ URL +"/HRMSbackend/uploads/${url}";
      return (
        <a 
          href={fullUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:underline flex items-center gap-2"
        >
          <FileText size={16} /> View Document
        </a>
      );
    }
    return <span className="text-gray-500">Not provided</span>;
  };

  const requiredDocs = documentsList.filter(doc => doc.required);
  const completedRequired = requiredDocs.filter(doc => doc.url).length;
  const completionPercentage = requiredDocs.length > 0 ? Math.round((completedRequired / requiredDocs.length) * 100) : 100;

  if (!currentEmployee) return null;

  return (
    <div
      className={`fixed top-0 right-0 w-full md:w-96 bg-white h-full shadow-lg transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${visible ? "translate-x-0" : "translate-x-full"}`}
    >
      
      <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
        <h2 className="text-xl font-semibold text-gray-900">Employee Profile</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowEditModal(true)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="flex border-b bg-gray-50">
          <button 
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-4 px-6 font-semibold text-sm transition-all relative ${
              activeTab === "details" 
                ? "text-blue-600 bg-white border-b-2 border-blue-600 shadow-sm" 
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Details
          </button>
          <button 
            onClick={() => setActiveTab("documents")}
            className={`flex-1 py-4 px-6 font-semibold text-sm transition-all relative ${
              activeTab === "documents" 
                ? "text-blue-600 bg-white border-b-2 border-blue-600 shadow-sm" 
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Documents
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
              {completedRequired}/{requiredDocs.length}
            </span>
          </button>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col items-center mb-6">
          {getAvatarDisplay()}
          <h3 className="text-xl font-bold text-gray-900 mt-4">{currentEmployee.FirstName} {currentEmployee.LastName}</h3>
          <p className="text-sm text-gray-500">{currentEmployee.Position || 'N/A'}</p>
        </div>
        
        <div className="space-y-4 text-gray-700">
          {activeTab === "details" && (
            <>
              <div className="flex items-center gap-4">
                <Mail size={20} className="text-gray-500" />
                <p className="text-sm">Email: <span className="font-medium">{currentEmployee.EmailAddress || 'N/A'}</span></p>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={20} className="text-gray-500" />
                <p className="text-sm">Contact: <span className="font-medium">{currentEmployee.ContactNumber || 'N/A'}</span></p>
              </div>
              <div className="flex items-center gap-4">
                <MapPin size={20} className="text-gray-500" />
                <p className="text-sm">Address: <span className="font-medium">{currentEmployee.HomeAddress || 'N/A'}</span></p>
              </div>
              <div className="flex items-center gap-4">
                <Cake size={20} className="text-gray-500" />
                <p className="text-sm">Date of Birth: <span className="font-medium">{formatTimestamp(currentEmployee.Birthdate) || 'N/A'}</span></p>
              </div>
              <div className="flex items-center gap-4">
                <Briefcase size={20} className="text-gray-500" />
                <p className="text-sm">Position: <span className="font-medium">{currentEmployee.Position || 'N/A'}</span></p>
              </div>
              <div className="flex items-center gap-4">
                <Building size={20} className="text-gray-500" />
                <p className="text-sm">Department: <span className="font-medium">{currentEmployee.Department || 'N/A'}</span></p>
              </div>
              <div className="flex items-center gap-4">
                <Calendar size={20} className="text-gray-500" />
                <p className="text-sm">Hired: <span className="font-medium">{formatTimestamp(currentEmployee.DateHired) || 'N/A'}</span></p>
              </div>
            </>
          )}

          {activeTab === "documents" && (
            <div className="p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Documents</h4>
              <ul className="space-y-4">
                {documentsList.map((doc, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-100 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-4">
                      {renderDocumentStatus(doc)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.label}</p>
                        {doc.required && !doc.url && (
                          <span className="text-xs text-red-500 font-medium">Required</span>
                        )}
                      </div>
                    </div>
                    {renderFileLink(doc.url)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 p-6">
            {!showResignPrompt && (
              <button
                onClick={() => setShowResignPrompt(true)}
                className="w-full flex items-center justify-center py-3 px-6 border border-red-500 text-red-500 rounded-full font-semibold transition-colors duration-200 hover:bg-red-50"
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                Process Resignation
              </button>
            )}

            {showResignPrompt && (
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4">Resignation Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resignation Date</label>
                    <input
                      type="date"
                      value={resignationDate}
                      onChange={(e) => setResignationDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <textarea
                      value={resignationReason}
                      onChange={(e) => setResignationReason(e.target.value)}
                      rows="3"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none"
                      placeholder="Enter reason for resignation..."
                    ></textarea>
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={handleResign}
                    className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors duration-200 ${
                      isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Confirm Resignation"}
                  </button>
                  <button
                    onClick={() => setShowResignPrompt(false)}
                    className="flex-1 py-2 px-4 rounded-md border border-gray-300 text-gray-700 font-medium transition-colors duration-200 hover:bg-gray-100"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
      {showEditModal && (
        <EditEmployeeModal
          employee={currentEmployee}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeSidebar;
