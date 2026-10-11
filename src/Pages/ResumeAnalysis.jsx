import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../CSS/ResumeAnalysis.css";

function ResumeAnalysis() {
    const [searchParams] = useSearchParams();

    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState(
        searchParams.get("resumeId") || ""
    );

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingResumes, setLoadingResumes] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadResumes = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Please login first");
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/api/resume",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message ||
                        "Failed to load resumes"
                    );
                    return;
                }

                const resumeList =
                    data.resumes || data;

                setResumes(resumeList);

                const urlResumeId =
                    searchParams.get("resumeId");

                const resumeExists =
                    resumeList.some(
                        (resume) =>
                            String(resume.id) ===
                            String(urlResumeId)
                    );

                if (
                    urlResumeId &&
                    resumeExists
                ) {
                    setSelectedResume(
                        String(urlResumeId)
                    );
                } else if (
                    resumeList.length > 0
                ) {
                    setSelectedResume(
                        String(resumeList[0].id)
                    );
                }

            } catch (error) {
                console.error(
                    "Resume loading error:",
                    error
                );

                setError(
                    "Unable to connect to backend"
                );

            } finally {
                setLoadingResumes(false);
            }
        };

        loadResumes();
    }, [searchParams]);

    const getAnalysis = async () => {
        if (!selectedResume) {
            setError("Please select a resume");
            return;
        }

        try {
            setLoading(true);
            setAnalysis(null);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                setError("Please login first");
                return;
            }

            const response = await fetch(
                `http://localhost:5000/api/ai/analyze/${selectedResume}`,
                {
                    method: "POST",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Failed to analyze resume"
                );
                return;
            }

            setAnalysis({
                ats_score:
                    data.scores.atsScore,

                skills_percent:
                    data.scores.skillsPercent,

                projects_percent:
                    data.scores.projectsPercent,

                certifications_percent:
                    data.scores.certificationsPercent,

                school_percent:
                    data.scores.schoolPercent,

                college_percent:
                    data.scores.collegePercent,

                analysis:
                    data.analysis,
            });

        } catch (error) {
            console.error(
                "Analysis error:",
                error
            );

            setError(
                "Unable to connect to AI service"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ResumeAnalysisPage">

            <Navbar />

            <div className="ResumeAnalysisContainer">

                <h1>
                    Resume Analysis
                </h1>

                {loadingResumes && (
                    <p className="AnalysisMessage">
                        Loading resumes...
                    </p>
                )}

                {!loadingResumes &&
                    error && (
                        <p className="AnalysisError">
                            {error}
                        </p>
                    )}

                {!loadingResumes &&
                    !error &&
                    resumes.length === 0 && (
                        <p className="AnalysisMessage">
                            No resumes uploaded yet.
                        </p>
                    )}

                {!loadingResumes &&
                    resumes.length > 0 && (
                        <div className="ResumeSelector">

                            <label htmlFor="resumeSelect">
                                Select Resume:
                            </label>

                            <select
                                id="resumeSelect"
                                value={selectedResume}
                                onChange={(e) => {
                                    setSelectedResume(
                                        e.target.value
                                    );

                                    setAnalysis(null);
                                    setError("");
                                }}
                            >
                                <option value="">
                                    Select Resume
                                </option>

                                {resumes.map(
                                    (resume) => (
                                        <option
                                            key={resume.id}
                                            value={resume.id}
                                        >
                                            {resume.title}
                                        </option>
                                    )
                                )}
                            </select>

                            <button
                                type="button"
                                onClick={getAnalysis}
                                disabled={loading}
                            >
                                {loading
                                    ? "Analyzing..."
                                    : "Get Analysis"}
                            </button>

                        </div>
                    )}

                {analysis && (
                    <div className="AnalysisResult">

                        <h2>
                            AI Resume Analysis
                        </h2>

                        <h3>
                            Resume Scores
                        </h3>

                        <div className="ScoreGrid">

                            <div className="ScoreCard">
                                <h4>ATS Score</h4>
                                <p>
                                    {analysis.ats_score}/100
                                </p>
                            </div>

                            <div className="ScoreCard">
                                <h4>Skills</h4>
                                <p>
                                    {analysis.skills_percent}%
                                </p>
                            </div>

                            <div className="ScoreCard">
                                <h4>Projects</h4>
                                <p>
                                    {analysis.projects_percent}%
                                </p>
                            </div>

                            <div className="ScoreCard">
                                <h4>Certifications</h4>
                                <p>
                                    {analysis.certifications_percent}%
                                </p>
                            </div>

                            <div className="ScoreCard">
                                <h4>School</h4>
                                <p>
                                    {analysis.school_percent}%
                                </p>
                            </div>

                            <div className="ScoreCard">
                                <h4>College</h4>
                                <p>
                                    {analysis.college_percent}%
                                </p>
                            </div>

                        </div>

                        <h3>
                            Detailed Analysis
                        </h3>

                        <div className="AnalysisSection">

                            <h4>
                                ATS Score Explanation
                            </h4>

                            <p>
                                {
                                    analysis.analysis
                                        ?.ats_score_explanation
                                }
                            </p>

                            <h4>
                                Skills Analysis
                            </h4>

                            <p>
                                {
                                    analysis.analysis
                                        ?.skills_analysis
                                }
                            </p>

                            <h4>
                                Projects Analysis
                            </h4>

                            <p>
                                {
                                    analysis.analysis
                                        ?.projects_analysis
                                }
                            </p>

                            <h4>
                                Education Analysis
                            </h4>

                            <p>
                                {
                                    analysis.analysis
                                        ?.education_analysis
                                }
                            </p>

                            <h4>
                                Certifications Analysis
                            </h4>

                            <p>
                                {
                                    analysis.analysis
                                        ?.certifications_analysis
                                }
                            </p>

                            <h4>
                                Resume Strengths
                            </h4>

                            <p>
                                {
                                    analysis.analysis
                                        ?.resume_strengths
                                }
                            </p>

                            <h4>
                                Resume Weaknesses
                            </h4>

                            <p>
                                {
                                    analysis.analysis
                                        ?.resume_weaknesses
                                }
                            </p>

                            <h4>
                                Improvement Suggestions
                            </h4>

                            <p>
                                {
                                    analysis.analysis
                                        ?.improvement_suggestions
                                }
                            </p>

                            <h4>
                                Overall Recommendation
                            </h4>

                            <p>
                                {
                                    analysis.analysis
                                        ?.overall_recommendation
                                }
                            </p>

                        </div>

                    </div>
                )}

            </div>

            <Footer />

        </div>
    );
}

export default ResumeAnalysis;