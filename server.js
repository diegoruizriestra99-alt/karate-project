const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const fs = require('fs');

// Configuración de metadatos dinámicos (Puedes cambiar "Madrid, España" por tu ciudad actual)
const ciudadStr = "Madrid, España";
const dynamicTitle = `Clases de Karate - Artes Marciales en ${ciudadStr} | Karate Dojo`;
const dynamicDescription = `Únete a nuestras Clases de Karate y Artes Marciales en ${ciudadStr}. Aprende defensa personal, katas e historia en nuestro Karate Dojo.`;

// Ruta raíz con inyección dinámica de Metatags SEO
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'karate.html');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo HTML:', err);
            return res.status(500).send('Error interno del servidor');
        }

        // Reemplazar título
        let result = data.replace(
            /<title>(.*?)<\/title>/g,
            `<title>${dynamicTitle}</title>`
        );

        // Reemplazar descripción
        result = result.replace(
            /<meta name="description"\s+content="[^"]*">/g,
            `<meta name="description" content="${dynamicDescription}">`
        );

        res.send(result);
    });
});

// Endpoints explícitos para SEO (Sitemap y Robots)
app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.sendFile(path.join(__dirname, 'robots.txt'));
});

// Servir el resto de archivos estáticos (styles, js, imágenes) 
// Lo ponemos DESPUÉS de las rutas específicas para que no sobreescriba el GET '/'
app.use(express.static(path.join(__dirname)));

// Endpoint de salud
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on 0.0.0.0:${PORT}`);
});