import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{
        width: "220px",
        background: "#0f172a",
        color: "#fff",
        height: "100vh",
        padding: "20px",
      }}
    >
      <h2>Dekho</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "30px" }}>
        <Link to="/" style={{ color: "#fff" }}>Dashboard</Link>
        <Link to="/users" style={{ color: "#fff" }}>Users</Link>
        <Link to="/providers" style={{ color: "#fff" }}>Providers</Link>
        <Link to="/categories" style={{ color: "#fff" }}>Categories</Link>
        <Link to="/cities" style={{ color: "#fff" }}>Cities</Link>
        <Link to="/complaints" style={{ color: "#fff" }}>Complaints</Link>
      </nav>
    </div>
  );
};

export default Sidebar;