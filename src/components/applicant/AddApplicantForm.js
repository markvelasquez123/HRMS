import React, { useState, useReducer } from "react";
import { X, AlertCircle } from "lucide-react";
import { URL } from "../../constant.js"
const initialFormState = {
  FirstName: "",
  MiddleName: "",
  LastName: "",
  Gender: "",
  BirthDate: "",
  PositionApplied: "",
  EmailAddress: "",
  ContactNumber: "",
  HomeAddress: "",
  Company: "",
  ProfilePicture: null,
  Resume: null,
  Passport: null,
  Diploma: null,
  Tor: null,
  Medical: null,
  TinID: null,
  NBIClearance: null,
  PoliceClearance: null,
  PagIbig: null,
  PhilHealth: null
};

function formReducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "UPDATE_FILE":
      return { ...state, [action.field]: action.file };
    case "RESET":
      return initialFormState;
    default:
      return state;
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

const AddApplicantForm = ({ onClose, onSuccess }) => {
  const [formData, dispatch] = useReducer(formReducer, initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    if ((name === "FirstName" || name === "LastName" || name === "PositionApplied") && value && !isOnlyLetters(value)) {
      error = "Only letters are allowed.";
    }

    setFieldErrors((prev) => ({ ...prev, [name]: error }));
    if (!error) {
      dispatch({ type: "UPDATE_FIELD", field: name, value });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      dispatch({ type: "UPDATE_FILE", field: name, file: files[0] });
    } else {
      dispatch({ type: "UPDATE_FILE", field: name, file: null });
    }
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
    const requiredFields = ["FirstName", "LastName", "BirthDate", "PositionApplied", "EmailAddress", "ContactNumber", "Gender", "HomeAddress", "Company"];
    
    const allFieldsValid = requiredFields.every((field) => {
      if (field === "BirthDate") {
        const dateValue = formData[field];
        return dateValue && !isNaN(new Date(dateValue).getTime());
      }
      if (field === "ContactNumber" && !/^\d+$/.test(formData[field])) return false;
      if ((field === "FirstName" || field === "LastName" || field === "PositionApplied") && !isOnlyLetters(formData[field])) return false;
      return formData[field] && formData[field].toString().trim() !== "";
    });

    return allFieldsValid && isAtLeast18(formData.BirthDate);
  };

  const resetForm = () => {
    dispatch({ type: "RESET" });
    setFieldErrors({});
    setError(null);
    setSuccess(null);
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => input.value = '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      const requiredFields = ["FirstName", "LastName", "BirthDate", "PositionApplied", "EmailAddress", "ContactNumber", "Gender", "HomeAddress", "Company"];
      const missingFields = requiredFields.filter(
        (field) => !formData[field] || formData[field].toString().trim() === ""
      );

      if (missingFields.length > 0) {
        const fieldNames = missingFields.map((f) => {
          const labelMap = {
            FirstName: "First Name",
            LastName: "Last Name",
            BirthDate: "Birth Date",
            PositionApplied: "Position Applied",
            ContactNumber: "Contact Number",
            EmailAddress: "Email Address",
            HomeAddress: "Home Address",
            Gender: "Gender",
            Company: "Company"
          };
          return labelMap[f] || f;
        }).join(", ");
        setError(`Missing required fields: ${fieldNames}`);
      } else if (!isAtLeast18(formData.BirthDate)) {
        setError("Applicant must be at least 18 years old.");
      } else if (!/^\d+$/.test(formData.ContactNumber)) {
        setError("Contact Number must contain only numbers.");
      } else if (!isOnlyLetters(formData.FirstName)) {
        setError("First Name must contain only letters.");
      } else if (!isOnlyLetters(formData.LastName)) {
        setError("Last Name must contain only letters.");
      } else if (!isOnlyLetters(formData.PositionApplied)) {
        setError("Position must contain only letters.");
      } else {
        setError("Please fill in all required fields correctly.");
      }
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const submitFormData = new FormData();
    
    const textFields = ["FirstName", "MiddleName", "LastName", "Gender", "BirthDate", "EmailAddress", "ContactNumber", "HomeAddress", "PositionApplied", "Company"];
    textFields.forEach((key) => {
      submitFormData.append(key, formData[key] || "");
    });

    const fileFields = ["ProfilePicture", "Resume", "Passport", "Diploma", "Tor", "Medical", "TinID", "NBIClearance", "PoliceClearance", "PagIbig", "PhilHealth"];
    fileFields.forEach((key) => {
      if (formData[key]) {
        submitFormData.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(`http://${URL}/HRMSbackend/applicant.php`, {
        method: "POST",
        body: submitFormData,
      });

      if (!response.ok) {
        let errorBody = "Unknown server error.";
        const errorContentType = response.headers.get("content-type");
        if (errorContentType && errorContentType.startsWith("application/json")) {
          const errorResult = await response.json();
          errorBody = errorResult.message || errorResult.error || `Server error: ${response.status}`;
        } else {
          errorBody = await response.text();
        }
        throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorBody}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.startsWith("application/json")) {
        const result = await response.json();
        if (result.success) {
          setSuccess("Application submitted successfully!");
          resetForm();
          if (onSuccess) onSuccess();
          if (onClose) onClose();
        } else {
          setError(result.message || result.error || "Unknown error occurred during submission.");
        }
      } else {
        const text = await response.text();
        console.error("Unexpected non-JSON response received:", text);
        setError(`Unexpected response from server. Check console for details.`);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(`Error submitting form: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const renderTextField = (field, label, isRequired = true, type = "text") => {
    const commonProps = {
      name: field,
      value: formData[field] || "",
      onChange: handleChange,
      className: "w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      type: type
    };

    if (type === "tel") {
      commonProps.inputMode = "numeric";
      commonProps.pattern = "[0-9]*";
    }

    return (
      <div key={field} className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <input {...commonProps} />
        {fieldErrors[field] && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors[field]}</p>
        )}
      </div>
    );
  };

  const renderFileField = (field, label) => (
    <div key={field} className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        name={field}
        onChange={handleFileChange}
        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
      {formData[field] && (
        <span className="text-green-600 text-xs">Selected: {formData[field].name}</span>
      )}
    </div>
  );

  return (
    <>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => { resetForm(); if (onClose) onClose(); }}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
            Add New Applicant
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <h3 className="col-span-full font-semibold text-lg border-b pb-2">
                Personal Information
              </h3>
              {renderFileField("ProfilePicture", "Profile Picture")}
              {renderTextField("FirstName", "First Name")}
              {renderTextField("MiddleName", "Middle Name", false)}
              {renderTextField("LastName", "Last Name")}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Company <span className="text-red-500">*</span>
                </label>
                <select
                  name="Company"
                  value={formData.Company}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Company</option>
                  <option value="Asia Navis">Asia Navis</option>
                  <option value="PeakHR">PeakHR</option>
                  <option value="Rigel">Rigel</option>
                </select>
              </div>
              {renderTextField("BirthDate", "Birth Date", true, "date")}
              {renderTextField("PositionApplied", "Position Applied")}
              {renderTextField("EmailAddress", "Email Address", true, "email")}
              {renderTextField("ContactNumber", "Contact Number", true, "tel")}
              {renderTextField("HomeAddress", "Home Address")}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <h3 className="col-span-full font-semibold text-lg border-b pb-2">
                Requirements
              </h3>
              {renderFileField("Resume", "Resume")}
              {renderFileField("Passport", "Passport")}
              {renderFileField("Diploma", "Diploma")}
              {renderFileField("Tor", "Transcript of Records")}
              {renderFileField("Medical", "Medical Certificate")}
              {renderFileField("TinID", "TIN ID")}
              {renderFileField("NBIClearance", "NBI Clearance")}
              {renderFileField("PoliceClearance", "Police Clearance")}
              {renderFileField("PagIbig", "Pag-Ibig Certificate")}
              {renderFileField("PhilHealth", "PhilHealth Certificate")}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => { resetForm(); if (onClose) onClose(); }}
                className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className={`font-bold py-2 px-4 rounded-lg transition-colors duration-200 ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddApplicantForm;