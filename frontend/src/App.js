import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import StudyPlanPage from "./pages/StudyPlanPage";

function Home() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const [deadline, setDeadline] = useState("");
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setExtractedText(response.data.extracted_text);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleGeneratePlan = async () => {
    try {
      const response = await axios.post("http://localhost:8000/study-plan/", {
        text: extractedText,
        study_time: parseInt(studyTime),
        deadline,
      });
      navigate("/study-plan", { state: { studyPlan: response.data.study_plan } });
    } catch (error) {
      console.error("Error generating study plan:", error);
    }
  };

  return (
    <div>
      <h1>AI Study Planner</h1>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload & Extract</button>
      </form>
      {extractedText && (
        <div>
          <h2>Extracted Text:</h2>
          <p>{extractedText.substring(0, 500)}...</p>
        </div>
      )}
      <div>
        <input
          type="number"
          placeholder="Study Time (hours)"
          value={studyTime}
          onChange={(e) => setStudyTime(e.target.value)}
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button onClick={handleGeneratePlan}>Generate Study Plan</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/study-plan" element={<StudyPlanPage />} />
      </Routes>
    </Router>
  );
}

export default App;
