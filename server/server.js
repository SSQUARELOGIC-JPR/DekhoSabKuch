const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
require("colors");

const connectDB = require("./src/config/db");

// Routes
const authRoutes = require("./src/routes/auth.routes");
const providerRoutes = require("./src/routes/provider.routes");
const userRoutes = require("./src/routes/user.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const supportRoutes = require("./src/routes/supportRoutes");

// Config
dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Root Route
app.get("/", (req, res) => {
  res.send("<h1>Dekho Sab Kuch</h1>");
});

// Static Uploads (Simplified & Faster)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "src/uploads"))
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/support", supportRoutes);

// Listen
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgCyan.white);
});