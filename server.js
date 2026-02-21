const express = require('express');
const cors = require('cors');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// ===== Configuración del servidor =====
const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'karate.db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Servir archivos estáticos

// Ruta para servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'karate.html'));
});

let db;

// ===== Inicializar base de datos =====
async function initDB() {
    const SQL = await initSqlJs();

    // Si ya existe el archivo de BD, cargarlo
    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
        console.log('✅ Base de datos SQLite cargada desde archivo');
    } else {
        db = new SQL.Database();
        console.log('✅ Nueva base de datos SQLite creada');
    }

    // Crear tabla de inscripciones si no existe
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

// Guardar la base de datos al disco
function guardarDB() {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
}

// ===== Endpoints =====

// POST /api/inscripcion — Registrar un nuevo alumno
app.post('/api/inscripcion', (req, res) => {
    const { nombre, email, telefono, estilo, nivel } = req.body;

    // Validación básica
    if (!nombre || !email || !estilo || !nivel) {
        return res.status(400).json({
            error: 'Faltan campos obligatorios: nombre, email, estilo y nivel son requeridos.'
        });
    }

    // Validar formato de email
    const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'El formato del email no es válido.'
        });
    }

    // Validar que el estilo sea uno de los permitidos
    const estilosPermitidos = ['Shotokan', 'Goju-ryu', 'Wado-ryu', 'Shito-ryu'];
    if (!estilosPermitidos.includes(estilo)) {
        return res.status(400).json({
            error: 'El estilo seleccionado no es válido.'
        });
    }

    // Validar nivel
    const nivelesPermitidos = ['Principiante', 'Intermedio', 'Avanzado'];
    if (!nivelesPermitidos.includes(nivel)) {
        return res.status(400).json({
            error: 'El nivel seleccionado no es válido.'
        });
    }

    try {
        db.run(
            `INSERT INTO inscripciones (nombre, email, telefono, estilo, nivel) VALUES (?, ?, ?, ?, ?)`,
            [nombre, email, telefono || null, estilo, nivel]
        );

        guardarDB();

        // Obtener el ID del último registro insertado
        const result = db.exec('SELECT last_insert_rowid() as id');
        const id = result[0].values[0][0];

        console.log(`📝 Nueva inscripción: ${nombre} (${estilo} - ${nivel})`);

        res.status(201).json({
            mensaje: '¡Inscripción realizada con éxito!',
            id: id
        });
    } catch (error) {
        // Email duplicado
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({
                error: 'Este email ya está registrado.'
            });
        }

        console.error('Error al insertar:', error);
        res.status(500).json({
            error: 'Error interno del servidor.'
        });
    }
});

// GET /api/inscripciones — Listar todas las inscripciones
app.get('/api/inscripciones', (req, res) => {
    try {
        const result = db.exec('SELECT * FROM inscripciones ORDER BY fecha_registro DESC');

        if (result.length === 0) {
            return res.json([]);
        }

        const columns = result[0].columns;
        const inscripciones = result[0].values.map(row => {
            const obj = {};
            columns.forEach((col, i) => {
                obj[col] = row[i];
            });
            return obj;
        });

        res.json(inscripciones);
    } catch (error) {
        console.error('Error al consultar:', error);
        res.status(500).json({ error: 'Error al obtener las inscripciones.' });
    }
});

// ===== Iniciar servidor =====
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`\n🥋 Servidor de Karate corriendo en http://localhost:${PORT}`);
        console.log(`\n🥋 Servidor de Karate corriendo en http://localhost:${PORT}`);
        console.log(`📄 Abre http://localhost:${PORT}/karate.html en tu navegador`);
        console.log(`📡 API disponible en http://localhost:${PORT}/api/inscripcion\n`);
    });
}).catch(err => {
    console.error('Error al inicializar la base de datos:', err);
    process.exit(1);
});

// Guardar y cerrar la base de datos al detener el servidor
process.on('SIGINT', () => {
    if (db) {
        guardarDB();
        db.close();
    }
    console.log('\n🔒 Base de datos guardada y cerrada. Servidor detenido.');
    process.exit(0);
});
