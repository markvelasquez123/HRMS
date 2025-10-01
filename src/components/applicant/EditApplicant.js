import React, { useState } from "react";
import { X, User, Mail, Phone, MapPin, Briefcase, Cake } from "lucide-react";

const EditApplicantModal = ({ applicant, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    FirstName: applicant?.FirstName || "",
    MiddleName: applicant?.MiddleName || "",
    LastName: applicant?.LastName || "",
    EmailAddress: applicant?.EmailAddress || "",
    ContactNumber: applicant?.ContactNumber || "",
    HomeAddress: applicant?.HomeAddress || "",
    BirthDate: applicant?.BirthDate || "",
    Gender: applicant?.Gender || "",
    PositionApplied: applicant?.PositionApplied || "",
  });
  
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const handleSubmit = async () => {
    if (!formData.FirstName || !formData.LastName || !formData.EmailAddress || 
        !formData.ContactNumber || !formData.HomeAddress || !formData.BirthDate || 
        !formData.Gender || !formData.PositionApplied) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost/HRMSbackend/update_applicant.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          originalEmail: applicant.EmailAddress,
          ...formData
        })
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update applicant');
      }

      alert("Applicant information updated successfully!");
      
      if (onUpdate) {
        onUpdate(formData);
      }
      
      window.dispatchEvent(new CustomEvent("refreshApplicants"));
      handleClose();
    } catch (error) {
      console.error("Error updating applicant:", error);
      alert(`Failed to update applicant: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
        visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
      }`}>
        
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Edit Applicant Information</h2>
          <button 
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  First Name *
                </label>
                <input
                  type="text"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="First Name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Middle Name
                </label>
                <input
                  type="text"
                  name="MiddleName"
                  value={formData.MiddleName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Middle Name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Last Name *
                </label>
                <input
                  type="text"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="EmailAddress"
                value={formData.EmailAddress}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Contact Number *
              </label>
              <input
                type="tel"
                name="ContactNumber"
                value={formData.ContactNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="+63 XXX XXX XXXX"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Home Address *
              </label>
              <textarea
                name="HomeAddress"
                value={formData.HomeAddress}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Complete Address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Cake className="w-4 h-4 mr-2" />
                  Birth Date *
                </label>
                <input
                  type="date"
                  name="BirthDate"
                  value={formData.BirthDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Gender *
                </label>
                <select
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Position Applied *
              </label>
              <input
                type="text"
                name="PositionApplied"
                value={formData.PositionApplied}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Position"
              />
            </div>

          </div>
        </div>

        <div className="border-t bg-gray-50 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditApplicantModal;