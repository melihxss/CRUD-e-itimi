// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sql, queryDb } = require("./db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API çalışıyor");
});


// --------------------------------------------------------------

app.get("/api/users", async (req, res) => {
  try {
    const result = await queryDb("SELECT * FROM Users");
    res.json(result.recordset);
  } catch (err) {
    console.error("GET /api/users error:", err);
    res.status(500).json({ error: "Veri alınırken hata" });
  }
});

// --------------------------------------------------------------

app.get("/api/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await queryDb(
      "SELECT * FROM Users WHERE Id = @id",
      [{ name: "id", type: sql.Int, value: id }]
    );
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("GET /api/users/:id error:", err);
    res.status(500).json({ error: "Veri alınırken hata" });
  }
});

// --------------------------------------------------------------

app.post("/api/users", async (req, res) => {
  try {
    const { Name, Email } = req.body;

    await queryDb(
      "INSERT INTO Users (Name, Email) VALUES (@name, @email)",
      [
        { name: "name", type: sql.NVarChar, value: Name },
        { name: "email", type: sql.NVarChar, value: Email },
      ]
    );

    res.status(201).json({ message: "Kullanıcı eklendi" });
  } catch (err) {
    console.error("POST /api/users error:", err);
    res.status(500).json({ error: "Kullanıcı eklenirken hata" });
  }
});

// --------------------------------------------------------------

app.put("/api/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { Name, Email } = req.body;

    await queryDb(
      "UPDATE Users SET Name = @name, Email = @email WHERE Id = @id",
      [
        { name: "id", type: sql.Int, value: id },
        { name: "name", type: sql.NVarChar, value: Name },
        { name: "email", type: sql.NVarChar, value: Email },
      ]
    );

    res.json({ message: "Kullanıcı güncellendi" });
  } catch (err) {
    console.error("PUT /api/users/:id error:", err);
    res.status(500).json({ error: "Güncellenirken hata" });
  }
});

// --------------------------------------------------------------

app.delete("/api/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await queryDb(
      "DELETE FROM Users WHERE Id = @id",
      [{ name: "id", type: sql.Int, value: id }]
    );

    res.json({ message: "Kullanıcı silindi" });
  } catch (err) {
    console.error("DELETE /api/users/:id error:", err);
    res.status(500).json({ error: "Silinirken hata" });
  }
});

// --------------------------------------------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API ${PORT} portunda çalışıyor`);
});
