// backend/routes/aiRoutes.js

import express from "express";
import fs from "fs/promises";
import path from "path";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper: Convert file to Gemini-compatible base64
const fileToGenerativePart = async (filePath, mimeType) => {
  const data = await fs.readFile(filePath);
  return {
    inlineData: {
      data: data.toString("base64"),
      mimeType,
    },
  };
};

// --- Analyze Report API ---
router.post("/analyze-report/:appointmentId", authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId).populate(
      "doctor",
      "name specialization"
    );

    if (!appointment || !appointment.report) {
      return res.status(404).json({ error: "Report not found for this appointment." });
    }

    // ✅ Ensure path points to uploaded file
    const reportPath = path.join(process.cwd(), appointment.report); // appointment.report already "uploads/..." hota hai
    const mimeType = "image/jpeg"; // TODO: extension check karke dynamic bhi kar sakte ho

    const imagePart = await fileToGenerativePart(reportPath, mimeType);

    // Available doctors list for AI suggestion
    const doctorsList = await User.find({ role: "doctor", status: "Available" }).select(
      "name specialization"
    );
    const specializations = [...new Set(doctorsList.map((d) => d.specialization))].join(", ");

    // Prompt for AI
    const prompt = `You are a world-class medical analysis expert. Analyze the given medical report image.
Return response as valid JSON with exactly these keys:
{
  "problem_description": "...",
  "potential_cause": "...",
  "suggested_solution": "...",
  "estimated_recovery": "...",
  "doctor_recommendation": "...",
  "disclaimer": "This is an AI-generated analysis and not a substitute for professional medical advice."
}
- Problem description = summary of the main issue
- Potential cause = likely cause of the problem
- Suggested solution = what next steps should patient take
- Estimated recovery = general recovery timeline
- Doctor recommendation = pick best specialization from: ${specializations}
`;

    const apiKey = process.env.GEMINI_API_KEY; // ✅ API key env se lo
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          parts: [{ text: prompt }, imagePart],
        },
      ],
    };

    const aiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API responded with status: ${aiResponse.status}`);
    }

    const result = await aiResponse.json();
    let analysisText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!analysisText) {
      return res.status(500).json({ error: "AI could not analyze the report." });
    }

    // ✅ Cleanup JSON if Gemini sends with ```json ... ```
    analysisText = analysisText.replace(/```json|```/g, "").trim();

    let analysisJson;
    try {
      analysisJson = JSON.parse(analysisText);
    } catch (e) {
      analysisJson = {
        problem_description: analysisText,
        disclaimer: "This is an AI-generated analysis and not a substitute for professional medical advice.",
      };
    }

    res.json(analysisJson);
  } catch (err) {
    console.error("Report Analysis Error:", err);
    res.status(500).json({ error: "Server error during report analysis." });
  }
});

export default router;
