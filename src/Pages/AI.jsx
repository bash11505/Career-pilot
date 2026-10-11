import { useState, useEffect } from "react";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../CSS/AI.css";

function AI() {
    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState("");
    const [resume, setResume] = useState(null);

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

                if (resumeList.length > 0) {
                    setSelectedResume(
                        String(resumeList[0].id)
                    );

                    setResume(resumeList[0]);
                }

            } catch (error) {
                console.error(
                    "AI resume loading error:",
                    error
                );

                setError(
                    "Unable to connect to backend"
                );

            } finally {
                setLoading(false);
            }
        };

        loadResumes();
    }, []);

    const handleResumeChange = (e) => {
        const resumeId = e.target.value;

        setSelectedResume(resumeId);

        const selected = resumes.find(
            (item) =>
                String(item.id) ===
                String(resumeId)
        );

        setResume(selected || null);
        setError("");
    };

    return (
        <div className="AIPage">

            <Navbar />

            <div className="AIContainer">

                <h1>
                    Your Resume Score
                </h1>

                {loading && (
                    <p>
                        Loading resumes...
                    </p>
                )}

                {!loading && error && (
                    <p>
                        {error}
                    </p>
                )}

                {!loading &&
                    !error &&
                    resumes.length === 0 && (
                        <p className="AIEmptyMessage">
                            No resume scores available.
                        </p>
                    )}

                {!loading &&
                    resumes.length > 0 && (
                        <div>

                            <label htmlFor="resumeSelect">
                                Select Resume:
                            </label>

                            <select
                                id="resumeSelect"
                                value={selectedResume}
                                onChange={handleResumeChange}
                            >
                                {resumes.map(
                                    (item) => (
                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.title}
                                        </option>
                                    )
                                )}
                            </select>

                            {resume && (
                                <div className="AIResumeCard">

                                    <h2>
                                        {resume.title}
                                    </h2>

                                    <h3>
                                        ATS Score:{" "}
                                        {resume.atsScore}/100
                                    </h3>

                                    <p>
                                        Skills:{" "}
                                        {resume.skillsPercent}%
                                    </p>

                                    <p>
                                        Projects:{" "}
                                        {resume.projectsPercent}%
                                    </p>

                                    <p>
                                        Certifications:{" "}
                                        {resume.certificationsPercent}%
                                    </p>

                                    <p>
                                        School:{" "}
                                        {resume.schoolPercent}%
                                    </p>

                                    <p>
                                        College:{" "}
                                        {resume.collegePercent}%
                                    </p>

                                </div>
                            )}

                        </div>
                    )}

            </div>

            <Footer />

        </div>
    );
}

export default AI;