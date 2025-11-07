const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middlewares/auth");

// Tambah kategori
router.post("/", auth, (req, res) => {
  const { id, nama } = req.body;
  const sql = "INSERT INTO kategori (id, nama) VALUES (?, ?)";
  db.query(sql, [id, nama], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Kategori berhasil ditambahkan", id });
  });
});

// Lihat semua kategori
router.get("/", (req, res) => {
  db.query("SELECT * FROM kategori", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

module.exports = router;
