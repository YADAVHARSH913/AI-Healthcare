import React, { useEffect, useState } from "react";

const BedAvailability = () => {
  const [beds, setBeds] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/beds")
      .then((res) => res.json())
      .then((data) => setBeds(data))
      .catch((err) => console.error("Error fetching beds:", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🏥 Bed Availability</h2>
      {beds.length === 0 ? (
        <p>No hospital data available</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Hospital</th>
              <th className="p-2 border">ICU Beds</th>
              <th className="p-2 border">General Beds</th>
              <th className="p-2 border">Total Beds</th>
              <th className="p-2 border">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {beds.map((hosp) => (
              <tr key={hosp._id} className="border">
                <td className="p-2 border">{hosp.hospitalName}</td>
                <td className="p-2 border text-red-600 font-bold">{hosp.icuBeds}</td>
                <td className="p-2 border text-green-600 font-bold">{hosp.generalBeds}</td>
                <td className="p-2 border">{hosp.totalBeds}</td>
                <td className="p-2 border">
                  {new Date(hosp.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BedAvailability;
