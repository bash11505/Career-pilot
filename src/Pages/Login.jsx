import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import "../CSS/Login.css";



//API key
function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(event) {
        event.preventDefault();

        setError("");

        if (!username.trim()) {
            setError("Email is required");
            return;
        }

        if (!password.trim()) {
            setError("Password is required");
            return;
        }


        //try and catch block 
        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: username.trim(),
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Invalid email or password"
                );
                return;
            }

            if (!data.token) {
                setError(
                    "Login successful, but token was not received"
                );
                return;
            }

            localStorage.setItem(
                "token",
                data.token
            );

            navigate("/home");

        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            setError(
                "Unable to connect to backend"
            );

        } finally {
            setLoading(false);
        }
    }




    //HTML Starts 
    return (
        <div className="LoginPage auth-page">
            <div className="AuthShell">
                <div className="Login auth-form-panel">
                    <div className="AuthFormContent">
                        <p className="AuthKicker">Spark Analyzer</p>
                        <h1 className="LoginTitle">Sign in</h1>
                        <p className="AuthHint">Use your account details</p>

                        <form className="LoginForm" onSubmit={handleLogin}>

                    <input
                        id="username"
                        type="email"
                        placeholder="Enter your email"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        required
                    />

                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    <a className="AuthForgot" href="#forgot-password">Forgot your password?</a>
                    <button type="submit" disabled={loading}>
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                        </form>

                        {error && <p className="LoginError">{error}</p>}

                        <p className="LoginSignup">Don't have an account? <Link to="/signup">Sign up</Link></p>
                    </div>
                </div>

                <section className="AuthWelcomePanel">
                    <span className="AuthPanelOrb" aria-hidden="true" />
                    <div>
                        <p className="AuthKicker">A clearer career path</p>
                        <h2>Hello, friend!</h2>
                        <p>Enter your personal details and start your journey with us.</p>
                        <Link className="AuthOutlineButton" to="/signup">Sign up</Link>
                    </div>
                </section>
            </div>

            <Footer />

        </div>
    );
}

export default Login;