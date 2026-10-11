import Navbar from "../Components/Navbar";
import "../CSS/Home.css";

function Home() {
    return (
        <div className="Home">
            <Navbar />
            <main className="HomeHero">
                <h1>Career Pilot</h1>
            </main>
        </div>
    );
}

export default Home;