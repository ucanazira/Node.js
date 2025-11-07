const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const model = require("../model");
const db = require("../config/db");

const multer = require("multer");
const path = require("path");

// Konfigurasi upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "cover") {
      cb(null, "uploads/");
    } else if (file.fieldname === "file_pdf") {
      cb(null, "uploads/files/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

//GET semua buku
router.get("/", (req, res) => {
  model.getAllBuku((err, result) => {
    if (err) return res.status(500).json(err);

    const host = req.protocol + "://" + req.get("host");

    const updated = result.map((b) => ({
      ...b,
      cover_url: b.cover_url ? host + b.cover_url : null,
      file_pdf: b.file_pdf ? host + b.file_pdf : null,
    }));

    res.json(updated);
  });
});

//GET buku berdasarkan ID
router.get("/:id", (req, res) => {
  model.getBukuById(req.params.id, (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0)
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.json(result[0]);
  });
});

//Tambah buku via FORM-DATA
router.post(
  "/",
  auth,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "file_pdf", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const data = req.body;
      const cover =
        req.files && req.files["cover"]
          ? `/uploads/${req.files["cover"][0].filename}`
          : null;
      const file_pdf =
        req.files && req.files["file_pdf"]
          ? `/uploads/files/${req.files["file_pdf"][0].filename}`
          : null;

      const buku = {
        id: data.id,
        judul: data.judul,
        penulis: data.penulis,
        penerbit: data.penerbit,
        tahun_terbit: data.tahun_terbit,
        halaman: data.halaman,
        harga: data.harga,
        deskripsi: data.deskripsi,
        cover_url: cover,
        file_pdf: file_pdf,
        rating: data.rating,
        stok: data.stok,
        kategori_id: data.kategori_id,
      };

      model.tambahBuku(buku, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Buku berhasil ditambahkan", id: buku.id });
      });
    } catch (e) {
      res
        .status(400)
        .json({ message: "Gagal memproses data", error: e.message });
    }
  }
);

//Tambah buku
router.post("/json", auth, (req, res) => {
  const buku = req.body;
  model.tambahBuku(buku, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Buku berhasil ditambahkan (via JSON)", id: buku.id });
  });
});

// Update buku
router.put("/:id", auth, (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const sql = `
    UPDATE buku SET 
      judul = ?, penulis = ?, penerbit = ?, tahun_terbit = ?, halaman = ?, 
      harga = ?, deskripsi = ?, rating = ?, stok = ?, kategori_id = ? 
    WHERE id = ?
  `;

  const values = [
    data.judul,
    data.penulis,
    data.penerbit,
    data.tahun_terbit,
    data.halaman,
    data.harga,
    data.deskripsi,
    data.rating,
    data.stok,
    data.kategori_id,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Buku berhasil diperbarui" });
  });
});
// Hapus buku
router.delete("/:id", auth, (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM buku WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Buku berhasil dihapus" });
  });
});

module.exports = router;
