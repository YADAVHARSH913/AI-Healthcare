const Doctor = require('../models/Doctor.js'); // Doctor Model ko import karein

// Hamara "Knowledge Base"
const symptomSpecialtyMap = {
  "fever": ["General Physician"],
  "cough": ["General Physician", "Pulmonologist"],
  "headache": ["General Physician", "Neurologist"],
  "stomach ache": ["Gastroenterologist", "General Physician"],
  "chest pain": ["Cardiologist", "General Physician"],
  "shortness of breath": ["Cardiologist", "Pulmonologist"],
  "joint pain": ["Orthopedic"],
  "skin rash": ["Dermatologist"],
  "back pain": ["Orthopedic", "General Physician"],
  "anxiety": ["Psychiatrist", "General Physician"]
};

// Recommendation logic
exports.recommendDoctor = async (req, res) => {
  const { symptoms } = req.body; // User ke diye gaye symptoms
  if (!symptoms) {
    return res.status(400).json({ message: "Symptoms are required." });
  }

  const scores = {};
  let maxScore = 0;
  let recommendedSpecialty = "General Physician"; // Default agar kuch match na ho

  // Har symptom ko map mein check karke specialty ka score badhao
  for (const symptom in symptomSpecialtyMap) {
    if (symptoms.toLowerCase().includes(symptom)) {
      symptomSpecialtyMap[symptom].forEach(specialty => {
        scores[specialty] = (scores[specialty] || 0) + 1;
      });
    }
  }

  // Sabse zyada score wali specialty dhundo
  for (const specialty in scores) {
    if (scores[specialty] > maxScore) {
      maxScore = scores[specialty];
      recommendedSpecialty = specialty;
    }
  }

  // Ab uss specialty ke doctors ko database se nikal kar bhejo
  try {
    const doctors = await Doctor.find({ specialty: recommendedSpecialty });
    res.status(200).json({ recommendedSpecialty, doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error while fetching doctors" });
  }
};

// Agar aapke paas pehle se doctor list ka function hai to use, varna ise add kar sakte hain
exports.getAllDoctors = async (req, res) => {
    // ... aapka get all doctors ka logic ...
};