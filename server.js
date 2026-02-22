const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Puerto dinámico para Render (USA EL PUERTO QUE ELLOS ASIGNAN O EL 3000)
const PORT = process.env.PORT || 3000; // Puerto dinámico para Render

// Ruta principal para que Render vea que funciona
app.get('/', (req, res) => {
    res.status(200).send({
        status: 'ok',
        message: '🥋 Servidor de Karate en línea y funcionando perfectamente'
    });
});

// Ruta de prueba para tu web
app.get('/api/test', (req, res) => {
    res.json({ mensaje: "Conexión establecida con el Dojo" });
});

// Arrancar el servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});clsgit 
//cambio
// Despliegue final dojo