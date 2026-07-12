import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import Icon, { paths } from "./Icon";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/app", label: "Overview", icon: "overview", end: true },
  { to: "/app/challenges", label: "Challenges", icon: "challenge" },
  { to: "/app/validations", label: "Validations", icon: "validate" },
  { to: "/app/leaderboards", label: "Leaderboards", icon: "podium" },
  { to: "/app/quests", label: "Daily Quests", icon: "quest" },
  { to: "/app/activities", label: "Activities", icon: "activity" },
  { to: "/app/settings", label: "Settings", icon: "settings" },
];


const getAdminInfo = ()=>{
    const {user } = useAuth()
    return user;
}

export default function SideBar({
  pendingCount,
  onSignOut,
}: {
  pendingCount: number;
  onSignOut: () => void;
}) {
    
    const admin = getAdminInfo();
    console.log("admin",admin)
    const initials = admin && admin.name
      ?.split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("");

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Logo size={34} />
        <div className="brand-text">
          LancerFit
          <small>Admin Console</small>
        </div>
      </div>

      <nav aria-label="Main">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
          >
            <Icon name={item.icon as keyof typeof paths} />
            {item.label}
            {item.label === "Validations" && pendingCount > 0 && (
              <span className="nav-badge">{pendingCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="avatar">{initials}</div>
        <div className="who">
          <b>{admin?.name}</b>
          <span>{admin?.role}</span>
        </div>
        <button
          className="signout"
          onClick={onSignOut}
          title="Sign out"
          aria-label="Sign out"
        >
          <Icon name="signout" />
        </button>
      </div>
    </aside>
  );
}
