import React, { useState, useEffect } from "react";
import { X, Download, FileText, User, Phone, Mail, MapPin, Briefcase, Calendar, CheckCircle, AlertCircle, Clock, Shield } from "lucide-react";

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  if (timestamp.toDate) return timestamp.toDate().toLocaleDateString();
  if (timestamp._seconds) return new Date(timestamp._seconds * 1000).toLocaleDateString();
  return timestamp;
};

const EmployeeSidebar = ({ employee, onClose, onEmployeeRemoved }) => {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showResignPrompt, setShowResignPrompt] = useState(false);
  const [resignationDate, setResignationDate] = useState("");
  const [resignationReason, setResignationReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const handleResign = async () => {
    if (!resignationDate) {
      alert("Please select a resignation date");
      return;
    }

    setIsSubmitting(true);
    try {
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Employee resignation processed successfully");
      handleClose();
    } catch (error) {
      console.error("Error in handleResign:", error);
      alert(`Failed to process resignation: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const documentsList = [
    { 
      label: "Resume", 
      url: employee?.resumeUrl, 
      icon: FileText,
      required: true 
    },
    { 
      label: "Passport", 
      url: employee?.passport, 
      icon: Shield,
      required: false 
    },
    { 
      label: "Diploma", 
      url: employee?.diploma, 
      icon: FileText,
      required: true 
    },
    { 
      label: "TOR", 
      url: employee?.tor, 
      icon: FileText,
      required: true 
    },
    { 
      label: "Medical Certificate", 
      url: employee?.medical, 
      icon: FileText,
      required: true 
    },
    { 
      label: "TIN ID", 
      url: employee?.tinId, 
      icon: FileText,
      required: true 
    },
    { 
      label: "NBI Clearance", 
      url: employee?.nbiClearance, 
      icon: Shield,
      required: true 
    },
    { 
      label: "Police Clearance", 
      url: employee?.policeClearance, 
      icon: Shield,
      required: true 
    },
    { 
      label: "Pag-IBIG", 
      url: employee?.pagibigNumber, 
      icon: FileText,
      required: true 
    },
    { 
      label: "PhilHealth", 
      url: employee?.philhealthNumber, 
      icon: FileText,
      required: true 
    }
  ];

  
  const mockEmployee = employee || {
    FirstName: "John",
    LastName: "Doe",
    PositionApplied: "Software Engineer",
    status: "Active",
    IDNumber: "EMP001",
    ContactNumber: "+63 912 345 6789",
    EmailAddress: "john.doe@company.com",
    gender: "Male",
    street1: "123 Main Street",
    city: "Manila",
    state: "NCR",
    zip: "1000",
    department: "Information Technology",
    birthDate: "1990-05-15",
    dateHired: "2022-01-15",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    resumeUrl: "https://example.com/resume.pdf",
    diploma: "https://example.com/diploma.pdf",
    tor: "https://example.com/tor.pdf"
  };

  const currentEmployee = mockEmployee;

  const requiredDocs = documentsList.filter(doc => doc.required);
  const completedRequired = requiredDocs.filter(doc => doc.url).length;
  const completionPercentage = Math.round((completedRequired / requiredDocs.length) * 100);

  if (!currentEmployee) return null;

  return (
    <div className="fixed inset-0 flex justify-end z-50">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
        onClick={handleClose}
      ></div>
      <div
        className={`relative bg-white w-screen h-screen shadow-2xl transform transition-all duration-300 flex flex-col ${
          visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Employee Profile</h2>
              <p className="text-blue-100 text-sm mt-1">Complete employee information</p>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
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

        
        <div className="flex-1 overflow-y-auto">
          {activeTab === "details" && (
            <div className="p-6 space-y-8">
              
              <div className="relative">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={currentEmployee.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"}
                      alt={`${currentEmployee.firstName} ${currentEmployee.lastName}`}
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {currentEmployee.firstName} {currentEmployee.lastName}
                    </h3>
                    <p className="text-lg text-gray-600 mb-3">{currentEmployee.position || "No position specified"}</p>
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {currentEmployee.status || "Active"}
                      </span>
                      <span className="text-sm text-gray-500">
                        ID: {currentEmployee.IDNumber || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              
              <div className="grid gap-4">
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-blue-600" />
                    Contact Information
                  </h4>
                  <div className="grid gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Phone Number</p>
                        <p className="text-gray-800 font-medium">{currentEmployee.phone || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">E-Mail</p>
                        <p className="text-gray-800 font-medium">{currentEmployee.email || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-purple-600" />
                    Personal Information
                  </h4>
                  <div className="grid gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Gender</p>
                        <p className="text-gray-800 font-medium">{currentEmployee.gender || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Birth Date</p>
                        <p className="text-gray-800 font-medium">{formatTimestamp(currentEmployee.birthDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <MapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Address</p>
                        <p className="text-gray-800 font-medium">
                          {[
                            currentEmployee.HomeAddress
                          ].filter(Boolean).join(", ") || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                    Work Information
                  </h4>
                  <div className="grid gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Briefcase className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Department</p>
                        <p className="text-gray-800 font-medium">{currentEmployee.department || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date Hired</p>
                        <p className="text-gray-800 font-medium">{formatTimestamp(currentEmployee.dateHired)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="p-6 space-y-6">
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Document Completion</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{completedRequired} of {requiredDocs.length} required documents</span>
                  <span>{documentsList.filter(doc => !doc.required && doc.url).length} optional documents</span>
                </div>
              </div>

              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  All Documents
                </h4>
                {documentsList.map((doc, index) => (
                  <div
                    key={index}
                    className={`group flex items-center justify-between p-4 bg-white border-2 rounded-xl transition-all hover:shadow-md ${
                      doc.url 
                        ? 'border-green-200 hover:border-green-300 bg-green-50/30' 
                        : doc.required 
                          ? 'border-red-200 hover:border-red-300 bg-red-50/30'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        doc.url 
                          ? 'bg-green-100' 
                          : doc.required 
                            ? 'bg-red-100' 
                            : 'bg-gray-100'
                      }`}>
                        <doc.icon className={`w-6 h-6 ${
                          doc.url 
                            ? 'text-green-600' 
                            : doc.required 
                              ? 'text-red-600' 
                              : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-800">
                            {doc.label}
                          </span>
                          {doc.required && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                              Required
                            </span>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          {doc.url ? (
                            <div className="flex items-center text-green-600 text-sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Available
                            </div>
                          ) : doc.required ? (
                            <div className="flex items-center text-red-600 text-sm">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Missing
                            </div>
                          ) : (
                            <div className="flex items-center text-gray-500 text-sm">
                              <Clock className="w-4 h-4 mr-1" />
                              Optional
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group-hover:shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Download</span>
                      </a>
                    ) : (
                      <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm">
                        Not provided
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSidebar;