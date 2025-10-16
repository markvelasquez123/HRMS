import React, { useState, useReducer } from "react";
import { X, AlertCircle } from "lucide-react";
import { URL } from "../../constant.js";

const initialFormState = {
  FirstName: "", MiddleName: "", LastName: "", Birthdate: "", PositionApplied: "", Department: "", DateHired: "",
  EmailAddress: "", ContactNumber: "", Gender: "", EmployeeType: "", Company: "",
  HomeAddress: "", Passport: ""
};

function formReducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD": return { ...state, [action.field]: action.value };
    case "RESET": return initialFormState;
    default: return state;
  }
}

const isOnlyLetters = (value) => /^[A-Za-z ]*$/.test(value);

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

const AddEmployeeForm = ({ onClose, onSuccess }) => {
  const [formData, dispatch] = useReducer(formReducer, initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({ FirstName: "", LastName: "", PositionApplied: "", ContactNumber: "", Passport: "" });
  const [isChecked, setIsChecked] = useState(false);

  const departments = ["PMS", "Accounting", "Technical", "Admin", "Utility", "HR", "IT", "Marketing", "Engineering", "Architect", "Operation", "Director"];
  const companies = ["Asia Navis", "Rigel", "PeakHR"];
  const basicFields = ["FirstName", "MiddleName", "LastName", "Birthdate", "PositionApplied", "Department", "DateHired", "Gender", "EmployeeType", "Company", "Passport"];
  const contactFields = ["EmailAddress", "ContactNumber"];
  const addressFields = ["HomeAddress"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";
    
    if ((name === "FirstName" || name === "LastName" || name === "PositionApplied") && !isOnlyLetters(value)) {
      error = "Only letters are allowed.";
    }
    
    setFieldErrors(prev => ({ ...prev, [name]: error }));
    if (!error) dispatch({ type: "UPDATE_FIELD", field: name, value });
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
    const requiredFields = ["FirstName", "LastName", "Birthdate", "PositionApplied", "Department", "DateHired", "EmailAddress", "ContactNumber", "Gender", "EmployeeType", "Company", "HomeAddress", "Passport"];
    const textAndDateValid = requiredFields.every((field) => {
      if (field === "Birthdate" || field === "DateHired") {
        const dateValue = formData[field];
        return dateValue && !isNaN(new Date(dateValue).getTime());
      }
      if (field === "ContactNumber" && !/^\d+$/.test(formData[field])) return false;
      if ((field === "FirstName" || field === "LastName" || field === "PositionApplied") && !isOnlyLetters(formData[field])) return false;
      if (field === "Company" && (!formData.Company || formData.Company === "")) return false;
      return formData[field] && formData[field].toString().trim() !== "";
    });
    
    return textAndDateValid && isAtLeast18(formData.Birthdate);
  };

  const resetForm = () => {
    dispatch({ type: "RESET" });
    setFieldErrors({ FirstName: "", LastName: "", PositionApplied: "", ContactNumber: "", Passport: "" });
    setError(null);
    setSuccess(null);
    setIsChecked(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      const requiredFields = ["FirstName", "LastName", "Birthdate", "PositionApplied", "Department", "DateHired", "EmailAddress", "ContactNumber", "Gender", "EmployeeType", "Company", "HomeAddress", "Passport"];
      const missingFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === "");
      
      if (missingFields.length > 0) {
        const fieldNames = missingFields.map(f => {
          const labelMap = {
            FirstName: "First Name", LastName: "Last Name", DateHired: "Hire Date",
            Birthdate: "Birth Date", EmployeeType: "Employee Type", PositionApplied: "Position", ContactNumber: "Contact Number",
            EmailAddress: "Email Address", HomeAddress: "Home Address", Passport: "Passport"
          };
          return labelMap[f] || f;
        }).join(", ");
        setError(`Missing required fields: ${fieldNames}`);
      } else if (!isAtLeast18(formData.Birthdate)) {
        setError('Employee must be at least 18 years old');
      } else if (!/^\d+$/.test(formData.ContactNumber)) {
        setError('Contact Number must contain only numbers');
      } else if (!formData.Company || formData.Company === "") {
        setError('Please select a Company');
      } else {
        setError('Please fill in all required fields correctly');
      }
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const submitFormData = new FormData();
    Object.keys(formData).forEach(key => {
      submitFormData.append(key, formData[key] || '');
    });
    
    try {
      const response = await fetch(`http://${URL}/HRMSbackend/test2.php`, {
        method: 'POST',
        body: submitFormData
      });
      
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
            const signupResp = await fetch("http://"+ URL +"/HRMSbackend/signup.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                FirstName: formData.FirstName,
                MiddleName: formData.MiddleName,
                LastName: formData.LastName,
                email: formData.EmailAddress,
                password: "123123",
                company: formData.Company,
                dateHired: formData.DateHired
              })
            });
            if (!signupResp.success) {
              console.error("Signup failed:", signupResp.message);
            }
          } catch (signupErr) {
            console.error("Signup request error:", signupErr);
          }
        }

        setSuccess(`Employee added successfully! ID: ${result.IDNumber || 'Generated'}`);
        resetForm();
        if (onSuccess) onSuccess();
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        setError(result.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(`Error submitting form: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderFormField = (field, isRequired = true) => {
    const labelMap = {
      FirstName: "First Name", MiddleName: "Middle Name", LastName: "Last Name", DateHired: "Hire Date",
      Birthdate: "Birth Date", EmployeeType: "Employee Type", Company: "Company", PositionApplied: "Position", 
      Department: "Department", Passport: "Passport"
    };
    const label = labelMap[field] || field.replace(/([A-Z])/g, " $1").trim();
    
    const commonProps = {
      name: field,
      value: formData[field] || "",
      onChange: handleChange,
      className: "w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      required: field === "MiddleName" ? false : isRequired
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
    
    if (field === "EmployeeType") {
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

    if (field === "Company") {
      return (
        <div key={field} className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Company *</label>
          <input
            {...commonProps}
            type="text"
            list="company-list"
            placeholder="Type or select a company"
            autoComplete="off"
          />
          <datalist id="company-list">
            {companies.map(company => (
              <option key={company} value={company} />
            ))}
          </datalist>
        </div>
      );
    }
    
    if (field === "Gender") {
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
          {label} {field === "MiddleName" ? "" : isRequired ? "*" : ""}
        </label>
        <input
          {...commonProps}
          type={field === "Birthdate" || field === "DateHired" ? "date" : field === "EmailAddress" ? "email" : field === "ContactNumber" ? "tel" : "text"}
          inputMode={field === "ContactNumber" ? "numeric" : undefined}
          pattern={field === "ContactNumber" ? "[0-9]*" : undefined}
        />
        {fieldErrors[field] && <span className="text-red-500 text-xs">{fieldErrors[field]}</span>}
      </div>
    );
  };

  return (
    <>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl mx-4 sm:mx-auto overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Employee</h2>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input 
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setIsChecked(prev => !prev)}
                  className="w-4 h-4"
                />
                <span>Create account</span>
              </label>
              <button onClick={() => {
                resetForm();
                if (onClose) onClose();
              }} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
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
                  {fields.map(field => renderFormField(field))}
                </div>
              </div>
            ))}

            <div className="flex justify-end space-x-4 pt-4">
              <button 
                type="button" 
                onClick={() => {
                  resetForm();
                  if (onClose) onClose();
                }} 
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Add Employee"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEmployeeForm;