import React, { useState, useReducer, useEffect, useRef } from "react";
import { X, User, Phone, Mail, MapPin, Cake, Briefcase, Building, FileText, IdCard, DollarSign, Search, Eye, AlertCircle, Carrot } from "lucide-react";

const initialFormState = {
  idNumber: "", firstName: "", lastName: "", birthDate: "", Position: "", Department: "", hireDate: "",
  ProfilePicture: null, ResumeFile: null, email: "", phone: "", gender: "", employeeType: "", company: "",
  street1: "", street2: "", city: "", state: "", zip: "", salary: ""
  
  
};





  
  // }
  // try {
  //   const response = await fetch("http://localhost/HRMSbackend/employee.php?action=get", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body:JSON.stringify({accid}),
  //     credentials: "include"
  //   });
  //   const accID = await response.json();

  //   if (accID && !accID.error && accID.length > 0) {
  //     const user = accID[0];
  //   setUserData(user);
  //   sessionStorage.setItem('userAccid', JSON.stringify(user));

    
  // }



function formReducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD": return { ...state, [action.field]: action.value };
    case "RESET": return initialFormState;
    default: return state;
  }
}

const isOnlyNumbers = (value) => /^\d*$/.test(value);
const isOnlyLetters = (value) => /^[A-Za-z ]*$/.test(value);
const isValidDecimal = (value) => /^\d*\.?\d*$/.test(value);

