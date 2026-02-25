const express = require('express');
const path = require('path');
const app = express();

// Usamos el puerto que nos asigne Railway o el 3000 por defecto
const PORT = process.env.PORT || 3000;

// MIDDLEWARE: Configuración necesaria para procesar datos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SERVIR ARCHIVOS ESTÁTICOS: 
// Esto permite que el navegador encuentre el CSS y el JS automáticamente
app.use(express.static(path.join(__dirname)));

// ==========================================
// 1. RUTAS DE NAVEGACIÓN (FRONTEND)
// ==========================================

// Ruta principal: Carga tu página de Karate
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// VERIFICACIÓN DE GOOGLE:
// Esta ruta debe estar en una sola línea y sin espacios para que funcione
app.get('/googleccb11994b589a2e5.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'googleccb11994b589a2e5.html'));
});

// ==========================================
// 2. API DE INSCRIPCIÓN (PROCESAMIENTO)
// ==========================================

app.post('/api/inscripcion', (req, res) => {
    const { nombre, email, telefono, estilo, nivel } = req.body;

    // Validación de seguridad en el servidor
    if (!nombre || !email || !telefono) {
        return res.status(400).json({ 
            error: 'Faltan datos obligatorios. Por favor, revisa el formulario.' 
        });
    }

    console.log(`🥋 ¡Nueva Inscripción! Nombre: ${nombre}, Estilo: ${estilo}`);

    // Respuesta de éxito que leerá tu script de JavaScript
    res.status(200).json({ 
        mensaje: 'Tu inscripción ha sido recibida con éxito.',
        usuario: nombre 
    });
});

// ==========================================
// 3. CONTROL DE ERRORES Y ARRANQUE
// ==========================================

// Si el usuario entra en una ruta que no existe
app.use((req, res) => {
    res.status(404).send('<h1>404 - No encontrado</h1><p>La página que buscas no existe.</p>');
});

app.listen(PORT, () => {
    console.log(`✅ Servidor activo en puerto: ${PORT}`);
    console.log(`📍 URL de verificación: http://localhost:${PORT}/googleccb11994b589a2e5.html`);
});
