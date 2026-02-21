const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Asegúrate de tener axios instalado, si no, usa 'node-fetch' o quita el keep-alive por ahora
const app = express();

// 1. CONFIGURACIÓN PROFESIONAL
app.use(cors());
app.use(express.json());

// El puerto dinámico para Render
const PORT = process.env.PORT || 3000;

// 2. RUTAS
app.get('/', (req, res) => {
    res.send('🥋 Servidor de Karate-Do Online y Funcionando 🥋');
});

// Ruta de salud para Render (Health Check)
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// 3. SISTEMA KEEP-ALIVE (Evita que el servidor se duerma)
// REEMPLAZA esta URL por la que te dio Render (la que termina en .onrender.com)
const MI_URL = 'https://karate-backend.onrender.com'; 

setInterval(async () => {
    try {
        // Hacemos una petición simple a nuestra propia web cada 14 minutos
        await axios.get(MI_URL);
        console.log('Ping de mantenimiento enviado exitosamente');
    } catch (err) {
        console.log('Error en el ping, pero el servidor sigue vivo');
    }
}, 14 * 60 * 1000); 

// 4. ARRANQUE DEL SERVIDOR
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor listo en el puerto ${PORT}`);
    console.log(`🌍 URL de acceso: ${MI_URL}`);
});