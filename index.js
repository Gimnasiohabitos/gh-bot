const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});


const GROUP_NAME = 'América | Gimnasio de Hábitos';

const sendGroupMessage = async (chatName, message) => {
    const chats = await client.getChats();
    const group = chats.find(chat => chat.isGroup && chat.name === chatName);

    if (group) {
        await client.sendMessage(group.id._serialized, message);
        console.log('📤 Mensaje enviado');
    } else {
        console.log('❌ Grupo no encontrado');
    }
};

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Escanea el código QR con WhatsApp Web');
});

client.on('ready', () => {
    console.log('✅ Bot conectado');

    // 🌄 Rutina AM (Lunes a Viernes)
    cron.schedule('45 04 * * *', async () => {
        const today = new Date().getDay(); // 1 = lunes, 5 = viernes , 6= sabado 0 = domingo
        if (today >= 1 && today <= 5) {
            const message =
`*GH Rutina AM | Lunes a Viernes*
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

            await sendGroupMessage(GROUP_NAME, message);
        }
    }, {
        timezone: "America/Bogota"
    });

    // 📋 Reporte Diario (lunes a viernes)
    cron.schedule('00 10 * * *', async () => {
        const today = new Date().getDay(); // 1 = lunes, 5 = viernes
        if (today >= 1 && today <= 5) {
            const message =
`📈 *Reporte Diario de Asistencia*
👉 https://shorturl.at/rAgaw

☑️ Aviso de Inasistencia 
🥶(Conserva tu Racha)🔥  
👉 https://whatsform.com/O-72jC

👩‍💻Formulario Soporte GH 
👉 [Link Formulario Soporte] 🚧`;

            await sendGroupMessage(GROUP_NAME, message);
        }
    }, {
        timezone: "America/Bogota"
    });

    // LUNES - Invitación “Mindset Mondays & Community Sessions”
    cron.schedule('01 10 * * *', async () => {
        const today = new Date().getDay(); // 1 = lunes, 5 = viernes
        if (today === 1 ) {
            const message = 
`Nos vemos hoy Lunes! 
*Mindset Mondays & Community*
Duración: 45 minutos máx.
👉 Link Session: https://shorturl.at/Iu5aZ

🌎 Zona horaria: GMT-5 🇨🇴 
•⁠  ⁠7:00 PM.

🫶Compartir y conectar en comunidad 
👂Escuchar y construir mejoras 
🧑‍🔧Aclarar dudas e inquietudes `;

            await sendGroupMessage(GROUP_NAME, message);
        }
    }, {
        timezone: "America/Bogota"
    });

    // Aviso - Invitación “Mindset Mondays & Community Sessions”
    cron.schedule('45 18 * * *', async () => {
        const today = new Date().getDay(); // 1 = lunes, 5 = viernes
        if (today === 1) {
            const message = 
`*Mindset Mondays & Community*
👉 Link Session: https://shorturl.at/Iu5aZ

🌎 Zona horaria: GMT-5 🇨🇴 
•⁠  ⁠7:00 PM

⏳Sala de Espera → 5’ min. antes
⏱️ ¡Inicio puntual! :00 `;

            await sendGroupMessage(GROUP_NAME, message);
        }
    }, {
        timezone: "America/Bogota"
    });


    // 🕔 Rutina PM (Lunes a Viernes)
    cron.schedule('45 17 * * *', async () => {
        const today = new Date().getDay(); // 0 = domingo, 6 = sábado
        if (today !== 6) {
            const message = 
`*GH Rutina PM | Lunes a Viernes*
🌝 Zoom (15'm)
👉 Link PM: https://shorturl.at/c2YkU

🌎 Zona horaria: GMT-5 🇨🇴 
•⁠  ⁠6:00 PM

Respira, Cierra Jornada y Planea tu día! 
¡Iniciamos puntual! ❤️📈`;
            await sendGroupMessage(GROUP_NAME, message);
        }
    }, {
        timezone: "America/Bogota"
    });



    // Despedida FDS (viernes)
    cron.schedule('00 21 * * *', async () => {
        const today = new Date().getDay(); // 5 = viernes
        if (today === 5) {
            const message = 
`Feliz fin de semana!!
*Nos vemos Sábados y Domingos* 
(Sin Registro)

🌞 Único Horario FDS: 8:00 AM 
🌎 Zona horaria: GMT-5 🇨🇴 
👉 Link AM: https://shorturl.at/sBq88`;
            await sendGroupMessage(GROUP_NAME, message);
        }
    }, {
        timezone: "America/Bogota"
    });

    // Rutina AM (sabados y domingos)
    cron.schedule('45 07 * * *', async () => {
        const today = new Date().getDay(); // 5 = viernes
        if (today === 6 || today === 0) {
            const message = 
`*GH Rutina AM | FDS | Sin Registro*
🌞 Zoom (35'm)
👉 Link AM: https://shorturl.at/sBq88

🌎 Zona horaria: GMT-5 🇨🇴 
•⁠  ⁠8:00 AM

⏳Sala de espera → 5’ min. antes
⏱️ ¡Inicio puntual! :00`;
            await sendGroupMessage(GROUP_NAME, message);
        }
    }, {
        timezone: "America/Bogota"
    });

    // Recordatorio inicio de semana (Domingos)
    cron.schedule('00 19 * * *', async () => {
        const today = new Date().getDay(); // 5 = viernes
        if (today === 0) {
            const message = 
`✨Feliz noche de Domingo✨
👁️*Nos vemos mañana Lunes* 🌅

•⁠ 5 - 6 - 7 - 8 - 9 AM

⏳ Sala de espera → 5’ min. antes
⏱️ Iniciamos puntual! ❤️📈`;
            await sendGroupMessage(GROUP_NAME, message);
        }
    }, {
        timezone: "America/Bogota"
    });

    // Recordatorio inicio de semana (Domingos)
    cron.schedule('01 19 * * *', async () => {
        const today = new Date().getDay(); // 5 = viernes
        if (today === 0) {
            const message = 
`Recuerda poner en tus configuraciones de Usuario en Zoom, tu Nombre y Apellido para llevar tu registro. 👩‍💻
👉 https://zoom.us/profile

☑️ Aviso de Inasistencia (conserva tu racha) 🔥
👉 https://whatsform.com/O-72jC`;
            await sendGroupMessage(GROUP_NAME, message);
        }
    }, {
        timezone: "America/Bogota"
    });
    //////////////////////////////////ESPANA///////////////////////////////////////////
    cron.schedule('15 18 * * *', async () => {
        const today = new Date().getDay(); // 1 = lunes, 5 = viernes
        if (today >= 1 && today <= 5) {
            const message = 
` *GH Rutina AM | Lunes a Viernes*
🌞 Zoom (35'm)
👉 https://shorturl.at/fTPwt

🌎 Zona horaria: GMT+2 🇪🇸 
⏳Sala de espera y bienvenida → 5’ min. antes.
⏱️ ¡Inicio puntual! :00 

•⁠  ⁠8:00 AM

🫶 Recuerda saludar y despedirte en cada sesión 👋`;

            const GROUP_NAME = "Europa | Gimnasio de Hábitos";
            await sendGroupMessage(GROUP_NAME, message);
        }
    }, {
        timezone: "Europe/Madrid"
    });

    ///Reporte diario 10:00 Am Espana
   /* cron.schedule('00 10 * * *', async () => {
        const today = new Date().getDay(); // 1 = lunes, 5 = viernes
        if (today >= 1 && today <= 5) {
            const message = 
`*📈 Reporte Diario de Asistencia*
👉 https://shorturl.at/rAgaw

☑️ Aviso de Inasistencia 
🥶(conserva tu racha) 🔥  
👉 https://whatsform.com/O-72jC

👩‍💻Soporte GH 
👉https://shorturl.at/jDwc9`;

            const GROUP_NAME = "Europa | Gimnasio de Hábitos";
            await sendGroupMessage(GROUP_NAME, message);
        }
    }, {
        timezone: "Europe/Madrid"
    });

*/

});


client.initialize();
