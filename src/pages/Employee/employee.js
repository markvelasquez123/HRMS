import React, { useState, useEffect } from "react";
import { X, User, Phone, Mail, MapPin, Cake, Briefcase, Building, FileText, CreditCard, Search, AlertCircle } from "lucide-react";
import ExcelImport from "../../components/Excelimport/importExcel";
import EditEmployeeModal from "../../components/employee/EditEmployee"; 
import AddEmployee from "../../components/employee/AddEmployeeForm"

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
  const [currentEmployee, setCurrentEmployee] = useState(employee);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => { 
    setVisible(true); 
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const getAvatarDisplay = () => {
    if (currentEmployee?.ProfilePicture) {
      return (
        <img
          src={`http://localhost/HRMSbackend/uploads/${currentEmployee.ProfilePicture}`}
          alt={`${currentEmployee.FirstName} ${currentEmployee.LastName}`}
          className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100 mx-auto"
        />
      );
    }
    return (
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center ring-4 ring-gray-100 mx-auto">
        <User className="w-8 h-8 text-blue-600" />
      </div>
    );
  };

  if (!currentEmployee) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
      <div className={`bg-white w-full h-full shadow-2xl transform transition-transform duration-300 ${visible ? "translate-x-0" : "translate-x-full"}`}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Details</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit
            </button>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          <div className="p-6 space-y-6">
            <div className="text-center">
              {getAvatarDisplay()}
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900">{currentEmployee.FirstName} {currentEmployee.LastName}</h3>
                <p className="text-sm text-blue-600 font-medium mt-1">{currentEmployee.Position}</p>
                <p className="text-sm text-gray-500">{currentEmployee.Department}</p>
                <div className="inline-block px-3 py-1 mt-3 rounded-full border bg-green-50 text-green-700 border-green-200 text-sm font-medium">Active</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
              <div className="flex items-center text-sm"><Mail className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" /><span className="text-gray-900">{currentEmployee.EmailAddress}</span></div>
              <div className="flex items-center text-sm"><Phone className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" /><span className="text-gray-900">{currentEmployee.ContactNumber}</span></div>
              <div className="flex items-start text-sm">
                <MapPin className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-900 leading-relaxed">{currentEmployee.HomeAddress}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-2"><Cake className="w-4 h-4 text-blue-600 mr-2" /><span className="text-sm font-medium text-blue-900">Birth Date</span></div>
                <span className="text-sm text-blue-800">{currentEmployee.Birthdate}</span>
              </div>
              {currentEmployee.Gender && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center mb-2"><User className="w-4 h-4 text-purple-600 mr-2" /><span className="text-sm font-medium text-purple-900">Gender</span></div>
                  <span className="text-sm text-purple-800">{currentEmployee.Gender}</span>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center"><Briefcase className="w-4 h-4 mr-2" />Employment Information </h4>
              <div className="space-y-3">
                {[
                  { icon: CreditCard, label: "Employee ID", value: currentEmployee.IDNumber },
                  { icon: Building, label: "Type", value: currentEmployee.EmployeeType },
                  { icon: Briefcase, label: "Company", value: currentEmployee.Company },
                  { icon: Briefcase, label: "Passport", value: `${currentEmployee.Passport}`, className: "text-green-600" },
                  { icon: Cake, label: "Hire Date", value: currentEmployee.DateHired }
                ].map(({ icon: Icon, label, value, className = "text-gray-900" }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center text-sm"><Icon className="w-4 h-4 text-gray-500 mr-2" /><span className="text-gray-600">{label}</span></div>
                    <span className={`text-sm font-medium ${className}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {currentEmployee.ResumeFile && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center"><FileText className="w-4 h-4 mr-2" />Documents</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <a href={`http://localhost/HRMSbackend/uploads/${currentEmployee.ResumeFile}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                    <FileText className="w-4 h-4 mr-2 flex-shrink-0" />View Resume
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditEmployeeModal
          employee={currentEmployee}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedData) => {
            setCurrentEmployee((prev) => ({ ...prev, ...updatedData }));
          }}
        />
      )}
    </div>
  );
};

