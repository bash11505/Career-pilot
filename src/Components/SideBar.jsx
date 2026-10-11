import { NavLink } from "react-router-dom";
import { FiBarChart2, FiFileText, FiCpu, FiSearch, FiMic, FiPieChart, FiMessageCircle, FiMap, FiUser } from "react-icons/fi";
import "../CSS/SideBar.css";
function SideBar({ open = false, onNavigate }) {
    const items = [
        ["/home", "Dashboard", FiBarChart2],
        ["/resume", "Upload resume", FiFileText],
        ["/ai", "Resume score", FiCpu],
        ["/resume-analysis", "Resume analysis", FiSearch],
        ["/interview-bot", "Interview practice", FiMic],
        ["/data-analytics", "Analytics", FiPieChart],
        ["/chat-ai", "Chat with AI", FiMessageCircle],
        ["/flow-chart", "Career roadmap", FiMap],
        ["/profile", "Profile", FiUser],
    ];

    return (
        <aside className={`AppSidebar${open ? " is-open" : ""}`}>
            <p className="SidebarEyebrow">Workspace</p>
            <ul className="SideBar">
                {items.map(([path, label, Icon]) => (
                    <li key={path}>
                        <NavLink onClick={onNavigate} className={({ isActive }) => `SidebarLink${isActive ? " active" : ""}`} to={path}>
                            <Icon />
                            <span>{label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
            <p className="SidebarFooter">Spark Analyzer <span>v2.0</span></p>
        </aside>
    );
}

export default SideBar;