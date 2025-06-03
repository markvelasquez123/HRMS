import React, { useState, useEffect } from "react";
import axios from "axios";

const Pool = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [poolData, setPoolData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPoolData();

    const handleRefresh = () => {
      console.log("Refreshing pool data...");
      fetchPoolData();
    };

    window.addEventListener("refreshPool", handleRefresh);

    return () => {
      window.removeEventListener("refreshPool", handleRefresh);
    };
  }, []);

  const fetchPoolData = async () => {
    setLoading(true);
    setError("");
    try {
      // Updated API endpoint to match your PHP backend structure
      const response = await axios.get(
        "http://localhost/QMS-ASIANAVIS/HRMSBACKEND/HRMSbackend/get_pool_data.php",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("API Response:", response.data);

      // Check if the response is successful
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch pool data");
      }

      // Validate response data
      if (!Array.isArray(response.data.data)) {
        throw new Error("Invalid response format from server");
      }

      // Map the response data from your pool table structure
      const poolRecords = response.data.data.map(record => {
        return {
          name: record.name || 'N/A',
          position: record.position || 'N/A',
          department: record.department || 'N/A',
          phone: record.phone || 'N/A',
          status: record.status || 'N/A',
          resigned_date: record.resigned_date,
          created_at: record.created_at,
          updated_at: record.updated_at
        };
      });

      setPoolData(poolRecords);
      console.log("Pool data loaded:", poolRecords.length, "records");
      
    } catch (error) {
      console.error("Error fetching pool data:", error);
      
      if (error.response?.status === 500) {
        setError("Server error occurred. Please check the backend logs.");
      } else if (error.response?.status === 404) {
        setError("API endpoint not found. Please check the PHP file path.");
      } else if (error.code === 'ERR_NETWORK') {
        setError("Network error. Please check if your PHP server is running.");
      } else {
        setError(error.message || "Failed to fetch pool data. Please try again.");
      }
      setPoolData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPool = poolData.filter((record) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      record.name.toLowerCase().includes(searchTerm) ||
      record.position.toLowerCase().includes(searchTerm) ||
      record.department.toLowerCase().includes(searchTerm) ||
      record.status.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Pool Database</h2>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {poolData.length} Records
            </span>
            <button
              onClick={fetchPoolData}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
        
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by name, position, department, or status..."
            className="w-full p-3 pl-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
          />
          {searchQuery && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-sm text-gray-500">
                {filteredPool.length} of {poolData.length}
              </span>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">Error:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 mt-2">Loading pool data...</p>
          </div>
        ) : (
          <PoolTable records={filteredPool} />
        )}
      </div>
    </div>
  );
};

const PoolTable = ({ records }) => (
  <div className="overflow-x-auto mt-6 bg-white rounded-xl shadow-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {[
            "Name",
            "Position",
            "Department",
            "Phone",
            "Status",
            "Resigned Date",
            "Date Added",
          ].map((header) => (
            <th
              key={header}
              className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {records.length > 0 ? (
          records.map((record, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {record.name}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">{record.position}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">{record.department}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">{record.phone}</div>
              </td>
              <td className="px-6 py-4">
                <div
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    record.status === "Accepted"
                      ? "bg-green-100 text-green-800"
                      : record.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : record.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {record.status}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">
                  {record.resigned_date
                    ? new Date(record.resigned_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">
                  {record.created_at
                    ? new Date(record.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "N/A"}
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="px-6 py-12 text-center">
              <div className="text-gray-400">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium text-gray-500">No pool records found</p>
                <p className="text-sm text-gray-400">Records will appear here once they are added to the pool</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default Pool;