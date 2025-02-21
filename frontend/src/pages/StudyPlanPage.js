import React from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function StudyPlanPage() {
  const location = useLocation();
  const studyPlan = location.state?.studyPlan || "No study plan generated.";
  console.log(studyPlan);

  // Parse study plan into sections (assuming Markdown structure)
  const planLines = studyPlan.split("\n").filter(line => line.trim() !== "");

  return (
    <div className="study-plan-container">
      <h1>Your AI-Generated Study Plan</h1>
      
      <table className="study-plan-table">
        <tbody>
          {planLines.map((line, index) => {
            if (line.startsWith("**Day")) {
              return (
                <tr key={index}>
                  <td>{line.replace("**", "").replace(" -", "").trim()}</td>
                  <td>{planLines[index + 1]}</td>
                  <td>
                    <input type="checkbox" />
                  </td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>

      <ReactMarkdown>{studyPlan}</ReactMarkdown>
    </div>
  );
}

export default StudyPlanPage;
