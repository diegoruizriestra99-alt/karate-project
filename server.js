const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos del directorio actual
app.use(express.static(path.join(__dirname)));

// Ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'karate.html'));
});

// Endpoint de salud
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on 0.0.0.0:${PORT}`);
});