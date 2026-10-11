import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../CSS/Contact.css";

function Contact() {
    return (
        <div className="ContactPage">
            <Navbar />
            <div className="ContactContainer">
                <h1>Contact Us</h1>
                <p>Have questions, feedback, or need assistance? Reach out to the Spark Analyzer team.</p>
                <p>Email: <a href="mailto:support@careerpilot.com">support@careerpilot.com</a></p>
            </div>
            <Footer />
        </div>
    );
}

export default Contact;