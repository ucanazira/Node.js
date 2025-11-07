const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const model = require("../model");
const path = require("path");
const fs = require("fs");

// GET detail pemesanan
router.get("/:id/detail", auth, (req, res) => {
  model.getDetailPemesanan(req.params.id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ pemesanan_id: req.params.id, detail: result });
  });
});

// POST download file buku
router.post("/:id/download", auth, (req, res) => {
  const pemesananId = req.params.id;

  // Ambil data pemesanan
  model.getPemesananById(pemesananId, (err, result) => {
    if (err) return res.status(500).json(err);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Pemesanan tidak ditemukan" });
    }

    const pemesanan = result[0];

    if (pemesanan.status !== "selesai") {
      return res
        .status(403)
        .json({ message: "Pemesanan belum selesai atau dibatalkan" });
    }

    // Ambil data buku
    model.getBukuById(pemesanan.buku_id, (err2, bukuResult) => {
      if (err2) return res.status(500).json(err2);
      if (!bukuResult || bukuResult.length === 0) {
        return res.status(404).json({ message: "Buku tidak ditemukan" });
      }

      const fileName = bukuResult[0].file_pdf;
      const filePath = path.join(__dirname, "../uploads/files", fileName);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File buku tidak tersedia" });
      }

      res.download(filePath, bukuResult[0].judul + ".pdf");
    });
  });
});

module.exports = router;
