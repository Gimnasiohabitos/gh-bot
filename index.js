const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
require('dotenv').config();

const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'gh-bot-prod' }), // o solo 'default' si lo prefieres
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

let tareasYaIniciadas = false;

const sendGroupMessage = async (chatName, message) => {
    try {
        const chats = await client.getChats();
        const group = chats.find(chat => chat.isGroup && chat.name === chatName);

        if (!group) {
            console.error(`❌ Grupo "${chatName}" no encontrado`);
            return;
        }

        await client.sendMessage(group.id._serialized, message);
        console.log(`📤 Mensaje enviado al grupo: ${chatName}`);
    } catch (err) {
        console.error(`❌ Error al enviar mensaje a ${chatName}:`, err.message);
        if (err.message.includes('deprecatedSendStanzaAndReturnAck')) {
            console.log('⚠️ Reiniciando cliente...');
            await client.destroy();
            await client.initialize();
            tareasYaIniciadas = false;
        }
    }
};

const getDayInTimeZone = (tz) => {
    const now = new Date().toLocaleString('en-US', { timeZone: tz });
    return new Date(now).getDay();
};

const QRCode = require('qrcode');
// ...
client.on('qr', (qr) => {
  QRCode.toFile('qr.png', qr, {
    color: {
      dark: '#000',  // Black dots
      light: '#FFF' // White background
    }
  }, function (err) {
    if (err) throw err;
    console.log('✅ QR guardado como qr.png');
  });
});


