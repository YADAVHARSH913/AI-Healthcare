import React, { useEffect, useState } from "react";
import { getTimeGreeting } from "../utils/greetings"; // ✅ same file ka use karenge

const PatientDashboard = () => {
  const [timeGreeting, setTimeGreeting] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // LocalStorage se user data nikaalna
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.name || "Patient");
    }

    // Time-based greeting set karna
    setTimeGreeting(getTimeGreeting());
  }, []);

  return (
    <div className="p-6">
      {/* Greeting Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {timeGreeting}, {userName}! 👋
        </h1>
      </div>

      <h2 className="text-2xl font-bold mb-4">Patient Dashboard</h2>

      {/* Yaha baad me patient ki appointments / bookings aaengi */}
      <p className="text-gray-600">Welcome to your dashboard. You can book and view appointments here.</p>
    </div>
  );
};

export default PatientDashboard;