const EmployeePage = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [currentOrg, setCurrentOrg] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const departments = ["PMS", "Accounting", "Technical", "Admin", "Utility", "HR", "IT", "Marketing", "Engineering", "Architect", "Operation", "Director"];
  const companysort = ["ASIANAVIS", "RIGEL", "PEAKHR"];

 
  useEffect(() => {
    const checkSessionStorage = () => {
      const userDataString = sessionStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const userCompany = userData.Company;

        let orgPrefix = '';
        if (userCompany === 'Rigel') {
          orgPrefix = 'RGL';
        } else if (userCompany === 'Asia Navis') {
          orgPrefix = 'ASN';
        } else if (userCompany === 'PeakHR') {
          orgPrefix = 'PHR';
        }

        if (orgPrefix !== currentOrg) {
          console.log("Organization changed to:", orgPrefix);
          setCurrentOrg(orgPrefix);
        }
      }
    };

    checkSessionStorage();
    const interval = setInterval(checkSessionStorage, 1);
    return () => clearInterval(interval);
  }, [currentOrg]);


  useEffect(() => {
    if (currentOrg) {
      loadEmployees();
    }
  }, [currentOrg]);

  const loadEmployees = async () => {
    if (!currentOrg) {
      console.warn("No organization set, skipping employee load");
      return;
    }

    try {
      const response = await fetch(`http://localhost/HRMSbackend/test.php?action=get&org=${currentOrg}`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }
      
      const employees = await response.json();
      console.log(`Loaded ${employees.length} employees for ${currentOrg}`);
      setEmployeeList(employees);
    } catch (error) {
      console.error("Error loading employees:", error);
      setError("Failed to load employees: " + error.message);
    }
  };

  const filteredEmployees = employeeList.filter((employee) => {
    return (
      (employee.FirstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.LastName?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedDepartment === "" || employee.Department === selectedDepartment) &&
      (selectedCompany === "" || employee.Company === selectedCompany)
    );
  });

  const handleExport = () => {
    let datatoexport;
    if (selectedDepartment && selectedCompany) {
      datatoexport = employeeList.filter(
        (employee) => employee.Department === selectedDepartment
      );
    } else {
      datatoexport = employeeList;
    }
    ExcelImport(datatoexport, "Employee List" + (selectedDepartment ? ` - ${selectedDepartment}` : ''));
  };

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-x-hidden">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      {selectedEmployee && <EmployeeSidebar employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />}
      {showAddForm && (
        <AddEmployee 
          onClose={() => setShowAddForm(false)}
          onSuccess={() => loadEmployees()} 
        />
      )}
      
      <div className="p-6 text-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>
          <div className="flex items-center gap-4">
            <select className="border border-gray-300 p-2 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-200" 
              value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
              <option value="">Departments</option>
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            <select className="border border-gray-300 p-2 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-200"
              value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
              <option value="">Company</option>
              {companysort.map(comp => <option key={comp} value={comp}>{comp}</option>)}
            </select>

            <button className="bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              onClick={handleExport}>
              Export Excel File
            </button>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg" 
              onClick={() => setShowAddForm(true)}
            >
              + Add Employee
            </button>
            <div className="relative">
              <input type="text" placeholder="Name" 
                className="border border-gray-300 p-2 pl-10 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-200" 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mt-6 bg-white rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Picture", "Employee ID", "Name", "Department", "Employee Type", "Company", "Position", "Passport", "Date Hired"].map(header => (
                  <th key={header} className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee, index) => (
                <tr 
                  key={employee.id || index} 
                  className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => setSelectedEmployee(employee)}
                  title={`Click to view ${employee.FirstName} ${employee.LastName}'s details`}
                >
                  <td className="px-6 py-4">
                    <img src={employee.ProfilePicture ? `http://localhost/HRMSbackend/uploads/${employee.ProfilePicture}` : "https://via.placeholder.com/150"} 
                      alt={`${employee.FirstName} ${employee.LastName}`} className="h-12 w-12 rounded-full object-cover border-2 border-gray-200" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{employee.IDNumber}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{employee.FirstName} {employee.LastName}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{employee.Department}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{employee.EmployeeType}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{employee.Company}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{employee.PositionApplied}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{employee.Passport}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{employee.DateHired}</div></td>
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