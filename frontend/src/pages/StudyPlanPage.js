import React from "react";
import { useLocation, Link } from "react-router-dom";

function StudyPlanPage() {
  const location = useLocation();
  const studyPlan = location.state?.studyPlan || "No study plan available.";

  return (
    <div>
      <h1>Study Plan</h1>
      <pre>{studyPlan}</pre>
      <Link to="/">Go Back</Link>
    </div>
  );
}

export default StudyPlanPage;
