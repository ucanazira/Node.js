const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const model = require("../model");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// Konfigurasi upload bukti pembayaran
const storage = multer.diskStorage({
  destination: "uploads/bukti",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

//Tambah Pemesanan Baru
router.post("/", auth, upload.single("bukti_pembayaran"), (req, res) => {
  const data = req.body;
  const buktiPath = req.file ? `/uploads/bukti/${req.file.filename}` : null;

  model.getBukuById(data.buku_id, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Gagal mengambil data buku", error: err });
    if (result.length === 0) {
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }

    const buku = result[0];
    const harga = buku.harga;
    const total = harga * parseInt(data.jumlah);
    const pemesananId = crypto.randomUUID();

    const pemesanan = {
      id: pemesananId,
      pengguna_id: data.pengguna_id,
      buku_id: data.buku_id,
      jumlah: data.jumlah,
      total_harga: total,
      metode_pembayaran: data.metode_pembayaran,
      bukti_pembayaran: buktiPath,
      status: "diproses",
    };

    // Simpan ke tabel pemesanan
    model.buatPemesanan(pemesanan, (err2) => {
      if (err2)
        return res
          .status(500)
          .json({ message: "Gagal menyimpan pemesanan", error: err2 });

      // Simpan ke tabel detail_pemesanan
      const detail = {
        pemesanan_id: pemesananId,
        buku_id: data.buku_id,
        judul: buku.judul,
        jumlah: data.jumlah,
        harga_satuan: harga,
        format_download: "PDF",
      };

      model.buatDetailPemesanan(detail, (err3) => {
        if (err3)
          return res
            .status(500)
            .json({ message: "Gagal menyimpan detail pemesanan", error: err3 });

        res.status(201).json({
          message: "Pemesanan berhasil",
          pemesanan_id: pemesananId,
        });
      });
    });
  });
});

router.get("/:id/detail", auth, (req, res) => {
  model.getDetailPemesanan(req.params.id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({
      pemesanan_id: req.params.id,
      detail: result,
    });
  });
});

//Ambil 1 Pemesanan berdasarkan ID
router.get("/:id", auth, (req, res) => {
  model.getPemesananById(req.params.id, (err, result) => {
    if (err) return res.status(500).json(err);
    if (!result.length)
      return res.status(404).json({ message: "Pemesanan tidak ditemukan" });
    res.json(result[0]);
  });
});

//Semua Pesanan User
router.get("/user/:id", auth, (req, res) => {
  model.getPemesananUser(req.params.id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

//Batalkan pesanan
router.post("/:id/cancel", auth, (req, res) => {
  model.cancelPemesanan(req.params.id, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Pemesanan dibatalkan" });
  });
});

//Download
router.post("/:id/download", auth, (req, res) => {
  model.getDetailPemesanan(req.params.id, (err, detail) => {
    if (err) return res.status(500).json(err);
    if (!detail.length) {
      return res
        .status(404)
        .json({ message: "Detail pemesanan tidak ditemukan" });
    }

    const bukuId = detail[0].buku_id;

    model.getBukuById(bukuId, (err2, bukuResult) => {
      if (err2) return res.status(500).json(err2);
      if (!bukuResult.length) {
        return res.status(404).json({ message: "Buku tidak ditemukan" });
      }

      const buku = bukuResult[0];
      if (!buku.file_pdf) {
        return res.status(404).json({ message: "File PDF belum tersedia" });
      }

      res.json({
        message: "Buku siap diunduh",
        download_url: buku.file_pdf,
      });
    });
  });
});

module.exports = router;
