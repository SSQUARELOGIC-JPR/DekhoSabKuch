const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require('./src/routes/auth.routes');
const providerRoutes = require('./src/routes/provider.routes');
const userRoutes = require('./src/routes//user.routes');
const paymentRoutes = require('./src/routes/payment.routes');
const seedProviders = require('./utills/seedProviders');
const supportRoutes = require('./src/routes/supportRoutes');


const path = require('path');
const fs = require('fs');

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

app.use('/uploads', (req, res, next) => {
  const filePath = path.join(__dirname, 'src/uploads', req.path);

  // exact file exists
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  // try alternative extensions
  const extVariants = ['.jpg', '.jpeg', '.png', '.webp'];

  for (const ext of extVariants) {
    const altPath = filePath.replace(/\.\w+$/, ext);
    if (fs.existsSync(altPath)) {
      return res.sendFile(altPath);
    }
  }

  // fallback next
  next();
});

console.log(
  'Static path =>',
  path.join(__dirname, 'src/uploads')
);
//auth routes
app.use("/api/auth", authRoutes);

//provider routes
app.use('/api', providerRoutes);
//seedProviders();

//user routes
app.use('/api/user', userRoutes);

app.use('/api/payment', paymentRoutes)

app.use('/api/support', supportRoutes);

// Listen
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgCyan.white);
});
