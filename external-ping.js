// Script externo de keep-alive optimizado para evitar errores 503
const https = require('https');
const http = require('http');

// URLs de la aplicación (configuradas para producción)
const APP_URLS = [
    process.env.APP_URL || 'https://karate-dojo.onrender.com'
];

function pingApp(url) {
    return new Promise((resolve, reject) => {
        try {
            const urlObj = new URL(url);
            const client = urlObj.protocol === 'https:' ? https : http;
            
            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
                path: '/healthcheck',
                method: 'GET',
                timeout: 10000, // 10 segundos timeout
                headers: {
                    'User-Agent': 'Keep-Alive-Bot/1.0',
                    'Connection': 'keep-alive',
                    'Accept': 'application/json'
                }
            };

            const startTime = Date.now();
            
            const req = client.request(options, (res) => {
                const responseTime = Date.now() - startTime;
                
                // Consumir datos para evitar memory leaks
                let data = '';
                res.on('data', chunk => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        console.log(`✅ ${url} - Status: ${res.statusCode} - Time: ${responseTime}ms`);
                        resolve({ url, status: res.statusCode, responseTime, success: true });
                    } else {
                        console.log(`⚠️ ${url} - Status: ${res.statusCode} - Time: ${responseTime}ms`);
                        resolve({ url, status: res.statusCode, responseTime, success: false });
                    }
                });
            });

            req.on('error', (err) => {
                console.error(`❌ Error en ${url}:`, err.code || err.message);
                reject({ url, error: err.code || err.message, success: false });
            });

            req.on('timeout', () => {
                req.destroy();
                console.error(`⏰ Timeout en ${url} (10s)`);
                reject({ url, error: 'Timeout', success: false });
            });

            req.end();
        } catch (error) {
            console.error(`❌ URL inválida ${url}:`, error.message);
            reject({ url, error: 'Invalid URL', success: false });
        }
    });
}

// Función principal de keep-alive optimizada
async function keepAlive() {
    console.log(`🔄 Iniciando ciclo de keep-alive - ${new Date().toISOString()}`);
    
    const results = [];
    
    // Ping a cada URL con paralelismo controlado
    for (const url of APP_URLS) {
        try {
            const result = await pingApp(url);
            results.push(result);
            
            // Esperar entre pings para no sobrecargar
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            results.push(error);
            console.log(`⚠️ Falló ping a ${url}, continuando con siguiente...`);
        }
    }
    
    // Ping adicional a la página principal (más ligero con HEAD)
    for (const url of APP_URLS) {
        try {
            const urlObj = new URL(url);
            const client = urlObj.protocol === 'https:' ? https : http;
            
            await new Promise((resolve, reject) => {
                const req = client.request({
                    hostname: urlObj.hostname,
                    port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
                    path: '/',
                    method: 'HEAD', // HEAD es más ligero
                    timeout: 8000,
                    headers: {
                        'User-Agent': 'Keep-Alive-Bot/1.0'
                    }
                }, (res) => {
                    console.log(`🏠 Home ping ${url}: ${res.statusCode}`);
                    resolve({ url, status: res.statusCode, success: res.statusCode === 200 });
                });
                
                req.on('error', () => {
                    console.log(`❌ Error en home ping ${url}`);
                    resolve({ url, error: 'Connection error', success: false });
                });
                
                req.on('timeout', () => {
                    req.destroy();
                    console.log(`⏰ Timeout en home ping ${url}`);
                    resolve({ url, error: 'Timeout', success: false });
                });
                
                req.end();
            });
            
            // Esperar entre pings
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.log(`Error en home ping: ${error.message}`);
        }
    }
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    console.log(`✅ Ciclo completado - ${new Date().toISOString()}`);
    console.log(`📊 Resultados: ${successCount}/${totalCount} pings exitosos`);
    
    return results;
}

// Si se ejecuta directamente
if (require.main === module) {
    const interval = process.env.PING_INTERVAL || 13; // minutos
    
    console.log(`🚀 Keep-alive externo iniciado`);
    console.log(`📡 URLs monitoreadas: ${APP_URLS.join(', ')}`);
    console.log(`⏰ Intervalo: ${interval} minutos`);
    
    // Esperar 10 segundos antes del primer ping
    setTimeout(() => {
        // Ejecutar inmediatamente
        keepAlive().catch(err => {
            console.error('❌ Error en ciclo inicial:', err);
        });
        
        // Luego ejecutar cada intervalo
        setInterval(() => {
            keepAlive().catch(err => {
                console.error('❌ Error en ciclo programado:', err);
            });
        }, interval * 60 * 1000);
    }, 10000);
}

module.exports = { keepAlive, pingApp };
