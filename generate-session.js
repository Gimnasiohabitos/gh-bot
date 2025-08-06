const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: process.env.WHATSAPP_SESSION || 'gh-bot-prod'
    }),
    puppeteer: {
        headless: false, // 🟡 deja esto visible mientras pruebas
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('🔐 Sesión autenticada correctamente');
});

client.on('ready', () => {
    console.log('✅ Sesión lista y lista para usar');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Falló autenticación:', msg);
});

client.initialize();
