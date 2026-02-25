const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Servir archivos estáticos desde la raíz
app.use(express.static(__dirname));

// Ruta principal para tu página de kárate
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta específica para la verificación de Google (CORREGIDA)
app.get('/googleccb11994b589a2e5.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'googleccb11994b589a2e5.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
