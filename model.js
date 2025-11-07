const db = require("./config/db");

module.exports = {
  //BUKU
  getAllBuku(callback) {
    db.query("SELECT * FROM buku", callback);
  },

  getBukuById(id, callback) {
    db.query("SELECT * FROM buku WHERE id = ?", [id], callback);
  },

  cariBuku(judul, callback) {
    db.query("SELECT * FROM buku WHERE judul LIKE ?", [`%${judul}%`], callback);
  },

  tambahBuku(data, callback) {
    db.query("INSERT INTO buku SET ?", data, callback);
  },

  //PENGGUNA
  getPenggunaById(id, callback) {
    db.query(
      "SELECT id, nama, email, telepon, alamat FROM pengguna WHERE id = ?",
      [id],
      callback
    );
  },

  updatePengguna(id, data, callback) {
    db.query("UPDATE pengguna SET ? WHERE id = ?", [data, id], callback);
  },

  //OAUTH
  getUserByEmail(email, callback) {
    db.query("SELECT * FROM pengguna WHERE email = ?", [email], callback);
  },

  createUser(data, callback) {
    db.query("INSERT INTO pengguna SET ?", data, callback);
  },

  //PEMESANAN
  getHargaBuku(buku_id, callback) {
    db.query("SELECT harga, judul FROM buku WHERE id = ?", [buku_id], callback);
  },

  buatPemesanan(data, callback) {
    db.query("INSERT INTO pemesanan SET ?", data, callback);
  },

  getPemesananById(id, callback) {
    db.query("SELECT * FROM pemesanan WHERE id = ?", [id], callback);
  },

  getPemesananUser(pengguna_id, callback) {
    db.query(
      "SELECT * FROM pemesanan WHERE pengguna_id = ?",
      [pengguna_id],
      callback
    );
  },

  cancelPemesanan(id, callback) {
    db.query(
      "UPDATE pemesanan SET status = 'dibatalkan' WHERE id = ?",
      [id],
      callback
    );
  },

  //DETAIL PEMESANAN
  buatDetailPemesanan(data, callback) {
    db.query(
      `INSERT INTO detail_pemesanan 
     (pemesanan_id, buku_id, judul, jumlah, harga_satuan, format_download)
     VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.pemesanan_id,
        data.buku_id,
        data.judul,
        data.jumlah,
        data.harga_satuan,
        data.format_download,
      ],
      callback
    );
  },

  getDetailPemesanan(pemesanan_id, callback) {
    db.query(
      `SELECT d.id, d.pemesanan_id, d.buku_id, d.judul, d.jumlah, d.harga_satuan, d.format_download
       FROM detail_pemesanan d
       WHERE d.pemesanan_id = ?`,
      [pemesanan_id],
      callback
    );
  },
};
