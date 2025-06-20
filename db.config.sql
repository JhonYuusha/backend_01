const mysql = require("mysql");
require("dotenv").config();

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco:", err.message);
    process.exit(1);
  }
  console.log("✅ Conectado ao banco de dados!");
});

module.exports = db;