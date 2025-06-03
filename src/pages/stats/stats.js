import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ApplicantCharts() {
  const [applicantCount, setApplicantCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [resignedCount, setResignedCount] = useState(0);
  const [employeeData, setemployeeData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [retentionData, setRetentionData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [q1Hires, setQ1Hires] = useState(0);
  const [q2Hires, setQ2Hires] = useState(0);
  const [q3Hires, setQ3Hires] = useState(0);
  const [q4Hires, setQ4Hires] = useState(0);
  const [q1Resigned, setQ1Resigned] = useState(0);
  const [q2Resigned, setQ2Resigned] = useState(0);
  const [q3Resigned, setQ3Resigned] = useState(0);
  const [q4Resigned, setQ4Resigned] = useState(0);
  const [employeeList, setEmployeeList] = useState([]);
  const [poolData, setPoolData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [removedEmployees, setRemovedEmployees] = useState([]);

  // Function to fetch employees from your employee.php backend
  const fetchEmployeesFromBackend = async () => {
    try {
      const response = await fetch('http://localhost/QMS-ASIANAVIS/backend/employee.php?action=get');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }
      
      const employees = await response.json();
      return employees;
    } catch (error) {
      console.error("Error fetching employees from backend:", error);
      // Return mock data if backend fails
      return [
        { 
          id: 1, 
          employeeType: 'Regular', 
          Department: 'IT', 
          hireDate: '2025-01-15',
          FirstName: 'John',
          LastName: 'Doe'
        },
        { 
          id: 2, 
          employeeType: 'Project-Based', 
          Department: 'Engineering', 
          hireDate: '2025-02-20',
          FirstName: 'Jane',
          LastName: 'Smith'
        },
        { 
          id: 3, 
          employeeType: 'Probationary', 
          Department: 'HR', 
          hireDate: '2025-04-10',
          FirstName: 'Bob',
          LastName: 'Johnson'
        },
        { 
          id: 4, 
          employeeType: 'Regular', 
          Department: 'Marketing', 
          hireDate: '2025-03-05',
          FirstName: 'Alice',
          LastName: 'Brown'
        },
        { 
          id: 5, 
          employeeType: 'Project-Based', 
          Department: 'Accounting', 
          hireDate: '2025-05-12',
          FirstName: 'Charlie',
          LastName: 'Wilson'
        },
        { 
          id: 6, 
          employeeType: 'Probationary', 
          Department: 'Technical', 
          hireDate: '2025-07-08',
          FirstName: 'Diana',
          LastName: 'Davis'
        },
        { 
          id: 7, 
          employeeType: 'Regular', 
          Department: 'IT', 
          hireDate: '2025-06-15',
          FirstName: 'Eve',
          LastName: 'Miller'
        },
        { 
          id: 8, 
          employeeType: 'Regular', 
          Department: 'Engineering', 
          hireDate: '2025-08-20',
          FirstName: 'Frank',
          LastName: 'Garcia'
        }
      ];
    }
  };

  const fetchPoolData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "http://localhost/QMS-ASIANAVIS/backend/get_pool_data.php",
        {
          method: 'GET',
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch pool data");
      if (!Array.isArray(data.data)) throw new Error("Invalid response format from server");

      const poolRecords = data.data.map(record => ({
        uid: record.id || record.uid || Math.random().toString(),
        name: record.name || 'N/A',
        position: record.position || 'N/A',
        department: record.department || 'N/A',
        phone: record.phone || 'N/A',
        status: record.status || 'N/A',
        resignedAt: record.resigned_date,
        created_at: record.created_at,
        updated_at: record.updated_at
      }));

      setPoolData(poolRecords);
      console.log("Pool data loaded:", poolRecords.length, "records");
      
    } catch (error) {
      console.error("Error fetching pool data:", error);
      setError(error.message || "Failed to fetch pool data");
      
      const mockPoolData = [
        { uid: '1', status: 'Accepted', department: 'IT', resignedAt: null },
        { uid: '2', status: 'Rejected', department: 'HR', resignedAt: null },
        { uid: '3', status: 'Resigned', department: 'Engineering', resignedAt: '2025-02-15' },
        { uid: '4', status: 'Accepted', department: 'Marketing', resignedAt: null },
        { uid: '5', status: 'Resigned', department: 'IT', resignedAt: '2025-04-20' },
      ];
      setPoolData(mockPoolData);
    } finally {
      setLoading(false);
    }
  };

  const getRetentionData = () => {
    const baseData = [
      { year: 2021, rate: 25, employees: 120, turnover: 15 },
      { year: 2022, rate: 30, employees: 135, turnover: 18 },
      { year: 2023, rate: 35, employees: 150, turnover: 12 },
      { year: 2024, rate: 40, employees: 165, turnover: 10 }
    ];

    const totalHires2025 = q1Hires + q2Hires + q3Hires + q4Hires;
    const totalResigned2025 = q1Resigned + q2Resigned + q3Resigned + q4Resigned;
    const retentionRate2025 = totalHires2025 > 0 ? Math.round((totalResigned2025 / totalHires2025) * 100) : 0;

    baseData.push({
      year: 2025,
      rate: totalHires2025,
      employees: retentionRate2025,
      turnover: totalResigned2025
    });

    if (new Date().getFullYear() >= 2026) {
      baseData.push({ year: 2026, rate: 50, employees: 195, turnover: 6 });
    }

    return baseData;
  };

  const countQuarterlyData = (employees, year, quarter) => {
    const qStart = quarter * 3 - 3;
    const qEnd = quarter * 3 - 1;
    return employees.filter(employee => {
      if (!employee.hireDate) return false;
      const hireDate = new Date(employee.hireDate);
      return hireDate.getFullYear() === year && 
             hireDate.getMonth() >= qStart && 
             hireDate.getMonth() <= qEnd;
    });
  };

  const countResignedQuarterly = (quarter) => {
    const qStart = quarter * 3 - 3;
    const qEnd = quarter * 3 - 1;
    return poolData.filter(employee => {
      if (!employee.resignedAt || employee.status !== "Resigned") return false;
      const resignDate = new Date(employee.resignedAt);
      return resignDate.getFullYear() === 2025 && 
             resignDate.getMonth() >= qStart && 
             resignDate.getMonth() <= qEnd;
    });
  };

  const fetchEmployees = async () => {
    try {
      // Fetch employees from your backend
      const backendEmployees = await fetchEmployeesFromBackend();
      
      const activeEmployees = backendEmployees.filter(employee => 
        !removedEmployees.includes(employee.id?.toString() || employee.uid)
      );
      
      setEmployeeList(activeEmployees);

      // Count quarterly hires (using backend data structure)
      const q1List = countQuarterlyData(activeEmployees, 2025, 1);
      const q2List = countQuarterlyData(activeEmployees, 2025, 2);
      const q3List = countQuarterlyData(activeEmployees, 2025, 3);
      const q4List = countQuarterlyData(activeEmployees, 2025, 4);
      
      setQ1Hires(q1List.length);
      setQ2Hires(q2List.length);
      setQ3Hires(q3List.length);
      setQ4Hires(q4List.length);

      // Count quarterly resignations
      setQ1Resigned(countResignedQuarterly(1).length);
      setQ2Resigned(countResignedQuarterly(2).length);
      setQ3Resigned(countResignedQuarterly(3).length);
      setQ4Resigned(countResignedQuarterly(4).length);

      // Count employees by type for chart
      const employeeTypeCounts = {
        Regular: 0,
        'Project-Based': 0,
        Probationary: 0
      };

      activeEmployees.forEach(employee => {
        const type = employee.employeeType;
        if (type === 'Regular') {
          employeeTypeCounts.Regular++;
        } else if (type === 'Project-Based' || type === 'Project Based') {
          employeeTypeCounts['Project-Based']++;
        } else if (type === 'Probationary') {
          employeeTypeCounts.Probationary++;
        }
      });

      // Set employee data for chart
      setemployeeData([
        { name: "Regular", count: employeeTypeCounts.Regular },
        { name: "Project Based", count: employeeTypeCounts['Project-Based'] },
        { name: "Probationary", count: employeeTypeCounts.Probationary }
      ]);

      // Count departments
      const departmentCount = {
        PMS: 0, Accounting: 0, Technical: 0, Admin: 0, Utility: 0,
        HR: 0, IT: 0, Marketing: 0, Engineering: 0
      };

      activeEmployees.forEach(employee => {
        const dept = employee.Department || employee.department;
        if (dept && departmentCount.hasOwnProperty(dept)) {
          departmentCount[dept]++;
        }
      });

      setDepartmentData(Object.entries(departmentCount).map(([name, count]) => ({ name, count })));

      // Update monthly data for 2025
      if (selectedYear === 2025) {
        const monthlyRetention = [1, 2, 3, 4].map(q => {
          const hires = q === 1 ? q1List.length : q === 2 ? q2List.length : q === 3 ? q3List.length : q4List.length;
          const resigned = countResignedQuarterly(q).length;
          return {
            quarter: `Q${q} (${['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'][q-1]})`,
            rate: hires,
            turnover: resigned,
            employees: hires > 0 ? Math.round((resigned / hires) * 100) : 0
          };
        });
        setMonthlyData(monthlyRetention);
      }

      console.log("Active Employees:", activeEmployees.length);

    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employee data: " + error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPoolData();
        await fetchEmployees();
        setRetentionData(getRetentionData());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchEmployees();
      if (new Date().getFullYear() >= 2026) {
        setRetentionData(getRetentionData());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedYear]);

  useEffect(() => {
    if (poolData.length > 0) {
      setApplicantCount(poolData.length);
      setAcceptedCount(poolData.filter(a => a.status === "Accepted").length);
      setRejectedCount(poolData.filter(a => a.status === "Rejected").length);
      setResignedCount(poolData.filter(a => a.status === "Resigned").length);
      fetchEmployees();
    }
  }, [poolData]);

  useEffect(() => {
    setRetentionData(getRetentionData());
  }, [q1Hires, q2Hires, q3Hires, q4Hires, q1Resigned, q2Resigned, q3Resigned, q4Resigned]);

  const statusData = [{
    name: "Applicants",
    All: applicantCount,
    Accepted: acceptedCount,
    Rejected: rejectedCount,
    Resigned: resignedCount
  }];

  const handleYearClick = (data) => {
    if (selectedYear === data.year) {
      setSelectedYear(null);
      setMonthlyData([]);
    } else {
      setSelectedYear(data.year);
      
      if (data.year === 2025) {
        const monthlyRetention = [1, 2, 3, 4].map(q => {
          const hires = [q1Hires, q2Hires, q3Hires, q4Hires][q-1];
          const resigned = [q1Resigned, q2Resigned, q3Resigned, q4Resigned][q-1];
          return {
            quarter: `Q${q} (${['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'][q-1]})`,
            rate: hires,
            turnover: resigned,
            employees: hires > 0 ? Math.round((resigned / hires) * 100) : 0
          };
        });
        setMonthlyData(monthlyRetention);
      } else {
        const defaultMonthly = [
          { quarter: "Q1 (Jan-Mar)", rate: 85, turnover: 15, employees: 125 },
          { quarter: "Q2 (Apr-Jun)", rate: 90, turnover: 10, employees: 140 },
          { quarter: "Q3 (Jul-Sep)", rate: 90, turnover: 10, employees: 155 },
          { quarter: "Q4 (Oct-Dec)", rate: 88, turnover: 12, employees: 170 }
        ];
        setMonthlyData(defaultMonthly);
      }
    }
  };

  const addToPool = (employee) => setPoolData(prev => [...prev, employee]);
  const removeEmployee = (uid) => setRemovedEmployees(prev => [...prev, uid]);
  const updateEmployeeStatus = (uid, status, resignedAt = null) => {
    setPoolData(prev => prev.map(emp => 
      emp.uid === uid ? { ...emp, status, resignedAt } : emp
    ));
  };

  const chartStyle = {
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div className="flex flex-col w-full p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Statistics Dashboard</h1>
      
      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            <p className="text-blue-600">Loading employee data...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium">API Connection Issue:</p>
          <p className="text-yellow-700 text-sm">{error}</p>
          <p className="text-yellow-700 text-sm">Using fallback mock data for demonstration.</p>
        </div>
      )}

      <div className="flex flex-row w-full gap-6 mb-8">
        <div className="w-1/2 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
            Pool Statistics
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Total: {applicantCount} records)
            </span>
          </h2>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis allowDecimals={false} stroke="#666" />
                <Tooltip contentStyle={chartStyle} />
                <Legend />
                <Bar dataKey="All" fill="#2196F3" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Accepted" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Rejected" fill="#F44336" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Resigned" fill="#9C27B0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-1/2 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
            Employee Statistics
          </h2>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis allowDecimals={false} stroke="#666" />
                <Tooltip contentStyle={chartStyle} />
                <Legend />
                <Bar dataKey="count" fill="#FF9800" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="w-full p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Department Statistics</h2>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="#666" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} stroke="#666" />
              <Tooltip contentStyle={chartStyle} />
              <Legend />
              <Bar dataKey="count" fill="#9C27B0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Yearly Retention Rate</h2>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={retentionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" stroke="#666" tick={{ fontSize: 14 }} />
              <YAxis yAxisId="left" orientation="left" stroke="#666" label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#666" label={{ value: 'Number of Employees', angle: 90, position: 'insideRight' }} />
              <Tooltip 
                contentStyle={chartStyle}
                formatter={(value, name) => {
                  if (name === "rate") return [value, "S"];
                  if (name === "turnover") return [value, "R"];
                  return [value, "%"];
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="rate" fill="#4CAF50" radius={[4, 4, 0, 0]} name="S" onClick={handleYearClick} cursor="pointer" />
              <Bar yAxisId="left" dataKey="turnover" fill="#F44336" radius={[4, 4, 0, 0]} name="R" />
              <Bar yAxisId="right" dataKey="employees" fill="#2196F3" radius={[4, 4, 0, 0]} name="%" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {selectedYear && (
        <div className="w-full p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
            Quarterly Retention Rate for {selectedYear}
          </h2>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="quarter" stroke="#666" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#666" label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#666" label={{ value: 'Number of Employees', angle: 90, position: 'insideRight' }} />
                <Tooltip 
                  contentStyle={chartStyle}
                  formatter={(value, name) => {
                    if (name === "rate") return [value, "S"];
                    if (name === "turnover") return [value, "R"];
                    return [value, "%"];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="rate" fill="#4CAF50" radius={[4, 4, 0, 0]} name="S" />
                <Bar yAxisId="left" dataKey="turnover" fill="#F44336" radius={[4, 4, 0, 0]} name="R" />
                <Bar yAxisId="right" dataKey="employees" fill="#2196F3" radius={[4, 4, 0, 0]} name="%" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}