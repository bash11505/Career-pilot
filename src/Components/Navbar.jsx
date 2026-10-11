import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu, FiX, FiCompass } from "react-icons/fi";
import { useState } from "react";
import SideBar from "./SideBar";
import "../CSS/Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const isAuthenticated = Boolean(localStorage.getItem("token"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <>
            {isAuthenticated && (
                <>
                    <button className={`SidebarBackdrop${menuOpen ? " is-visible" : ""}`} type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />
                    <SideBar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
                </>
            )}
            <header className="NavBar">
                <div className="NavBarBrand">
                    <button
                        className="NavBarMenu"
                        type="button"
                        aria-label="Toggle navigation"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                    <Link className="BrandMark" to={isAuthenticated ? "/home" : "/"}>
                        <span className="BrandIcon"><FiCompass /></span>
                        <span>Spark Analyzer</span>
                    </Link>
                </div>

                <div className="NavBarActions">
                    <NavLink className={({ isActive }) => `NavBarLink${isActive ? " active" : ""}`} to="/about">About</NavLink>
                    <NavLink className={({ isActive }) => `NavBarLink${isActive ? " active" : ""}`} to="/contact">Contact</NavLink>
                    <button className="LogoutButton" type="button" onClick={handleLogout}>
                        <FiLogOut />
                        <span>{isAuthenticated ? "Log out" : "Back to sign in"}</span>
                    </button>
                </div>
            </header>
        </>
    );
}

export default Navbar;