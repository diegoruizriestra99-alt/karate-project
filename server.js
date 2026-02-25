const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Esta línea hace que el servidor encuentre tus archivos (como el de Google)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta corregida para la verificación
app.get('/googleccb11994b589a2e5.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'googleccb11994b589a2e5.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
