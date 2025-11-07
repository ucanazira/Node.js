const express = require("express");
const router = express.Router();
const model = require("../model");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");

//GET profil pengguna
router.get("/:id", auth, (req, res) => {
  model.getPenggunaById(req.params.id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});

//PUT update pengguna
router.put("/:id", auth, (req, res) => {
  const data = req.body;
  model.updatePengguna(req.params.id, data, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Data pengguna diperbarui" });
  });
});

//GET semua pemesanan oleh pengguna
router.get("/:id/pemesanan", auth, (req, res) => {
  const id = req.params.id;
  model.getPemesananUser(id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

module.exports = router;
