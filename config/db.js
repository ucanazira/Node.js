const mysql = require("mysql2");
const conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "db_pemesanan_buku",
});
conn.connect((err) => {
  if (err) throw err;
  console.log("Terkoneksi ke database");
});
module.exports = conn;
