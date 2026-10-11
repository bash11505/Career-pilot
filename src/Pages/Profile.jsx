import { useState, useEffect } from "react";
import UserGreetings from "../Components/UserGreetings";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../CSS/Profile.css";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Please login first");
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/api/profile",
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
                        "Failed to load profile"
                    );
                    return;
                }

                setProfile(data);

            } catch (error) {
                console.error(
                    "Profile loading error:",
                    error
                );

                setError(
                    "Unable to connect to backend"
                );

            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="Profile">
                <Navbar />

                <div className="ProfileMessage">
                    <p>Loading profile...</p>
                </div>

                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="Profile">
                <Navbar />

                <div className="ProfileMessage">
                    <p>{error}</p>
                </div>

                <Footer />
            </div>
        );
    }

    return (
        <div className="Profile">

            <Navbar />

            <div className="ProfileContent">

                <UserGreetings
                    isLoggedIn={true}
                    name={profile?.name || "User"}
                />

                <h1>My Profile</h1>

                <div className="ProfileCard">

                    <p>
                        <strong>Name:</strong>{" "}
                        {profile?.name || "Not available"}
                    </p>

                    <p>
                        <strong>Email:</strong>{" "}
                        {profile?.email || "Not available"}
                    </p>

                    <p>
                        <strong>Account Created:</strong>{" "}
                        {profile?.createdAt
                            ? new Date(
                                  profile.createdAt
                              ).toLocaleDateString()
                            : "Not available"}
                    </p>

                </div>

            </div>

            <Footer />

        </div>
    );
}

export default Profile;