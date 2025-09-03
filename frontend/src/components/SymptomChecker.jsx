import React, { useState } from "react";
import axios from "axios";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
    notes: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/doctor/recommend", { symptoms });
      setResult(data);
    } catch (err) {
      setError("❌ Could not fetch recommendations. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-2">
        🩺 Symptom Checker
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your symptoms and find the best doctor instantly.
      </p>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 mb-6"
      >
        <input
          type="text"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g. fever, headache, cough..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 placeholder-gray-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          {loading ? "Searching..." : "Find Doctor"}
        </button>
      </form>

      {/* Error */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Results */}
      {result && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Suggested Specialty:{" "}
            <span className="text-blue-600">{result.recommendedSpecialty}</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {result.doctors.map((doc) => (
              <div
                key={doc._id}
                className="p-5 bg-gray-50 border rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h4 className="font-bold text-gray-800">{doc.name}</h4>
                <p className="text-sm text-gray-600">
                  {doc.specialization || "Doctor"}
                </p>
                <button
                  onClick={() => setSelectedDoctor(doc)}
                  className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-blue-700">
              Book Appointment with {selectedDoctor.name}
            </h3>
            <form className="space-y-3">
              <input
                type="date"
                value={appointmentData.date}
                onChange={(e) =>
                  setAppointmentData({ ...appointmentData, date: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="time"
                value={appointmentData.time}
                onChange={(e) =>
                  setAppointmentData({ ...appointmentData, time: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
              <textarea
                placeholder="Notes (optional)"
                value={appointmentData.notes}
                onChange={(e) =>
                  setAppointmentData({ ...appointmentData, notes: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDoctor(null)}
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
