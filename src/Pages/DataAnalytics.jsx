import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../CSS/DataAnalytics.css";

function DataAnalytics() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResumes = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first");
          return;
        }

        const response = await fetch("http://localhost:5000/api/resume", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load resumes");
          return;
        }

        const resumeList = data.resumes || data;
        setResumes(resumeList);

        if (resumeList.length > 0) {
          setSelectedResumeId(resumeList[0].id || resumeList[0]._id);
          setSelectedResume(resumeList[0]);
        }
      } catch (err) {
        console.error("Data analytics error:", err);
        setError("Unable to connect to backend");
      } finally {
        setLoading(false);
      }
    };

    loadResumes();
  }, []);

  const handleSelectChange = (e) => {
    const id = e.target.value;
    setSelectedResumeId(id);
    const found = resumes.find((r) => (r.id || r._id).toString() === id);
    setSelectedResume(found || null);
  };

  return (
    <div className="ResumeAnalysisPage">
      <Navbar />

      <main className="ResumeAnalysisContainer">
        <h1>Data Analytics</h1>

        {loading && <p className="AnalysisMessage">Loading resumes...</p>}

        {!loading && error && <p className="AnalysisError">{error}</p>}

        {!loading && !error && resumes.length === 0 && (
          <p className="AnalysisMessage">No resumes uploaded yet.</p>
        )}

        {!loading && !error && resumes.length > 0 && (
          <>
            <div className="ResumeSelector">
              <label htmlFor="resumeSelect">Select Resume to Analyze:</label>
              <select
                id="resumeSelect"
                value={selectedResumeId}
                onChange={handleSelectChange}
              >
                {resumes.map((resume) => (
                  <option key={resume.id || resume._id} value={resume.id || resume._id}>
                    {resume.title || `Resume #${resume.resumeNo || resume.id}`}
                  </option>
                ))}
              </select>
            </div>

            {selectedResume && (
              <div className="AnalysisResult">
                <h2>{selectedResume.title || "Resume Details"}</h2>

                <h3>Metrics & ATS Scores</h3>
                <div className="ScoreGrid">
                  <div className="ScoreCard">
                    <h4>ATS Score</h4>
                    <p>{selectedResume.atsScore ?? 0}%</p>
                  </div>
                  <div className="ScoreCard">
                    <h4>Skills</h4>
                    <p>{selectedResume.skillsPercent ?? 0}%</p>
                  </div>
                  <div className="ScoreCard">
                    <h4>Projects</h4>
                    <p>{selectedResume.projectsPercent ?? 0}%</p>
                  </div>
                  <div className="ScoreCard">
                    <h4>Certifications</h4>
                    <p>{selectedResume.certificationsPercent ?? 0}%</p>
                  </div>
                  <div className="ScoreCard">
                    <h4>School</h4>
                    <p>{selectedResume.schoolPercent ?? 0}%</p>
                  </div>
                  <div className="ScoreCard">
                    <h4>College</h4>
                    <p>{selectedResume.collegePercent ?? 0}%</p>
                  </div>
                </div>

                <div className="AnalysisSection">
                  <h3>Overview</h3>
                  <h4>Resume Number</h4>
                  <p>{selectedResume.resumeNo || "N/A"}</p>

                  <h4>Status</h4>
                  <p>{selectedResume.status || "Processed"}</p>

                  {selectedResume.feedback && (
                    <>
                      <h4>Detailed Feedback</h4>
                      <p>{selectedResume.feedback}</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default DataAnalytics;