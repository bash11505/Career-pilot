import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import "../CSS/Login.css";
import "../CSS/SignUp.css";
import { useState } from "react";

function SignUp() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignUp(event) {
        event.preventDefault();

        setError("");

        if (!username.trim()) {
            setError("Username is required");
            return;
        }

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        if (!password.trim()) {
            setError("Password is required");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters"
            );
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: username.trim(),
                        email: email.trim(),
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Signup failed"
                );
                return;
            }

            navigate("/");

        } catch (error) {
            console.error(
                "Signup error:",
                error
            );

            setError(
                "Unable to connect to backend"
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="SignUp auth-page">
            <div className="AuthShell">
                <div className="SignUpFormPanel auth-form-panel">
                    <div className="AuthFormContent">
                        <p className="AuthKicker">Spark Analyzer</p>
                        <h1>Sign up</h1>
                        <p className="AuthHint AuthIntro">Create your account to begin.</p>
                        <form onSubmit={handleSignUp}>

                <h6>
                    Email
                </h6>

                <input
                    type="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />

                <h6>
                    Username
                </h6>

                <input
                    type="text"
                    placeholder="Enter your Username"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                    required
                />

                <h6>
                    Password
                </h6>

                <input
                    type="password"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Signing up..."
                        : "Sign Up"}
                </button>

                        </form>

                        {error && <p className="SignUpError">{error}</p>}

                        <p className="SignUpLogin">Already have an account? <Link to="/">Sign in</Link></p>
                    </div>
                </div>

                <section className="AuthWelcomePanel">
                    <span className="AuthPanelOrb" aria-hidden="true" />
                    <div>
                        <p className="AuthKicker">Welcome back</p>
                        <h2>Glad to see you!</h2>
                        <p>Already have an account? Pick up where you left off.</p>
                        <Link className="AuthOutlineButton" to="/">Sign in</Link>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}

export default SignUp;