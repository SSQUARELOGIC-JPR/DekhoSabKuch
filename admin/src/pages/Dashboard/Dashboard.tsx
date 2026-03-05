import Layout from "../../components/Layout";

const Dashboard = () => {
  return (
    <Layout>
      <h1>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
          <h3>Total Users</h3>
          <h2>120</h2>
        </div>

        <div style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
          <h3>Total Providers</h3>
          <h2>45</h2>
        </div>

        <div style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
          <h3>Total Complaints</h3>
          <h2>8</h2>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;