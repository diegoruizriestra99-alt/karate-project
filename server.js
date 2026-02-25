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
app.use(express.static(path.join(__dirname
)));

app.get('/', (req, res) => {
 res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/googleccb11994b589a2e5.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'googleccb11994b589a2e5.html'));
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
