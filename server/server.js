const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

require("colors");

const connectDB = require("./src/config/db");

// dotenv config
dotenv.config();

// DB connect
connectDB();

// App init
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
// Routes
app.get("/", (req, res) => {
  res.send("<h1>Dekho Sab Kuch</h1>");
});

app.use("/api/auth", require("./src/routes/auth.routes"));

// Listen
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgCyan.white);
});
