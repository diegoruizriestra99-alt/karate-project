/**
 * ARCHIVO: keep-alive.js
 * FUNCIÓN: Evitar el modo "sleep" de Render en la capa gratuita.
 * DESCRIPCIÓN: Realiza una petición HTTP a la URL de la aplicación 
 * cada 14 minutos para resetear el contador de inactividad.
 */

const https = require('https');

// Sustituye con tu URL real de Render
const APP_URL = 'https://tu-proyecto-karate.onrender.com/healthcheck';

/**
 * Función que despierta al servidor
 */
const keepAlive = () => {
    console.log("[Keep-Alive]: Iniciando ciclo de mantenimiento...");

    setInterval(() => {
        https.get(APP_URL, (res) => {
            if (res.statusCode === 200) {
                console.log("[Keep-Alive]: El servidor sigue despierto. Status: OK");
            } else {
                console.log(`[Keep-Alive]: Error. Status Code: ${res.statusCode}`);
            }
        }).on('error', (err) => {
            console.error("[Keep-Alive]: Error en la petición: " + err.message);
        });
    }, 14 * 60 * 1000); // Ejecutar cada 14 minutos exactamente
};

// Exportar para usar en el index.js o server.js principal
module.exports = keepAlive;