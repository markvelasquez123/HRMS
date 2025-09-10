import { useState } from "react";
import { User, Lock, Trash2, AlertTriangle, Save, Key } from "lucide-react";
import { auth } from "../../firebase";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [isModified, setIsModified] = useState(false);
  const [isPasswordModified, setIsPasswordModified] = useState(false);
  const [profile, setProfile] = useState({
    companyId: "",
    profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF6sEXfxDY05VteljJXDHwNlUYCrV4QAZAcA&s",
    firstName: "Marian",
    lastName: "Rivera",
    email: "Marian.rivera@email.com",
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showDeactivatePassword, setShowDeactivatePassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deactivateConfirmed, setDeactivateConfirmed] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [accountDeactivated, setAccountDeactivated] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfile((prev) => ({ ...prev, profilePic: imageData }));
        localStorage.setItem('userProfilePic', imageData);
        setIsModified(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (name === "oldPassword" || name === "newPassword" || name === "confirmPassword") {
      setIsPasswordModified(true);
    } else {
      setIsModified(true);
    }
  };

  const handleSaveChanges = () => {
    if (!profile.firstName || !profile.lastName || !profile.email) {
      alert("First Name, Last Name, and Email are required.");
      return;
    }
    alert("Profile updated successfully!");
    setIsModified(false);
  };

  const handleChangePassword = async () => {
    if (!profile.oldPassword || !profile.newPassword || !profile.confirmPassword) {
      toast.error("All password fields are required.");
      return;
    }
    if (profile.newPassword !== profile.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    if (profile.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("No user is currently signed in.");
        return;
      }

      
      const credential = EmailAuthProvider.credential(
        user.email,
        profile.oldPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, profile.newPassword);

      
      localStorage.setItem('lastPasswordChange', new Date().toISOString());

      
      setProfile(prev => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));

      toast.success("Password updated successfully!");
      setIsPasswordModified(false);
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.code === "auth/wrong-password") {
        toast.error("Current password is incorrect.");
      } else if (error.code === "auth/requires-recent-login") {
        toast.error("Please log out and log in again before changing your password.");
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    }
  };

  const handleDeactivateAccount = () => {
    if (window.confirm("Are you sure you want to deactivate your account?")) {
      setDeactivateConfirmed(true);
    }
  };

  const handleConfirmDeactivate = () => {
    if (profile.oldPassword === "") {
      alert("Please enter your password to deactivate your account.");
      return;
    }
    setAccountDeactivated(true);
    alert("Account deactivated successfully!");
    setShowDeactivatePassword(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setDeleteConfirmed(true);
    }
  };

  const handleConfirmDelete = () => {
    if (profile.oldPassword === "") {
      alert("Please enter your password to delete your account.");
      return;
    }
    setAccountDeleted(true);
    alert("Account deleted successfully!");
    setShowDeletePassword(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 p-6">
      {/* Sidebar */}
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

            
            <div className="text-center mb-8">
              <label htmlFor="fileInput" className="cursor-pointer group">
                <div className="relative inline-block">
                  <img
                    src={profile.profilePic}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 transition-all duration-300 group-hover:opacity-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-sm font-medium">Change Photo</span>
                  </div>
                </div>
              </label>
              <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>

            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Company ID</label>
                <input
                  type="text"
                  name="companyId"
                  value={profile.companyId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    placeholder="Enter current password"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            
            <div className="flex justify-end space-x-4">
              {isModified && !isPasswordModified && (
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              )}

              {isPasswordModified && (
                <button
                  onClick={handleChangePassword}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <Key className="w-5 h-5" />
                  <span>Change Password</span>
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "Delete Account" && !accountDeleted && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-2 mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800">Account Deactivation/Deletion</h2>
            </div>
            <p className="text-gray-600 mb-8">Choose to either temporarily deactivate your account or permanently delete it. Please note that account deletion cannot be undone.</p>

            <div className="space-y-6">
              
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Deactivate Account</h3>
                <p className="text-yellow-700 mb-4">Temporarily deactivate your account. You can reactivate it later by logging in.</p>
                {!deactivateConfirmed ? (
                  <button
                    onClick={handleDeactivateAccount}
                    className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 shadow-md hover:shadow-lg"
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
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg"
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

        
        {accountDeactivated && (
          <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg shadow-lg">
            Deactivated Successfully!
          </div>
        )}
        {accountDeleted && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg shadow-lg">
            Deleted Successfully!
          </div>
        )}
      </div>
    </div>
  );
}