client.on('ready', () => {
    console.log('✅ Bot conectado');

    if (tareasYaIniciadas) {
        console.log('⏭️ Tareas ya estaban activas.');
        return;
    }

    // 🌄 GH América – Rutina AM (L-V)
    cron.schedule('45 04 * * *', async () => {
        const day = getDayInTimeZone('America/Bogota');
        if (day >= 1 && day <= 5) {
            const message = `*GH Rutina AM | Lunes a Viernes*
🌞 Zoom (35'm)
👉 Link AM: https://shorturl.at/sBq88 

🌎 Zona horaria: GMT-5 🇨🇴 
•⁠  ⁠5:00 AM 
•⁠  ⁠6:00 AM 
•⁠  ⁠7:00 AM 
•⁠  ⁠8:00 AM 
•⁠  ⁠9:00 AM 

⏳Sala de Bienvenida → 5’ min. antes
⏱️ ¡Inicio puntual! :00 
🫶 _Recuerda Saludar y Despedirte en Cada Sesión_ 👋`;
            await sendGroupMessage("América | Gimnasio de Hábitos", message);
            tareasYaIniciadas = true;
        }
    }, { timezone: 'America/Bogota' });

    // 📋 Reporte Diario América (L-V)
    cron.schedule('00 10 * * *', async () => {
        const day = getDayInTimeZone('America/Bogota');
        if (day >= 1 && day <= 5) {
            const message = `📈 *Reporte Diario de Asistencia*
👉 https://shorturl.at/rAgaw


☑️ Aviso de Inasistencia 
🥶(Conserva tu Racha)🔥  
👉 https://whatsform.com/O-72jC

👩‍💻Formulario Soporte GH 
👉 [Link Formulario Soporte] 🚧`;
            await sendGroupMessage("América | Gimnasio de Hábitos", message);
            tareasYaIniciadas = true;
        }
    }, { timezone: 'America/Bogota' });

    // 🧠 Mindset Mondays – lunes AM
    cron.schedule('01 10 * * *', async () => {
        const day = getDayInTimeZone('America/Bogota');
        if (day === 1) {
            const message = `Nos vemos hoy Lunes! 
*Mindset Mondays & Community*
Duración: 45 minutos máx.
👉 Link Session: https://shorturl.at/Iu5aZ

🌎 Zona horaria: GMT-5 🇨🇴 
•⁠  ⁠7:00 PM

🫶Compartir y conectar en comunidad 
👂Escuchar y construir mejoras 
🧑‍🔧Aclarar dudas e inquietudes`;
            await sendGroupMessage("América | Gimnasio de Hábitos", message);
            tareasYaIniciadas = true;
        }
    }, { timezone: 'America/Bogota' });

    // 🕔 Rutina PM (L-V)
    cron.schedule('45 17 * * *', async () => {
        const day = getDayInTimeZone('America/Bogota');
        if (day >= 1 && day <= 5) {
            const message = `*GH Rutina PM | Lunes a Viernes*
🌝 Zoom (15'm)
👉 Link PM: https://shorturl.at/c2YkU

🌎 Zona horaria: GMT-5 🇨🇴 
•⁠  ⁠6:00 PM

Respira, Cierra Jornada y Planea tu día! 
¡Iniciamos puntual! ❤️📈`;
            await sendGroupMessage("América | Gimnasio de Hábitos", message);
            tareasYaIniciadas = true;
        }
    }, { timezone: 'America/Bogota' });

    // 🎉 Despedida FDS (viernes)
    cron.schedule('00 21 * * 5', async () => {
        const message = `Feliz fin de semana!!
*Nos vemos Sábados y Domingos* 
(Sin Registro)

🌞 Único Horario FDS: 8:00 AM 
🌎 Zona horaria: GMT-5 🇨🇴 
👉 Link AM: https://shorturl.at/sBq88`;
        await sendGroupMessage("América | Gimnasio de Hábitos", message);
        tareasYaIniciadas = true;
    }, { timezone: 'America/Bogota' });

    // 🧘‍♂️ Rutina FDS (sábado y domingo)
    cron.schedule('45 07 * * *', async () => {
        const day = getDayInTimeZone('America/Bogota');
        if (day === 6 || day === 0) {
            const message = `*GH Rutina AM | FDS | Sin Registro*
🌞 Zoom (35'm)
👉 Link AM: https://shorturl.at/sBq88

🌎 Zona horaria: GMT-5 🇨🇴 
•⁠  ⁠8:00 AM

⏳Sala de espera → 5’ min. antes
⏱️ ¡Inicio puntual! :00`;
            await sendGroupMessage("América | Gimnasio de Hábitos", message);
            tareasYaIniciadas = true;
        }
    }, { timezone: 'America/Bogota' });

    // ☀️ Recordatorio domingo noche
    cron.schedule('00 19 * * 0', async () => {
        const message = `✨Feliz noche de Domingo✨
👁️ *Nos vemos mañana Lunes* 🌅

🌎 Zona horaria: GMT-5 🇨🇴 
•⁠ 5 - 6 - 7 - 8 - 9 AM 

⏳ Sala de espera → 5’ min. antes⏱️ Iniciamos puntual! ❤️📈`;

        await sendGroupMessage("América | Gimnasio de Hábitos", message);
        tareasYaIniciadas = true;
    }, { timezone: 'America/Bogota' });

    cron.schedule('01 19 * * 0', async () => {
        const message = `👩‍💻Recuerda poner en tus configuraciones de *Usuario en Zoom, tu Nombre y Apellido para llevar tu registro.* 
👉 https://zoom.us/profile 

☑️ Aviso de Inasistencia 👀
🥶(conserva tu racha) 🔥
👉 https://whatsform.com/O-72jC`;
        await sendGroupMessage("América | Gimnasio de Hábitos", message);
        tareasYaIniciadas = true;
    }, { timezone: 'America/Bogota' });

    ///////////////////////// EUROPA /////////////////////////
    cron.schedule('45 07 * * *', async () => {
        const day = getDayInTimeZone('Europe/Madrid');
        if (day >= 1 && day <= 5) {
            const message = `Es la hora del automata 
*GH Rutina AM | Lunes a Viernes*
🌞 Zoom (35'm)
👉 Link AM: https://shorturl.at/sBq88 

🌎 Zona horaria: GMT+2 🇪🇸 
•⁠  ⁠8:00 AM 

⏳Sala de Bienvenida → 5’ min. antes
⏱️ ¡Inicio puntual! :00 
🫶 _Recuerda Saludar y Despedirte en Cada Sesión_ 👋`;
            await sendGroupMessage("Europa | Gimnasio de Hábitos", message);
            tareasYaIniciadas = true;
        }
    }, { timezone: 'Europe/Madrid' });
});

client.on('disconnected', (reason) => {
    console.log(`❌ Cliente desconectado: ${reason}`);
    client.destroy().then(() => client.initialize());
});

client.initialize();