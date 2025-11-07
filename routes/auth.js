const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

router.post("/register", (req, res) => {
  const { nama, email, password, telepon, alamat } = req.body;
  const password_hash = bcrypt.hashSync(password, 10);
  const id = uuidv4();

  const sql =
    "INSERT INTO pengguna (id, nama, email, password_hash, telepon, alamat) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [id, nama, email, password_hash, telepon, alamat],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Registrasi berhasil", id });
    }
  );
});

module.exports = router;
