const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (CSS, JS, Imágenes) desde la raíz del proyecto
app.use(express.static(path.join(__dirname)));

// ==========================================
// 1. RUTAS DE NAVEGACIÓN Y VERIFICACIÓN
// ==========================================

// Ruta principal: Entrega tu index.html (ya con la etiqueta meta de Google)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta específica para el archivo de verificación de Google
// IMPORTANTE: Sin espacios ni saltos de línea en la URL
app.get('/googleccb11994b589a2e5.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'googleccb11994b589a2e5.html'));
});

// ==========================================
// 2. API DE INSCRIPCIÓN (BACKEND)
// ==========================================

app.post('/api/inscripcion', (req, res) => {
    const { nombre, email, telefono, estilo, nivel } = req.body;

    // Validación básica en el servidor (Seguridad Senior)
    if (!nombre || !email || !telefono) {
        return res.status(400).json({ 
            error: 'Faltan campos obligatorios en el servidor.' 
        });
    }

    console.log(`🥋 Nueva inscripción recibida: ${nombre} - ${estilo}`);

    // Aquí podrías guardar en una base de datos más adelante
    res.status(200).json({ 
        mensaje: 'Inscripción procesada correctamente.',
        usuario: nombre 
    });
});

// ==========================================
// 3. MANEJO DE ERRORES (404)
// ==========================================
app.use((req, res) => {
    res.status(404).send('<h1>404 - Página no encontrada</h1><a href="/">Volver al inicio</a>');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`📁 Directorio actual: ${__dirname}`);
});
