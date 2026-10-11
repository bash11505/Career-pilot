import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function SearchBar() {
    const [search, setSearch] = useState("");
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
        const loadResumes = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                if (!token) {
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/api/resume",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    console.error(
                        data.message ||
                        "Failed to load resumes"
                    );
                    return;
                }

                const resumeList =
                    data.resumes || data;

                setResumes(resumeList);

            } catch (error) {
                console.error(
                    "Resume search error:",
                    error
                );
            }
        };

        loadResumes();
    }, []);

    const filteredResumes =
        resumes.filter((resume) =>
            resume.title
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );

    return (
        <div className="SearchBar">

            <input
                type="text"
                placeholder="Search resumes..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
            />

            {search.trim() && (
                <ul>
                    {filteredResumes.length >
                    0 ? (
                        filteredResumes.map(
                            (resume) => (
                                <li
                                    key={
                                        resume.id
                                    }
                                >
                                    <Link
                                        to={`/resume-analysis?resumeId=${resume.id}`}
                                    >
                                        {
                                            resume.title
                                        }
                                    </Link>
                                </li>
                            )
                        )
                    ) : (
                        <li>
                            No matching resume
                            found.
                        </li>
                    )}
                </ul>
            )}

        </div>
    );
}

export default SearchBar;