import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from "../../constant.js";

function PositionDropdown({ onPositionChange }) { 
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                
    
                const response = await axios.get(`http://${URL}/HRMSbackend/get_distinct_positions.php`);
                setPositions(response.data.positions);
            } catch (err) {
                setError("Failed to fetch positions: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPositions();
    }, []);

   
    const handleChange = (e) => {
        if (onPositionChange) {
            onPositionChange(e.target.value);
        }
    };

    if (loading) {
        return <div>Loading positions...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div className=" text-gray-800">
            <select className="border border-gray-300 p-2 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-200"  onChange={handleChange}>
                <option value="">Position</option>

                {positions?.map((position, index) => ( 
                    <option key={index} value={position}>
                        {position}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default PositionDropdown;
