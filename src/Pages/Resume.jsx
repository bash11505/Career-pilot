import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../CSS/Resume.css";

function Resume() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile =
            event.target.files[0];

        if (!selectedFile) {
            return;
        }

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
        ];

        const fileExtension =
            selectedFile.name
                .split(".")
                .pop()
                .toLowerCase();

        const allowedExtensions = [
            "pdf",
            "doc",
            "docx",
        ];

        if (
            !allowedTypes.includes(
                selectedFile.type
            ) &&
            !allowedExtensions.includes(
                fileExtension
            )
        ) {
            setMessage(
                "Please select a PDF, DOC, or DOCX file"
            );
            return;
        }

        if (
            selectedFile.size >
            5 * 1024 * 1024
        ) {
            setMessage(
                "File size must be less than 5 MB"
            );
            return;
        }

        setFile(selectedFile);
        setFileName(selectedFile.name);
        setMessage("");
    };

    const handleUpload = async () => {
        setMessage("");

        if (!file) {
            setMessage(
                "Please select a resume"
            );
            return;
        }

        if (!title.trim()) {
            setMessage(
                "Please enter a resume title"
            );
            return;
        }

        const token =
            localStorage.getItem("token");

        if (!token) {
            setMessage(
                "Please login first"
            );
            return;
        }

        try {
            setLoading(true);

            const formData =
                new FormData();

            formData.append(
                "resume",
                file
            );

            formData.append(
                "title",
                title.trim()
            );

            const response =
                await fetch(
                    "http://localhost:5000/api/resume/upload",
                    {
                        method: "POST",
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                        body: formData,
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Resume upload failed"
                );
                return;
            }

            setMessage(
                "Resume uploaded successfully"
            );

            setFile(null);
            setFileName("");
            setTitle("");

        } catch (error) {
            console.error(
                "Resume upload error:",
                error
            );

            setMessage(
                "Unable to connect to backend"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ResumePage">

            <Navbar />

            <div className="resume-container">

                <h1>
                    Upload Resume
                </h1>

                <input
                    className="resume-title"
                    type="text"
                    placeholder="Enter Resume Title"
                    value={title}
                    onChange={(event) =>
                        setTitle(
                            event.target.value
                        )
                    }
                />

                <div className="upload-box">

                    <input
                        type="file"
                        id="resume"
                        hidden
                        accept=".pdf,.doc,.docx"
                        onChange={
                            handleFileChange
                        }
                    />

                    <label
                        htmlFor="resume"
                        className="upload-content"
                    >

                        <FaCloudUploadAlt
                            className="upload-icon"
                        />

                        <h2>
                            Drag & Drop your Resume
                        </h2>

                        <p>
                            or click to browse
                            your files
                        </p>

                        <small>
                            PDF, DOC, DOCX
                            (Maximum 5 MB)
                        </small>

                        <span className="choose-btn">
                            Choose File
                        </span>

                    </label>

                </div>

                {fileName && (
                    <div className="file-preview">
                        Selected File:{" "}
                        {fileName}
                    </div>
                )}

                <button
                    type="button"
                    className="submit-btn"
                    onClick={handleUpload}
                    disabled={loading}
                >
                    {loading
                        ? "Uploading..."
                        : "Submit Resume"}
                </button>

                {message && (
                    <p className="resume-message">
                        {message}
                    </p>
                )}

            </div>

            <Footer />

        </div>
    );
}

export default Resume;