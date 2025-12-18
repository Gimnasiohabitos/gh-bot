const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

const GROUP_NAME = '🌎 | Gimnasio de Hábitos';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('📲 Escanea el QR con WhatsApp');
});

client.on('ready', async () => {
    console.log('✅ Bot conectado');

    const chats = await client.getChats();
    const group = chats.find(chat => chat.isGroup && chat.name === GROUP_NAME);

    if (!group) {
        console.log('❌ Grupo no encontrado');
        return;
    }

    const send = async (message) => {
        await client.sendMessage(group.id._serialized, message);
        console.log(`📤 Mensaje enviado (${new Date().toLocaleString('es-CO')})`);
    };

    // 🌄 Rutina AM (lunes a viernes) - 3:45 AM
    cron.schedule('45 03 * * *', async () => {
        const day = new Date().getDay();
        if (day >= 1 && day <= 5) {
            await send(`*GH Rutina AM | Lunes a Viernes*
🌞 ZOOM (35'm)
👉 https://shorturl.at/drCBU
👉 ID: 282 437 3527
👨‍💻 Activa y enfoca tu cámara 
🙏 Zoom User: Nombre Apellido

🌎 *GH | 24h* 👀 
•⁠ Sesiones cada hora _:00⁠
•⁠ 4-5-6-7-8-9… 24h

⏱️ ¡Inicio puntual! :00 
⏳Sala de Bienvenida → 5’ min. antes
👋 _Recuerda Saludar y Despedirte en cada sesión_

☑️ *Avisa tu Inasistencia*
🥶(Conserva tu Racha)🔥  
👉 https://whatsform.com/O-72jC`);
        }
    });

    // 📋 Reporte diario (lunes a viernes) - 1:00 PM
    cron.schedule('00 13 * * *', async () => {
        const day = new Date().getDay();
        if (day >= 1 && day <= 5) {
            await send(`📈 *Reporte Diario de Asistencia*
👉 HabitTracker: https://shorturl.at/rAgaw`);
        }
    });

    // 🔥 Viernes - Compartir Valor - 2:00 PM
    cron.schedule('00 14 * * *', async () => {
        const day = new Date().getDay();
        if (day === 5) {
            await send(`*Viernes de Compartir Valor* 🫶
En Comunidad GH crecemos juntos 

_Anímate a compartir aquello que ha nutrido tu semana_ 🦅

⁠Pueden ser links 🔗, lecturas 📚, recetas 🥗, hacks!! 🔥`);
        }
    });

    // 🔔 Viernes - Aviso Rutina FDS - 9:00 PM
    cron.schedule('00 21 * * *', async () => {
        const day = new Date().getDay();
        if (day === 5) {
            await send(`✨Feliz Fin de Semana!!✨
*Nos vemos Sábados y Domingos* 
(Sin Registro)

🌞 4-5-6-7-8-9-10 AM
🌎 En Tu Zona Horaria 👀
👉 ZOOM: https://shorturl.at/drCBU
👉 ID: 282 437 3527`);
        }
    });

    // 🌞 FDS - Invitación diaria - 3:45 AM
    cron.schedule('45 03 * * *', async () => {
        const day = new Date().getDay();
        if (day === 6 || day === 0) {
            await send(`*GH Rutina AM | FDS | Sin Registro*
🌞 ZOOM (35'm)
👉 https://shorturl.at/drCBU
👉 ID: 282 437 3527
👨‍💻 Activa y enfoca tu cámara
🙏 Zoom User: Nombre Apellido

🌎 *GH | 24h* 👀 
•⁠ 4-5-6-7-8-9… 24h

⏱️ ¡Inicio puntual! :00 
⏳Sala de Bienvenida → 5’ min. antes
👋 _Recuerda Saludar y Despedirte en cada sesión_`);
        }
    });

    // 📢 Domingo - Confirmación semanal - 7:00 PM
    cron.schedule('00 19 * * 0', async () => {
        await send(`✨Feliz noche de Domingo✨
👁️ *Nos vemos mañana Lunes* 🌅

🌎 *GH | 24h* 👀 
•⁠ 4-5-6-7-8-9… 24h

⏱️ Iniciamos puntual! :00 ❤️📈
⏳ Sala de espera → 5’ min. Antes`);
    });

    // ✅ Domingo - Recordatorio de nombre en Zoom - 7:30 PM
    cron.schedule('30 19 * * 0', async () => {
        await send(`👩‍💻Recuerda poner en tus configuraciones de *Usuario en Zoom, tu Nombre y Apellido para llevar tu registro.* 
👉 https://zoom.us/profile 

👩‍💻No olvides *prender tu cámara y enfocarla* para facilitar tu registro, aumentar tu compromiso y participación.`);
    });
});

client.initialize();