const Alert = ({ type, message, onClose }) => (
  <div className={`fixed top-4 right-4 ${type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'} border px-4 py-3 rounded-lg shadow-lg z-50 max-w-md`}>
    <div className="flex items-start">
      {type === 'error' && <AlertCircle className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />}
      <div className="flex-1">
        <strong className="font-bold">{type === 'error' ? 'Error' : 'Success'}: </strong>
        <span className="block sm:inline">{message}</span>
      </div>
      <button onClick={onClose} className={`ml-2 ${type === 'error' ? 'text-red-700 hover:text-red-900' : 'text-green-700 hover:text-green-900'}`}>
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const EmployeeSidebar = ({ employee, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => { setVisible(true); }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const getAvatarDisplay = () => {
    if (employee?.ProfilePicture) {
      return <img src={`http://localhost/HRMSbackend/uploads/${employee.ProfilePicture}`} alt={`${employee.FirstName} ${employee.LastName}`} className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100 mx-auto" />;
    }
    return (
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center ring-4 ring-gray-100 mx-auto">
        <User className="w-8 h-8 text-blue-600" />
      </div>
    );
  };

  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
      <div className={`bg-white w-full md:w-[500px] h-full shadow-2xl transform transition-transform duration-300 ${visible ? "translate-x-0" : "translate-x-full"}`}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Employee Details</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          <div className="p-6 space-y-6">
            <div className="text-center">
              {getAvatarDisplay()}
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900">{employee.FirstName} {employee.LastName}</h3>
                <p className="text-sm text-blue-600 font-medium mt-1">{employee.Position}</p>
                <p className="text-sm text-gray-500">{employee.Department}</p>
                <div className="inline-block px-3 py-1 mt-3 rounded-full border bg-green-50 text-green-700 border-green-200 text-sm font-medium">Active</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
              <div className="flex items-center text-sm"><Mail className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" /><span className="text-gray-900">{employee.email}</span></div>
              <div className="flex items-center text-sm"><Phone className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" /><span className="text-gray-900">{employee.phone}</span></div>
              <div className="flex items-start text-sm">
                <MapPin className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-900 leading-relaxed">{employee.street1}{employee.street2 ? `, ${employee.street2}` : ''}, {employee.city}, {employee.state} {employee.zip}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-2"><Cake className="w-4 h-4 text-blue-600 mr-2" /><span className="text-sm font-medium text-blue-900">Birth Date</span></div>
                <span className="text-sm text-blue-800">{employee.birthDate}</span>
              </div>
              {employee.gender && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center mb-2"><User className="w-4 h-4 text-purple-600 mr-2" /><span className="text-sm font-medium text-purple-900">Gender</span></div>
                  <span className="text-sm text-purple-800">{employee.gender}</span>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center"><Briefcase className="w-4 h-4 mr-2" />Employment Information</h4>
              <div className="space-y-3">
                {[
                  { icon: IdCard, label: "Employee ID", value: employee.idNumber },
                  { icon: Building, label: "Type", value: employee.employeeType },
                  { icon: Carrot, label: "Type", value: employee.company },

                  { icon: DollarSign, label: "Salary", value: `₱${employee.salary}`, className: "text-green-600" },
                  { icon: Cake, label: "Hire Date", value: employee.hireDate }
                ].map(({ icon: Icon, label, value, className = "text-gray-900" }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center text-sm"><Icon className="w-4 h-4 text-gray-500 mr-2" /><span className="text-gray-600">{label}</span></div>
                    <span className={`text-sm font-medium ${className}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {employee.ResumeFile && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center"><FileText className="w-4 h-4 mr-2" />Documents</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <a href={`http://localhost/HRMSbackend/uploads/${employee.ResumeFile}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                    <FileText className="w-4 h-4 mr-2 flex-shrink-0" />View Resume
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [formData, dispatch] = useReducer(formReducer, initialFormState);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const profilePicRef = useRef(null);
  const resumeFileRef = useRef(null);
  const [fieldErrors, setFieldErrors] = useState({ idNumber: "", firstName: "", lastName: "", Position: "", phone: "", salary: "" });
  const [accID, setaccID] = useState();
  const [isChecked, setIsChecked] = useState(false);

  const departments = ["PMS", "Accounting", "Technical", "Admin", "Utility", "HR", "IT", "Marketing", "Engineering"];
  const basicFields = ["idNumber", "firstName", "lastName", "birthDate", "Position", "Department", "hireDate", "gender", "employeeType", "company", "salary"];
  const contactFields = ["email", "phone"];
  const addressFields = ["street1", "street2", "city", "state", "zip"];



  function Clicked(){
    alert("ginalaw")
    setIsChecked(la => !la);
    // const handleChange = () => {
    //   setIsChecked(!isChecked);
    // }
  }
  useEffect(() => {
     loadEmployees();
      fetchAccid();
     }, []);
  
     const fetchAccid = async () => {
  const accid = sessionStorage.getItem('AccID');
  setaccID(accid);

  if (!accid) { // use accid, not accID
    console.error("walang acc id");
    return;
  }
    
  }
  

  

  const loadEmployees = async () => {
    try {
      const response = await fetch('http://localhost/HRMSbackend/employee.php?action=get');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }
      const employees = await response.json();
      setEmployeeList(employees);
    } catch (error) {
      console.error("Error loading employees:", error);
      setError("Failed to load employees: " + error.message);
    }
  };

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";
    
    if ((name === "idNumber" || name === "phone") && !isOnlyNumbers(value)) error = "Only numbers are allowed.";
    if ((name === "firstName" || name === "lastName" || name === "Position") && !isOnlyLetters(value)) error = "Only letters are allowed.";
    if (name === "salary" && value && !isValidDecimal(value)) error = "Only numbers and decimal points are allowed.";
    
    setFieldErrors(la => ({ ...la, [name]: error }));
    if (!error) dispatch({ type: "UPDATE_FIELD", field: name, value });
  };

  const handleFileChange = (e) => dispatch({ type: "UPDATE_FIELD", field: "ProfilePicture", value: e.target.files[0] });
  const handleResumeFileChange = (e) => dispatch({ type: "UPDATE_FIELD", field: "ResumeFile", value: e.target.files[0] });

  
  const validateFiles = () => {
    if (formData.ProfilePicture && !formData.ProfilePicture.type.startsWith('image/')) {
      return false;
    }
    if (
      formData.ResumeFile &&
      !formData.ResumeFile.type.includes('pdf') &&
      !formData.ResumeFile.type.includes('document') &&
      !formData.ResumeFile.type.startsWith('image/')
    ) {
      return false;
    }
    return true;
  };

  const isAtLeast18 = (birthDateString) => {
    if (!birthDateString) return false;
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  };

  const isFormValid = () => {
  const requiredFields = ["idNumber", "firstName", "lastName", "birthDate", "Position", "Department", "hireDate", "email", "phone", "gender", "employeeType", "company", "street1", "city", "state", "zip", "salary"];
    
    const textAndDateValid = requiredFields.every((field) => {
      if (field === "birthDate" || field === "hireDate") {
        const dateValue = formData[field];
        return dateValue && !isNaN(new Date(dateValue).getTime());
      }
      if (field === "idNumber" && !isOnlyNumbers(formData[field])) return false;
      if (field === "phone" && !isOnlyNumbers(formData[field])) return false;
      if (field === "salary" && (!formData[field] || !isValidDecimal(formData[field]))) return false;
      if ((field === "firstName" || field === "lastName" || field === "Position") && !isOnlyLetters(formData[field])) return false;
      if (field === "company" && (!formData.company || formData.company === "")) return false;
      return formData[field] && formData[field].toString().trim() !== "";
    });
    
    return textAndDateValid && isAtLeast18(formData.birthDate) && formData.ProfilePicture && formData.ResumeFile && validateFiles();
  };

  const resetForm = () => {
    setShowForm(false);
    dispatch({ type: "RESET" });
    setFieldErrors({ idNumber: "", firstName: "", lastName: "", Position: "", phone: "", salary: "" });
    if (profilePicRef.current) profilePicRef.current.value = "";
    if (resumeFileRef.current) resumeFileRef.current.value = "";
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!validateFiles()) {
      setError("Profile picture must be an image file, and resume should be a PDF or document.");
      return;
    }

    if (!isFormValid()) {
      setError('Please fill in all required fields correctlyyy');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const submitFormData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'ProfilePicture' || key === 'ResumeFile') {
        if (formData[key]) submitFormData.append(key, formData[key]);
      } else {
        submitFormData.append(key, formData[key] || '');
      }
    });
    
    try {
      const response = await fetch("http://localhost/HRMSbackend/employee.php", {method: 'POST',body: submitFormData});
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        throw new Error("Server returned non-JSON response. Check PHP error logs.");
       
      }
      
      const result = await response.json();
       
      if (result.success) {
         
        if (isChecked) {
          try {
            const signupResp = await fetch("http://localhost/HRMSbackend/signup.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                password: "123123",
                company: formData.company
              })
            });
            const signupJson = await signupResp.json();
            if (!signupJson.success) {
              console.error("Signup failed:", signupJson.message);
            }
          } catch (signupErr) {
            console.error("Signup request error:", signupErr);
          }
        }

        setSuccess('Employee added successfully!');
        resetForm();
        loadEmployees();
      } else {
        setError(result.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(`Error submitting form: ${error.message}. Please check your PHP backend and server logs.`);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employeeList.filter((employee) => {
    return (
      (employee.FirstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.LastName?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedDepartment === "" || employee.Department === selectedDepartment)
    );
  });
  

  const renderFormField = (field, isRequired = true) => {
    const labelMap = {
      idNumber: "Employee ID", firstName: "First Name", lastName: "Last Name", hireDate: "Hire Date",
      birthDate: "Birth Date", employeeType: "Employee Type", company: "Company", Position: "Position", Department: "Department", salary: "Salary",
      accid: "Account ID",
    };
    const label = labelMap[field] || field.replace(/([A-Z])/g, " $1").trim();
    
    const commonProps = {
      name: field,
      value: formData[field] || "",
      onChange: handleChange,
      className: "w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      required: isRequired
    };

    if (field === "Department") {
      return (
        <div key={field} className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Department *</label>
          <select {...commonProps}>
            <option value="">Select Department</option>
            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>
      );
    }
    
    if (field === "employeeType") {
      return (
        <div key={field} className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Employee Type *</label>
          <select {...commonProps}>
            <option value="">Select Employee Type</option>
            {["Regular", "Project-Based", "Probationary"].map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      );
    }
    if (field === "company") {
      return (
        <div key={field} className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Company *</label>
          <select
            name="company"
            value={formData.company || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={isRequired}
          >
            <option value="">Select Company</option>
            <option value="Asia Navis">Asia Navis</option>
            <option value="Rigel">Rigel</option>
            <option value="Peak HR">Peak HR</option>
          </select>
        </div>
      );
    }
    
    if (field === "gender") {
      return (
        <div key={field} className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Gender *</label>
          <select {...commonProps}>
            <option value="">Select Gender</option>
            {["Male", "Female", "Other", "Prefer-Not-To-Say"].map(g => 
              <option key={g} value={g}>{g === "Prefer-Not-To-Say" ? "Prefer not to say" : g}</option>
            )}
          </select>
        </div>
      );
    }

    return (
      <div key={field} className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label} {isRequired && "*"}
        </label>
        <input
          {...commonProps}
          type={field.includes("Date") ? "date" : field === "email" ? "email" : field === "phone" ? "tel" : field === "salary" ? "number" : "text"}
          step={field === "salary" ? "0.01" : undefined}
          min={field === "salary" ? "0" : undefined}
          inputMode={(field === "idNumber" || field === "phone") ? "numeric" : field === "salary" ? "decimal" : undefined}
          pattern={(field === "idNumber" || field === "phone") ? "[0-9]*" : undefined}
        />
        {fieldErrors[field] && <span className="text-red-500 text-xs">{fieldErrors[field]}</span>}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-x-hidden">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      {selectedEmployee && <EmployeeSidebar employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />}
      
      <div className="p-6 text-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>
          <div className="flex items-center gap-4">
            <select className="border border-gray-300 p-2 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-200" 
              value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
              <option value="">All Departments</option>
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            <div className="relative">
              <input type="text" placeholder="Search by Name" 
                className="border border-gray-300 p-2 pl-10 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-200" 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg" 
              onClick={() => setShowForm(true)}>
              
              + Add Employee
            </button>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl mx-4 sm:mx-auto overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New Employee Added by:{accID}</h2>
                <div> 
                  <label>
                    <input 
                    type = "checkbox"
                    checked={isChecked}
                    onChange={Clicked}
                    />
                    </label>
                    
                  </div>
                  
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {[
                  { title: "Basic Information", fields: basicFields },
                  { title: "Contact Information", fields: contactFields },
                  { title: "Address", fields: addressFields }
                ].map(({ title, fields }) => (
                  <div key={title} className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
                    <div className={title === "Address" ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
                      {title === "Address" ? (
                        <>
                          {renderFormField("street1")}
                          {renderFormField("street2", false)}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {fields.slice(2).map(field => renderFormField(field))}
                          </div>
                        </>
                      ) : (
                        fields.map(field => renderFormField(field))
                      )}
                    </div>
                  </div>
                ))}

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Profile Picture *</label>
                      <input type="file" accept="image/*" onChange={handleFileChange} ref={profilePicRef} 
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                      {!formData.ProfilePicture && <span className="text-red-500 text-xs">Profile picture is required.</span>}
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Resume/CV *</label>
                      <input type="file" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                        onChange={handleResumeFileChange} ref={resumeFileRef} 
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                      {!formData.ResumeFile && <span className="text-red-500 text-xs">Resume is required.</span>}
                    </div>
                  </div>
                </div>
                

                <div className="flex justify-end space-x-4 pt-4">
                  <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} 
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubmit}>
                    {loading ? "Submitting..." : "Add Employee"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto mt-6 bg-white rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Picture", "Employee ID", "Name", "Department", "Employee Type", "Gender", "Position", "Salary","Date Hired", "Action"].map(header => (
                  <th key={header} className={`px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider ${header === "Action" ? "text-right" : "text-left"}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee, index) => (
                <tr key={employee.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <img src={employee.ProfilePicture ? `http://localhost/HRMSbackend/uploads/${employee.ProfilePicture}` : "https://via.placeholder.com/150"} 
                      alt={`${employee.FirstName} ${employee.LastName}`} className="h-12 w-12 rounded-full object-cover border-2 border-gray-200" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{employee.idNumber}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{employee.FirstName} {employee.LastName}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{employee.Department}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{employee.employeeType}</div></td>

                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{employee.gender}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{employee.Position}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">₱{employee.salary}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{employee.hireDate}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => setSelectedEmployee(employee)} className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr><td colSpan="9" className="px-6 py-8 text-center text-gray-500 italic">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

};
export default EmployeePage;