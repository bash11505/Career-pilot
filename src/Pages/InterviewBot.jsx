import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import "../CSS/InterviewBot.css";


function InterviewBot() {

    const [searchParams] = useSearchParams();

    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState("");

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [sending, setSending] = useState(false);

    const [error, setError] = useState("");


    // Load user's resumes
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


                const resumeId =
                    searchParams.get("resumeId");


                if (resumeId) {

                    setSelectedResume(resumeId);

                } else if (resumeList.length > 0) {

                    setSelectedResume(
                        String(resumeList[0].id)
                    );
                }


            } catch (error) {

                console.error(error);

                setError(
                    "Unable to connect to backend"
                );

            } finally {

                setLoading(false);
            }
        };


        loadResumes();

    }, [searchParams]);


    // Start interview
    const startInterview = async () => {

        if (!selectedResume) {

            setError("Please select a resume");

            return;
        }


        try {

            setStarting(true);
            setError("");
            setMessages([]);
            setQuestion("");


            const token =
                localStorage.getItem("token");


            const response = await fetch(
                `http://localhost:5000/api/ai/interview/${selectedResume}`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                setError(
                    data.message ||
                    "Failed to start interview"
                );

                return;
            }


            const firstQuestion =
                data.question || "";


            setQuestion(firstQuestion);


            setMessages([
                {
                    type: "ai",
                    text: firstQuestion,
                },
            ]);


        } catch (error) {

            console.error(error);

            setError(
                "Unable to connect to AI service"
            );

        } finally {

            setStarting(false);
        }
    };


    // Send answer
    const sendAnswer = async () => {

        if (!answer.trim()) {

            return;
        }


        if (!question) {

            setError(
                "Please start the interview first"
            );

            return;
        }


        try {

            setSending(true);
            setError("");


            const token =
                localStorage.getItem("token");


            const userAnswer =
                answer.trim();


            // Show user's answer immediately
            setMessages((previousMessages) => [

                ...previousMessages,

                {
                    type: "user",
                    text: userAnswer,
                },

            ]);


            setAnswer("");


            // Evaluate answer
            const response = await fetch(
                "http://localhost:5000/api/ai/evaluate-answer",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        question: question,
                        answer: userAnswer,
                    }),
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                setError(
                    data.message ||
                    "Failed to evaluate answer"
                );

                return;
            }


            const feedback =
                data.feedback || "";


            // Show AI feedback
            setMessages((previousMessages) => [

                ...previousMessages,

                {
                    type: "ai",
                    text: feedback,
                },

            ]);


            // Generate next question
            const nextQuestionResponse =
                await fetch(
                    `http://localhost:5000/api/ai/interview/${selectedResume}`,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            const nextQuestionData =
                await nextQuestionResponse.json();


            if (!nextQuestionResponse.ok) {

                setError(
                    nextQuestionData.message ||
                    "Failed to generate next question"
                );

                return;
            }


            const nextQuestion =
                nextQuestionData.question || "";


            setQuestion(nextQuestion);


            // Show next question
            setMessages((previousMessages) => [

                ...previousMessages,

                {
                    type: "ai",
                    text: nextQuestion,
                },

            ]);


        } catch (error) {

            console.error(error);

            setError(
                "Unable to connect to AI service"
            );

        } finally {

            setSending(false);
        }
    };


    // Press Enter to send
    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendAnswer();
        }
    };


    return (

        <div className="InterviewBotPage">

            <Navbar />


            <div className="InterviewBotContainer">

                <h1>
                    AI Interview Bot
                </h1>


                {loading && (
                    <p className="InterviewMessage">
                        Loading resumes...
                    </p>
                )}


                {error && (
                    <p className="InterviewError">
                        {error}
                    </p>
                )}


                {!loading &&
                    resumes.length === 0 && (

                        <p className="InterviewMessage">
                            No resumes uploaded yet.
                        </p>
                    )
                }


                {!loading &&
                    resumes.length > 0 && (

                        <>

                            {/* Resume selection */}

                            <div className="InterviewSelector">

                                <label>
                                    Select Resume
                                </label>


                                <select
                                    value={selectedResume}
                                    onChange={(e) =>
                                        setSelectedResume(
                                            e.target.value
                                        )
                                    }
                                >

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
                                    onClick={
                                        startInterview
                                    }
                                    disabled={starting}
                                >

                                    {starting
                                        ? "Starting..."
                                        : "Start Interview"
                                    }

                                </button>

                            </div>


                            {/* WhatsApp style chat */}

                            {messages.length > 0 && (

                                <div className="InterviewChat">

                                    <div className="InterviewMessages">

                                        {messages.map(
                                            (message, index) => (

                                                <div
                                                    key={index}
                                                    className={
                                                        message.type === "user"
                                                            ? "InterviewBubble user"
                                                            : "InterviewBubble ai"
                                                    }
                                                >

                                                    {message.text}

                                                </div>

                                            )
                                        )}

                                    </div>


                                    {/* Keyboard input */}

                                    <div className="InterviewInputArea">

                                        <textarea
                                            value={answer}
                                            onChange={(e) =>
                                                setAnswer(
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={
                                                handleKeyDown
                                            }
                                            placeholder="Type your answer..."
                                            disabled={sending}
                                            rows="1"
                                        />


                                        <button
                                            type="button"
                                            onClick={
                                                sendAnswer
                                            }
                                            disabled={
                                                sending ||
                                                !answer.trim()
                                            }
                                        >

                                            {sending
                                                ? "..."
                                                : "Send"
                                            }

                                        </button>

                                    </div>

                                </div>
                            )}

                        </>
                    )}

            </div>


            <Footer />

        </div>
    );
}


export default InterviewBot;