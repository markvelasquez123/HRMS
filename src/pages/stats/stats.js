import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { URL } from "../../constant";
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
  const [userCompany, setUserCompany] = useState("");

  const poolColors = ['#2196F3', '#4CAF50', '#F44336', '#9C27B0'];
  const employeeColors = ['#FF9800', '#2196F3', '#4CAF50'];


  useEffect(() => {
    const checkSessionStorage = () => {
      const userDataString = sessionStorage.getItem('userData');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          const companyFromSession = userData.Company;
          
          console.log("=== USER COMPANY FROM SESSION ===");
          console.log("Company:", companyFromSession);
          
          if (companyFromSession && companyFromSession !== userCompany) {
            setUserCompany(companyFromSession);
          }
        } catch (error) {
          console.error("Error parsing userData:", error);
        }
      }
    };
    
    checkSessionStorage();
    
    // Check periodically in case userData is set after component mount
    const interval = setInterval(checkSessionStorage, 100);
    
    // Clear interval after 5 seconds
    setTimeout(() => clearInterval(interval), 5000);
    
    return () => clearInterval(interval);
  }, [userCompany]);
 
  const fetchEmployeesFromBackend = async () => {
    try {
      const response = await fetch(`http://${URL}/HRMSbackend/test2.php?action=get`);
      
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
      console.log("=== ALL EMPLOYEES FROM BACKEND ===");
      console.log("Total employees:", employees.length);
      if (employees.length > 0) {
        console.log("Sample employee data:", employees[0]);
        console.log("Company field check:", employees[0].Company);
      }
      return employees;
    } catch (error) {
      console.error("Error fetching employees from backend:", error);
      return [];
    }
  };

  const fetchPoolData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://${URL}/HRMSbackend/get_pool_data.php`,
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
        company: record.company || record.Company || 'N/A',
        resignedAt: record.resigned_date,
        created_at: record.created_at,
        updated_at: record.updated_at
      }));

      console.log("=== ALL POOL DATA (NOT FILTERED) ===");
      console.log("Total pool records:", poolRecords.length);

      setPoolData(poolRecords);
      
    } catch (error) {
      console.error("Error fetching pool data:", error);
      setError(error.message || "Failed to fetch pool data");
      setPoolData([]);
    } finally {
      setLoading(false);
    }
  };

  const getRetentionData = () => {
    const baseData = [
      { year: 2021, rate: 95, employees: 120, turnover: 15 },
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
      if (!employee.DateHired && !employee.hireDate) return false;
      const hireDate = new Date(employee.DateHired || employee.hireDate);
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
      const backendEmployees = await fetchEmployeesFromBackend();
      
      console.log("=== EMPLOYEE FILTERING ===");
      console.log("User Company:", userCompany);
      console.log("Total employees before filter:", backendEmployees.length);
      
      // Filter by company if userCompany is set
      let filteredEmployees = backendEmployees;
      if (userCompany) {
        filteredEmployees = backendEmployees.filter(employee => {
          const empCompany = employee.Company || employee.company;
          const matches = empCompany === userCompany;
          if (!matches && employee.id <= 3) {
            console.log(`Employee ${employee.id}: ${empCompany} !== ${userCompany}`);
          }
          return matches;
        });
        console.log(`After company filter (${userCompany}): ${filteredEmployees.length} employees`);
      }
      
      const activeEmployees = filteredEmployees.filter(employee => 
        !removedEmployees.includes(employee.id?.toString() || employee.uid)
      );
      
      console.log("Active employees after removal filter:", activeEmployees.length);
      
      setEmployeeList(activeEmployees);

      const q1List = countQuarterlyData(activeEmployees, 2025, 1);
      const q2List = countQuarterlyData(activeEmployees, 2025, 2);
      const q3List = countQuarterlyData(activeEmployees, 2025, 3);
      const q4List = countQuarterlyData(activeEmployees, 2025, 4);
      
      setQ1Hires(q1List.length);
      setQ2Hires(q2List.length);
      setQ3Hires(q3List.length);
      setQ4Hires(q4List.length);

      setQ1Resigned(countResignedQuarterly(1).length);
      setQ2Resigned(countResignedQuarterly(2).length);
      setQ3Resigned(countResignedQuarterly(3).length);
      setQ4Resigned(countResignedQuarterly(4).length);

      const employeeTypeCounts = {
        Regular: 0,
        'Project-Based': 0,
        Probationary: 0
      };

      activeEmployees.forEach(employee => {
        const type = employee.EmployeeType || employee.employeeType;
        if (type === 'Regular') {
          employeeTypeCounts.Regular++;
        } else if (type === 'Project-Based' || type === 'Project Based') {
          employeeTypeCounts['Project-Based']++;
        } else if (type === 'Probationary') {
          employeeTypeCounts.Probationary++;
        }
      });

      console.log("Employee type counts:", employeeTypeCounts);

      setemployeeData([
        { name: "Regular", count: employeeTypeCounts.Regular },
        { name: "Project Based", count: employeeTypeCounts['Project-Based'] },
        { name: "Probationary", count: employeeTypeCounts.Probationary }
      ]);

      const departmentCount = {
        PMS: 0, Accounting: 0, Technical: 0, Admin: 0, Utility: 0,
        HR: 0, IT: 0, Marketing: 0, Engineering: 0, Architect: 0, Operation: 0, Director: 0
      };

      activeEmployees.forEach(employee => {
        const dept = employee.Department || employee.department;
        if (dept && departmentCount.hasOwnProperty(dept)) {
          departmentCount[dept]++;
        }
      });

      console.log("Department counts:", departmentCount);

      setDepartmentData(Object.entries(departmentCount).map(([name, count]) => ({ name, count })));

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

    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employee data: " + error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userCompany) {
        console.log("Waiting for userCompany...");
        return;
      }
      
      console.log("=== STARTING DATA FETCH ===");
      console.log("Fetching data for company:", userCompany);
      
      try {
        await fetchPoolData();
        await fetchEmployees();
        setRetentionData(getRetentionData());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    if (userCompany) {
      const interval = setInterval(() => {
        fetchEmployees();
        if (new Date().getFullYear() >= 2026) {
          setRetentionData(getRetentionData());
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [selectedYear, userCompany]);

  useEffect(() => {
    if (poolData.length > 0) {
      setApplicantCount(poolData.length);
      setAcceptedCount(poolData.filter(a => a.status === "Accepted").length);
      setRejectedCount(poolData.filter(a => a.status === "Rejected").length);
      setResignedCount(poolData.filter(a => a.status === "Resigned").length);
      
      console.log("=== POOL STATISTICS ===");
      console.log("Total:", poolData.length);
      console.log("Accepted:", poolData.filter(a => a.status === "Accepted").length);
      console.log("Rejected:", poolData.filter(a => a.status === "Rejected").length);
      console.log("Resigned:", poolData.filter(a => a.status === "Resigned").length);
    }
  }, [poolData]);

  useEffect(() => {
    setRetentionData(getRetentionData());
  }, [q1Hires, q2Hires, q3Hires, q4Hires, q1Resigned, q2Resigned, q3Resigned, q4Resigned]);

  const poolStatusData = [
    { name: "Accepted", value: acceptedCount },
    { name: "Rejected", value: rejectedCount },
    { name: "Resigned", value: resignedCount },
    { name: "Others", value: Math.max(0, applicantCount - acceptedCount - rejectedCount - resignedCount) }
  ].filter(item => item.value > 0);

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

  const renderLabel = (entry) => {
    if (entry.value === 0) return '';
    return `${entry.name}: ${entry.value}`;
  };

  return (
    <div className="flex flex-col w-full p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Statistics Dashboard</h1>
      </div>
      
      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            <p className="text-blue-600">Loading....</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium">API Connection Issue</p>
          <p className="text-yellow-700 text-sm">{error}</p>
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
              <PieChart>
                <Pie
                  data={poolStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {poolStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={poolColors[index % poolColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-1/2 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
            Employee Statistics
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Total: {employeeList.length} employees)
            </span>
          </h2>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employeeData.filter(item => item.count > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {employeeData.filter(item => item.count > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={employeeColors[index % employeeColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
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
              <Tooltip />
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
            Quarterly Retention Rate {selectedYear}
          </h2>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="quarter" stroke="#666" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#666" label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#666" label={{ value: 'Number of Employees', angle: 90, position: 'insideRight' }} />
                <Tooltip 
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