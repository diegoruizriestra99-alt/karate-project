/**
 * ARCHIVO: keep-alive.js
 * ROL: Guardián de actividad para Render Tier Gratis.
 */
const https = require('https');

const startKeepAlive = (url) => {
    if (!url) {
        console.error("[Keep-Alive] Error: No se proporcionó una URL válida.");
        return;
    }

    console.log(`[Keep-Alive] Monitoreo activado para: ${url}`);

    // Ejecutamos cada 14 minutos (Render duerme a los 15)
    setInterval(() => {
        https.get(url, (res) => {
            console.log(`[Keep-Alive] Ping enviado. Status: ${res.statusCode}`);
        }).on('error', (err) => {
            console.error("[Keep-Alive] Error en el ping: " + err.message);
        });
    }, 14 * 60 * 1000);
};

module.exports = startKeepAlive;