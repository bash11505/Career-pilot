import { Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Profile from "./Pages/Profile";
import Resume from "./Pages/Resume";
import AI from "./Pages/AI";
import ResumeAnalysis from "./Pages/ResumeAnalysis";
import InterviewBot from "./Pages/InterviewBot";
import DataAnalytics from "./Pages/DataAnalytics";
import ChatAi from "./Pages/ChatAi";
import Flowchart from "./Pages/Flowchart";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
    return (
        <Routes>

            <Route path="/" element={<Login />} />

            <Route path="/signup" element={<SignUp />} />

            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />

            <Route path="/about" element={<About />} />

            <Route path="/contact" element={<Contact />} />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/resume"
                element={
                    <ProtectedRoute>
                        <Resume />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/ai"
                element={
                    <ProtectedRoute>
                        <AI />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/resume-analysis"
                element={
                    <ProtectedRoute>
                        <ResumeAnalysis />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/interview-bot"
                element={
                    <ProtectedRoute>
                        <InterviewBot />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/data-analytics"
                element={
                    <ProtectedRoute>
                        <DataAnalytics />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/chat-ai"
                element={
                    <ProtectedRoute>
                        <ChatAi />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/flow-chart"
                element={
                    <ProtectedRoute>
                        <Flowchart />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/flowchart"
                element={
                    <ProtectedRoute>
                        <Flowchart />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default App;