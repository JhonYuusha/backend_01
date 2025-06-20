const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "joao2008admin",
  database: "gm_technology",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco:", err.message);
    process.exit(1);
  }
  console.log("✅ Conectado ao banco de dados!");
});

// Configuração do Nodemailer (Gmail com senha de app)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gmtecnologiaeinformatica@gmail.com",
    pass: "hidf pouw dabs xyee", // Senha de app (não é a senha normal do Gmail!)
  },
});

// Rota de orçamento
app.post("/api/orcamentos", (req, res) => {
  const { nome, email, telefone, mensagem } = req.body;

  // 1️⃣ Inserir no banco de dados
  const sql = "INSERT INTO orcamentos (nome, email, telefone, mensagem) VALUES (?, ?, ?, ?)";
  db.query(sql, [nome, email, telefone, mensagem], (err, result) => {
    if (err) {
      console.error("❌ Erro ao salvar no banco:", err.message);
      return res.status(500).send("Erro ao salvar no banco.");
    }

    // 2️⃣ Enviar e-mail para dois destinatários
    const mailOptions = {
      from: "G&M Technology <gmtecnologiaeinformatica@gmail.com>",
      to: ["gmtecnologiaeinformatica@gmail.com", "jovitorgsilva@gmail.com"],
      subject: "📨 Novo orçamento pelo site - G&M",
      html: `
        <h2>Nova solicitação de orçamento</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>Mensagem:</strong><br>${mensagem}</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("❌ Erro ao enviar e-mail:", err);
        return res.status(500).send("Erro ao enviar e-mail.");
      }

      console.log("✉️ E-mail enviado com sucesso:", info.response);
      res.status(200).send("Orçamento salvo e e-mail enviado com sucesso!");
    });
  });
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});