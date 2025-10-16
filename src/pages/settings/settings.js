import { useState } from "react";
import { User, Lock, Trash2, AlertTriangle, Save, Key } from "lucide-react";
import { URL } from "../../constant";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [isModified, setIsModified] = useState(false);
  const [isPasswordModified, setIsPasswordModified] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCompanyId, setVerificationCompanyId] = useState("");
  const [profile, setProfile] = useState({
    companyId: "",
    firstName: "",
    lastName: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [deactivateConfirmed, setDeactivateConfirmed] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const API_URL = `http://${URL}/HRMSbackend/settings.php`;

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleVerifyCompanyId = async () => {
    if (!verificationCompanyId.trim()) {
      showToast("Please enter your Company ID", "error");
      return;
    }

    try {
      console.log("🔍 Verifying Company ID:", verificationCompanyId);
      
      const response = await fetch(`${API_URL}?action=verifyCompanyId`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: verificationCompanyId
        })
      });

      const data = await response.json();
      console.log("Verification response:", data);

      if (data.success) {
        setIsVerified(true);
        showToast("Company ID verified! Loading your profile...", "success");
        // Fetch profile after successful verification
        fetchProfile(verificationCompanyId);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      console.error("Error verifying Company ID:", error);
      showToast("Error verifying Company ID", "error");
    }
  };

  const fetchProfile = async (companyIdToFetch) => {
    const companyIdParam = companyIdToFetch || verificationCompanyId;
    
    if (!companyIdParam) {
      console.log("⏳ No Company ID provided for fetching profile");
      return;
    }

    try {
      console.log("📡 Fetching profile for Company ID:", companyIdParam);
      
      const response = await fetch(`${API_URL}?action=getProfile&companyId=${companyIdParam}`);
      const data = await response.json();
      
      console.log("📥 Profile response:", data);
      
      if (data.success) {
        setProfile(prev => ({
          ...prev,
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          email: data.data.email,
          companyId: data.data.companyId
        }));
        console.log("✓ Profile loaded successfully");
      } else {
        console.error("❌ Profile fetch failed:", data.message);
        showToast(data.message, "error");
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      showToast("Error fetching profile data", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (name === "oldPassword" || name === "newPassword" || name === "confirmPassword") {
      setIsPasswordModified(true);
      setIsModified(false);
    } else {
      setIsModified(true);
      setIsPasswordModified(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!isVerified) {
      showToast("Please verify your Company ID first.", "error");
      return;
    }

    if (!profile.firstName || !profile.lastName || !profile.email) {
      showToast("First Name, Last Name, and Email are required.", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}?action=updateProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: verificationCompanyId,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          newCompanyId: profile.companyId
        })
      });

      const data = await response.json();

      if (data.success) {
        showToast("Profile updated successfully!", "success");
        setIsModified(false);
        // If company ID was changed, require re-verification
        if (profile.companyId !== verificationCompanyId) {
          setVerificationCompanyId(profile.companyId);
          setIsVerified(false);
          showToast("Company ID changed. Please verify again to continue editing.", "info");
        }
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Error updating profile", "error");
    }
  };

  const handleChangePassword = async () => {
    if (!isVerified) {
      showToast("Please verify your Company ID first.", "error");
      return;
    }

    if (!profile.oldPassword || !profile.newPassword || !profile.confirmPassword) {
      showToast("All password fields are required.", "error");
      return;
    }
    if (profile.newPassword !== profile.confirmPassword) {
      showToast("New password and confirm password do not match.", "error");
      return;
    }
    if (profile.newPassword.length < 6) {
      showToast("New password must be at least 6 characters long.", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}?action=changePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: verificationCompanyId,
          oldPassword: profile.oldPassword,
          newPassword: profile.newPassword,
          confirmPassword: profile.confirmPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setProfile(prev => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
        showToast("Password updated successfully!", "success");
        setIsPasswordModified(false);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Error updating password", "error");
    }
  };

  const handleDeactivateAccount = () => {
    if (window.confirm("Are you sure you want to deactivate your account?")) {
      setDeactivateConfirmed(true);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!isVerified) {
      showToast("Please verify your Company ID first.", "error");
      return;
    }

    if (!profile.oldPassword) {
      showToast("Please enter your password to deactivate your account.", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}?action=deactivateAccount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: verificationCompanyId,
          password: profile.oldPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        showToast("Account deactivated successfully!", "success");
        setDeactivateConfirmed(false);
        setProfile(prev => ({ ...prev, oldPassword: "" }));
        setTimeout(() => {
          window.location.href = "/login"; 
        }, 2000);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Error deactivating account", "error");
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setDeleteConfirmed(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!isVerified) {
      showToast("Please verify your Company ID first.", "error");
      return;
    }

    if (!profile.oldPassword) {
      showToast("Please enter your password to delete your account.", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}?action=deleteAccount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: verificationCompanyId,
          password: profile.oldPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        showToast("Account deleted successfully!", "success");
        setDeleteConfirmed(false);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Error deleting account", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 p-6">
      {toast.show && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          toast.type === "success" ? "bg-green-100 border border-green-400 text-green-700" :
          toast.type === "error" ? "bg-red-100 border border-red-400 text-red-700" :
          "bg-blue-100 border border-blue-400 text-blue-700"
        }`}>
          {toast.message}
        </div>
      )}

      <div className="w-1/4 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Settings</h2>
        <ul className="space-y-2">
          {[
            { id: "account", icon: User, label: "Account Settings" },
            { id: "Delete Account", icon: Trash2, label: "Delete Account" }
          ].map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 bg-white p-8 ml-6 rounded-xl shadow-lg">
        {activeTab === "account" && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Settings</h2>
            <p className="text-gray-600 mb-8">Manage your profile information and account settings.</p>

            {!isVerified ? (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800">Verify Your Identity</h3>
                </div>
                <p className="text-blue-700 mb-4">
                  Please enter your Company ID from the signup table to access and edit your profile data.
                </p>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Enter your Company ID (IDNumber)"
                    value={verificationCompanyId}
                    onChange={(e) => setVerificationCompanyId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleVerifyCompanyId()}
                    className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleVerifyCompanyId}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Verify
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-8">
                <p className="text-green-700 font-medium">
                  ✓ Company ID verified! You can now edit your profile. 
                  <span className="text-sm ml-2">(Verified ID: {verificationCompanyId})</span>
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  disabled={!isVerified}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  disabled={!isVerified}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Company ID</label>
                <input
                  type="text"
                  name="companyId"
                  value={profile.companyId}
                  onChange={handleChange}
                  disabled={!isVerified}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isVerified}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Lock className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={profile.oldPassword}
                    placeholder="Enter current password"
                    onChange={handleChange}
                    disabled={!isVerified}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={profile.newPassword}
                    placeholder="Enter new password"
                    onChange={handleChange}
                    disabled={!isVerified}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={profile.confirmPassword}
                    placeholder="Confirm new password"
                    onChange={handleChange}
                    disabled={!isVerified}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              {isModified && !isPasswordModified && (
                <button
                  onClick={handleSaveChanges}
                  disabled={!isVerified}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              )}

              {isPasswordModified && (
                <button
                  onClick={handleChangePassword}
                  disabled={!isVerified}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Key className="w-5 h-5" />
                  <span>Change Password</span>
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "Delete Account" && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-2 mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800">Account Deactivation/Deletion</h2>
            </div>
            <p className="text-gray-600 mb-8">Choose to either temporarily deactivate your account or permanently delete it. Please note that account deletion cannot be undone.</p>

            {!isVerified ? (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800">Verify Your Identity</h3>
                </div>
                <p className="text-blue-700 mb-4">
                  Please enter your Company ID to verify your identity before deactivating or deleting your account.
                </p>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Enter your Company ID (IDNumber)"
                    value={verificationCompanyId}
                    onChange={(e) => setVerificationCompanyId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleVerifyCompanyId()}
                    className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleVerifyCompanyId}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Verify
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-8">
                <p className="text-green-700 font-medium">
                  ✓ Company ID verified! You can now proceed with account actions. 
                  <span className="text-sm ml-2">(Verified ID: {verificationCompanyId})</span>
                </p>
              </div>
            )}

            <div className="space-y-6">
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Deactivate Account</h3>
                <p className="text-yellow-700 mb-4">Temporarily deactivate your account. You can reactivate it later by logging in.</p>
                {!deactivateConfirmed ? (
                  <button
                    onClick={handleDeactivateAccount}
                    disabled={!isVerified}
                    className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Deactivate Account
                  </button>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="password"
                      name="oldPassword"
                      placeholder="Enter your password to confirm"
                      value={profile.oldPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      onClick={handleConfirmDeactivate}
                      className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      Confirm Deactivation
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-4">Delete Account</h3>
                <p className="text-red-700 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                {!deleteConfirmed ? (
                  <button
                    onClick={handleDeleteAccount}
                    disabled={!isVerified}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="password"
                      name="oldPassword"
                      placeholder="Enter your password to confirm"
                      value={profile.oldPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      onClick={handleConfirmDelete}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      Confirm Deletion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}