import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import roadmapImage from '../assets/Neon Developer Tech Stack Infographic.png';
import "../CSS/Flowchart.css";

function Flowchart() {
    return (
        <div className="FlowchartPage">
            <Navbar />
            <main className="FlowchartContainer">
                <h1>Career Roadmap &amp; Flowchart</h1>
                <p>Explore the skills and technologies that shape a modern developer career, from frontend and backend foundations to cloud and AI.</p>
                <figure className="FlowchartFigure">
                    <img
                        className="FlowchartImage"
                        src={roadmapImage}
                        alt="Developer technology roadmap covering frontend, backend, databases, cloud, and AI skills"
                    />
                    <figcaption>
                        A visual guide to the skills, tools, and technologies you can build on your career path.
                    </figcaption>
                </figure>
            </main>
            <Footer />
        </div>
    );
}

export default Flowchart;
