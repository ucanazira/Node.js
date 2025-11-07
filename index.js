const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Uploads & Bukti
const uploadPath = path.join(__dirname, "uploads", "bukti");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const oauthRoutes = require("./routes/oauth");
const authRoutes = require("./routes/auth");
const bukuRoutes = require("./routes/buku");
const penggunaRoutes = require("./routes/pengguna");
const pemesananRoutes = require("./routes/pemesanan");
const detailRoutes = require("./routes/detail");
const kategoriRoutes = require("./routes/kategori");

app.use("/oauth", oauthRoutes);
app.use("/auth", authRoutes);
app.use("/buku", bukuRoutes);
app.use("/pengguna", penggunaRoutes);
app.use("/pemesanan", pemesananRoutes);
app.use("/detail", detailRoutes);
app.use("/kategori", kategoriRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API Pemesanan Buku Online berjalan dengan baik 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server API berjalan di: http://localhost:${PORT}`);
});
