import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import StudyPlanPage from "./pages/StudyPlanPage";
import "./components/homeStyles.css"; // Ensure your CSS supports the changes

function Home() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const [deadline, setDeadline] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // Progress state for the file upload
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setErrorMessage(""); // Reset error message
    setSuccessMessage(""); // Reset success message

    try {
      const response = await axios.post("http://localhost:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });

      setExtractedText(response.data.extracted_text);
      setSuccessMessage("File uploaded and text extracted successfully!");
    } catch (error) {
      setErrorMessage("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!studyTime || !deadline) {
      setErrorMessage("Please enter study time and deadline.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/study-plan/", {
        text: extractedText,
        study_time: parseInt(studyTime),
        deadline,
      });
      navigate("/study-plan", { state: { studyPlan: response.data.study_plan } });
    } catch (error) {
      setErrorMessage("Error generating study plan. Please try again.");
    }
  };

  return (
    <div className="home-container">
      <h1>AI Study Planner</h1>

      <form onSubmit={handleFileUpload} className="file-upload-form">
        <div
          className="file-upload-container"
          onClick={() => document.getElementById("file-input").click()}
        >
          {file ? <p>{file.name}</p> : <p>Click or drag to upload your study material</p>}
        </div>
        <input
          type="file"
          id="file-input"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "none" }}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload & Extract"}
        </button>
      </form>

      {uploading && (
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {extractedText && (
        <div>
          <h2>Extracted Text:</h2>
          <p>{extractedText.substring(0, 500)}...</p>
        </div>
      )}

      <div className="study-plan-form">
        <label>Study Time (hours)</label>
        <input
          type="number"
          placeholder="Enter study time"
          min="1"
          value={studyTime}
          onChange={(e) => setStudyTime(e.target.value)}
        />

        <label>Days Left to Study</label>
        <input
          type="number"
          value={deadline}
          min="1"
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button
          onClick={handleGeneratePlan}
          disabled={!extractedText || !studyTime || !deadline}
        >
          Generate Study Plan
        </button>
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
