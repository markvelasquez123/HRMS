import React, { useEffect, useState } from "react";
import { Search, Eye, User, X, Mail, Phone, Briefcase, Building, Cake, MapPin, Calendar, ChevronDown, CreditCard } from "lucide-react";
import importExcel from "../../components/Excelimport/importExcel";
import { URL } from "../../constant.js";
const EmployeeSidebar = ({ employee, onClose, onStatusUpdate }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => { setVisible(true); }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const getAvatarDisplay = () => {
    if (employee?.ProfilePicture) {
      return <img 
        src={`http://${URL}/HRMSbackend/uploads/${employee.ProfilePicture}`}
        alt={`${employee.firstName} ${employee.lastName}`} 
        className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100 mx-auto"
        onError={(e) => {
        
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />;
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
      <div className={`bg-white w-full h-full shadow-2xl transform transition-transform duration-300 ${visible ? "translate-x-0" : "translate-x-full"}`}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Employee Details</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          <div className="p-6 space-y-6">
            <div className="text-center relative">
              {getAvatarDisplay()}
              
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 items-center justify-center ring-4 ring-gray-100 mx-auto hidden">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900">{employee.firstName} {employee.lastName}</h3>
                <p className="text-sm text-blue-600 font-medium mt-1">{employee.position}</p>
                <p className="text-sm text-gray-500">{employee.department}</p>
                <StatusDropdown 
                  employee={employee} 
                  onStatusUpdate={onStatusUpdate}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" />
                <span className="text-gray-900">{employee.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" />
                <span className="text-gray-900">{employee.phone}</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />Employment Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <CreditCard className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600">Employee ID</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{employee.employeeId || employee.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Building className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600">Type</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{employee.employeeType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Cake className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600">Hire Date</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{employee.dateHired}</span>
                </div>
              </div>
            </div>

            
            {(employee.birthDate || employee.gender) && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />Personal Information
                </h4>
                <div className="space-y-3">
                  {employee.birthDate && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-600">Birth Date</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{employee.birthDate}</span>
                    </div>
                  )}
                  {employee.gender && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-600">Gender</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{employee.gender}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

           
            {(employee.street1 || employee.street2 || employee.city || employee.state || employee.zip) && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />Address Information
                </h4>
                <div className="space-y-2 text-sm">
                  {employee.street1 && (
                    <div className="text-gray-900">{employee.street1}</div>
                  )}
                  {employee.street2 && (
                    <div className="text-gray-900">{employee.street2}</div>
                  )}
                  <div className="text-gray-900">
                    {[employee.city, employee.state, employee.zip].filter(Boolean).join(', ')}
                  </div>
                </div>
              </div>
            )}

            
            {(employee.resumeUrl || employee.created_at) && (
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-3">Additional Information</h4>
                <div className="space-y-3">
                  {employee.resumeUrl && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Resume</span>
                      <a 
                        href={employee.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Download
                      </a>
                    </div>
                  )}
                  {employee.passport && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Passport</span>
                      <a 
                        href={employee.passport} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Download
                      </a>
                    </div>
                  )}
                  {employee.diploma && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Diploma</span>
                      <a 
                        href={employee.diploma} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Download
                      </a>
                    </div>
                  )}
                  {employee.tor && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">TOR</span>
                      <a 
                        href={employee.tor} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Download
                      </a>
                    </div>
                  )}
                  {employee.medical && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Medical Certificate</span>
                      <a 
                        href={employee.medical} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Download
                      </a>
                    </div>
                  )}
                  {employee.tinId && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">TIN ID</span>
                      <a 
                        href={employee.tinId} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Download
                      </a>
                    </div>
                  )}
                  {employee.nbiClearance && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">NBI Clearance</span>
                      <a 
                        href={employee.nbiClearance} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Download
                      </a>
                    </div>
                  )}
                  {employee.policeClearance && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Police Clearance</span>
                      <a 
                        href={employee.policeClearance} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Download
                      </a>
                    </div>
                  )}
                  {employee.pagibigNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pag-Ibig Number</span>
                      <a 
                        href={employee.pagibigNumber} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Download
                      </a>
                    </div>
                  )}
                  {employee.philhealthNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">PhilHealth Number</span>
                      <a 
                        href={employee.philhealthNumber} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Download
                      </a>
                    </div>
                  )}
                  {employee.created_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Record Created</span>
                      <span className="text-sm font-medium text-gray-900">{new Date(employee.created_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const StatusDropdown = ({ employee, onStatusUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const statusOptions = [
    { value: 'On Process', label: 'On Process', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
    { value: 'Deployed', label: 'Deployed', color: 'text-green-700 bg-green-50 border-green-200' },
    { value: 'Repatriated', label: 'Repatriated', color: 'text-blue-700 bg-blue-50 border-blue-200' }
  ];

  const currentStatus = employee.status || 'On Process';
  const currentStatusConfig = statusOptions.find(option => option.value === currentStatus) || statusOptions[0];

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      const response = await fetch(`http://${URL}/HRMSbackend/statusofw.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          employeeId: employee.id,
          status: newStatus
        })
      });
;

      const result = await response.json();
      
      if (result.success) {
        onStatusUpdate(employee.id, newStatus);
        setIsOpen(false);
      } else {
        alert('Failed to update status: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Network error: Could not update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium transition-colors ${
          currentStatusConfig ? currentStatusConfig.color : 'text-gray-700 bg-gray-50 border-gray-200'
        } hover:opacity-80 disabled:opacity-50`}
      >
        {loading ? 'Updating...' : (currentStatus || 'No Status')}
        <ChevronDown className={`ml-2 w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  option.value === currentStatus ? 'font-medium' : ''
                }`}
              >
                <span className={`inline-block px-2 py-1 rounded text-xs ${option.color}`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const OverseasEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
     const res = await fetch(`http://${URL}/HRMSbackend/get_ofw.php`);
      const data = await res.json();

      if (data.success) {
        setEmployees(data.data);
        setError(null);
      } else {
        setError(data.error || "Failed to load data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  const handleStatusUpdate = (employeeId, newStatus) => {
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => 
        emp.id === employeeId 
          ? { ...emp, status: newStatus }
          : emp
      )
    );
    
    
    if (selectedEmployee && selectedEmployee.id === employeeId) {
      setSelectedEmployee(prevEmployee => ({
        ...prevEmployee,
        status: newStatus
      }));
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    return (
      employee.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  
  const getProfilePictureUrl = (employee) => {
    if (!employee.profilePicture) {
      return "https://via.placeholder.com/150";
    }
    
    
    if (employee.profilePicture.startsWith('http')) {
      return employee.profilePicture;
    }
    
    return `http://${URL}/HRMSbackend/uploads/${employee.profilePicture}`;
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading overseas employees...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
        <button 
          onClick={fetchEmployees}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
  const handleExport = () => {
    importExcel(filteredEmployees, 'Overseas_Employees');
  };

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-x-hidden">
      {selectedEmployee && (
        <EmployeeSidebar 
          employee={selectedEmployee} 
          onClose={() => setSelectedEmployee(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
      
      <div className="p-6 text-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Overseas Filipino Workers</h2>
          <div className="relative">
            <button className="bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg" 
              onClick={handleExport}>
              Export Excel File
            </button>
            <input 
              type="text" 
              placeholder="Search employees..." 
              className="border border-gray-300 p-2 pl-10 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-50" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          </div>
        </div>

        <div className="overflow-x-auto mt-6 bg-white rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Picture", "Employee ID", "Name", "Position", "Email", "Phone", "Date Hired"].map(header => (
                  <th key={header} className={`px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider ${header === "Action" ? "text-right" : "text-left"}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee, index) => (
                <tr key={employee.id || index} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                    onClick={() => setSelectedEmployee(employee)}
                    title={`Click to view details of ${employee.firstName} ${employee.lastName}`}
                    >
                  <td className="px-6 py-4">
                    <img 
                      src={getProfilePictureUrl(employee)} 
                      alt={`${employee.firstName} ${employee.lastName}`} 
                      className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                      onLoad={(e) => {
                        console.log('Table image loaded:', e.target.src);
                      }}
                      onError={(e) => {
                        console.log('Table image failed to load:', e.target.src);
                        console.log('Error details:', e);
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{employee.employeeId || employee.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{employee.firstName} {employee.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{employee.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{employee.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{employee.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{employee.dateHired}</div>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && !loading && (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500 italic">
                    {searchQuery ? "No employees found matching your search." : "No overseas employee records found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {employees.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Showing {filteredEmployees.length} of {employees.length} overseas employees
          </div>
        )}
      </div>
    </div>
  );
};

export default OverseasEmployees;