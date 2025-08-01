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
        }
    }
};

const getDayInTimeZone = (tz) => {
    const now = new Date().toLocaleString('en-US', { timeZone: tz });
    return new Date(now).getDay();
};

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot conectado');

    if (tareasYaIniciadas) {
        console.log('⏭️ Tareas ya estaban activas.');
        return;
    }
    tareasYaIniciadas = true;

    // 🌄 GH América – Rutina AM (L-V)
    cron.schedule('45 04 * * *', async () => {
        const day = getDayInTimeZone('America/Bogota');
        if (day >= 1 && day <= 5) {
            const message = `*GH Rutina AM | Lunes a Viernes*\n...`;
            await sendGroupMessage("América | Gimnasio de Hábitos", message);
        }
    }, { timezone: 'America/Bogota' });

    // 📋 Reporte Diario América (L-V)
    cron.schedule('00 10 * * *', async () => {
        const day = getDayInTimeZone('America/Bogota');
        if (day >= 1 && day <= 5) {
            const message = `📈 *Reporte Diario de Asistencia*\n...`;
            await sendGroupMessage("América | Gimnasio de Hábitos", message);
        }
    }, { timezone: 'America/Bogota' });

    // 🧠 Mindset Mondays – lunes AM
    cron.schedule('01 10 * * *', async () => {
        const day = getDayInTimeZone('America/Bogota');
        if (day === 1) {
            const message = `Nos vemos hoy Lunes! *Mindset Mondays...*`;
            await sendGroupMessage("América | Gimnasio de Hábitos", message);
        }
    }, { timezone: 'America/Bogota' });

    // 🕔 Rutina PM (L-V)
    cron.schedule('45 17 * * *', async () => {
        const day = getDayInTimeZone('America/Bogota');
        if (day >= 1 && day <= 5) {
            const message = `*GH Rutina PM | Lunes a Viernes*\n...`;
            await sendGroupMessage("América | Gimnasio de Hábitos", message);
        }
    }, { timezone: 'America/Bogota' });

    // 🎉 Despedida FDS (viernes)
    cron.schedule('00 21 * * 5', async () => {
        const message = `Feliz fin de semana!!\n...`;
        await sendGroupMessage("América | Gimnasio de Hábitos", message);
    }, { timezone: 'America/Bogota' });

    // 🧘‍♂️ Rutina FDS (sábado y domingo)
    cron.schedule('45 07 * * *', async () => {
        const day = getDayInTimeZone('America/Bogota');
        if (day === 6 || day === 0) {
            const message = `*GH Rutina AM | FDS | Sin Registro*\n...`;
            await sendGroupMessage("América | Gimnasio de Hábitos", message);
        }
    }, { timezone: 'America/Bogota' });

    // ☀️ Recordatorio domingo noche
    cron.schedule('00 19 * * 0', async () => {
        const message = `✨Feliz noche de Domingo✨\n...`;
        await sendGroupMessage("América | Gimnasio de Hábitos", message);
    }, { timezone: 'America/Bogota' });

    cron.schedule('01 19 * * 0', async () => {
        const message = `Recuerda poner en Zoom tu nombre y apellido 👩‍💻\n...`;
        await sendGroupMessage("América | Gimnasio de Hábitos", message);
    }, { timezone: 'America/Bogota' });

    ///////////////////////// EUROPA /////////////////////////
    cron.schedule('45 07 * * *', async () => {
        const day = getDayInTimeZone('Europe/Madrid');
        if (day >= 1 && day <= 5) {
            const message = `*GH Rutina AM | Lunes a Viernes*\n🇪🇸 Europa\n...`;
            await sendGroupMessage("Europa | Gimnasio de Hábitos", message);
        }
    }, { timezone: 'Europe/Madrid' });
});

client.on('disconnected', (reason) => {
    console.log(`❌ Cliente desconectado: ${reason}`);
    client.destroy().then(() => client.initialize());
});

client.initialize();