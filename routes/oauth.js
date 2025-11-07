// routes/oauth.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const CLIENT_ID = "aplikasi-client";
const CLIENT_SECRET = "rahasia";

router.post("/token", (req, res) => {
  const { username, password, client_id, client_secret, grant_type } = req.body;

  if (
    !username ||
    !password ||
    !client_id ||
    !client_secret ||
    grant_type !== "password"
  ) {
    return res
      .status(400)
      .json({ error: "Parameter tidak lengkap atau grant_type salah" });
  }

  if (client_id !== CLIENT_ID || client_secret !== CLIENT_SECRET) {
    return res.status(401).json({ error: "Client ID atau secret tidak valid" });
  }

  db.query(
    "SELECT * FROM pengguna WHERE email = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0)
        return res.status(400).json({ error: "User tidak ditemukan" });

      const user = results[0];
      const valid = bcrypt.compareSync(password, user.password_hash);
      if (!valid) return res.status(400).json({ error: "Password salah" });

      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: 3600 }
      );

      res.json({
        access_token: accessToken,
        token_type: "Bearer",
        expires_in: 3600,
        refresh_token: "mocked-refresh-token",
      });
    }
  );
});

module.exports = router;
