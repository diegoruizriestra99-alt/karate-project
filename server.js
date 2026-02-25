const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos (CSS, Imágenes, JS del cliente)
app.use(express.static(path.join(__dirname)));

// RUTA PRINCIPAL: Carga tu página de Karate
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// RUTA DE VERIFICACIÓN DE GOOGLE: Crucial para que Google Search Console te valide
app.get('/googleccb11994b589a2e5.html', (req, res) => {
    // Esto busca el archivo físico que subiste a GitHub y lo muestra a Google
    res.sendFile(path.join(__dirname, 'googleccb11994b589a2e5.html'));
});

// Manejo de errores 404 (Página no encontrada)
app.use((req, res) => {
    res.status(404).send('Lo siento, no se pudo encontrar esa página en el Dojo.');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
