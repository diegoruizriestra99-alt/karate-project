const express = require('express');
const cors = require('cors');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// ===== Configuracion del servidor =====
const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'karate.db');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'karate.html'));
});

let db;
let pool;

// ===== Inicializar base de datos =====
async function initDB() {
  if (DATABASE_URL) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inscripciones (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        telefono TEXT,
        estilo TEXT NOT NULL,
        nivel TEXT NOT NULL,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('OK: PostgreSQL connected');
  } else {
    const SQL = await initSqlJs();
    if (fs.existsSync(DB_PATH)) {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
    } else {
      db = new SQL.Database();
    }
    db.run(`
      CREATE TABLE IF NOT EXISTS inscripciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        telefono TEXT,
        estilo TEXT NOT NULL,
        nivel TEXT NOT NULL,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    guardarDB();
  }
}

function guardarDB() {
  if (db && !DATABASE_URL) {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
}

app.post('/api/inscripcion', async (req, res) => {
  const { nombre, email, telefono, estilo, nivel } = req.body;
  if (!nombre || !email || !estilo || !nivel) return res.status(400).json({ error: 'Faltan campos' });
  try {
    if (DATABASE_URL) {
      await pool.query(
        'INSERT INTO inscripciones (nombre, email, telefono, estilo, nivel) VALUES ($1, $2, $3, $4, $5)',
        [nombre, email, telefono || null, estilo, nivel]
      );
    } else {
      db.run(
        'INSERT INTO inscripciones (nombre, email, telefono, estilo, nivel) VALUES (?, ?, ?, ?, ?)',
        [nombre, email, telefono || null, estilo, nivel]
      );
      guardarDB();
    }
    res.status(201).json({ mensaje: 'Exito' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/inscripciones', async (req, res) => {
  try {
    if (DATABASE_URL) {
      const r = await pool.query('SELECT * FROM inscripciones ORDER BY fecha_registro DESC');
      res.json(r.rows);
    } else {
      const r = db.exec('SELECT * FROM inscripciones ORDER BY fecha_registro DESC');
      if (!r.length) return res.json([]);  const cols = r[0].columns;
      res.json(r[0].values.map(v => Object.fromEntries(cols.map((c, i) => [c, v[i]))));
    }
  } catch (e) { res.status(500).json({ error: e.message }); }
});

initDB().then(() => {
  app.listen(PORT, () => console.log('Port: ' + PORT));
}).catch(e => process.exit(1));

process.on('SIGINT', async () => {
  if (DATABASE_URL) await pool.end();
  else if (db) { guardarDB(); db.close(); }
  process.exit(0);
});
