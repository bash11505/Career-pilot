import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../CSS/About.css";

function About() {
    return (
        <div className="About">

            <Navbar />

            <div className="AboutContent">
                <h1>About Spark Analyzer</h1>

                <p>
                    Spark Analyzer is a career platform designed
                    to help students build and improve their
                    professional careers.
                </p>

                <p>
                    It provides features for resume management,
                    resume analysis, interview preparation,
                    data analytics, and AI-powered assistance.
                </p>
            </div>

            <Footer />

        </div>
    );
}

export default About;