const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const ytdl = require('ytdl-core');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

// Initialize client with persistent session
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR code to log in.');
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('authenticated', () => {
    console.log('Client authenticated successfully.');
});

client.on('auth_failure', (msg) => {
    console.error('Authentication failure:', msg);
});

client.on('disconnected', (reason) => {
    console.log('Client disconnected:', reason);
    client.initialize();
});

client.on('reconnecting', () => {
    console.log('Client reconnecting...');
});

client.on('message_create', async (msg) => {
    console.log(`Message created: ${msg.body}`);

    // Restreindre aux messages provenant de chats personnels uniquement
    if (msg.from.includes('@g.us')) {
        console.log("Message reçu d'un groupe, ignoré.");
        return;
    }

    try {
        // Check if the message includes '#translate' to proceed with media handling
        if (msg.hasMedia && msg.body.includes('#translate')) {
            try {
                console.log("Media detected with #translate. Attempting to download...");
                const media = await msg.downloadMedia();
                console.log(`Media downloaded successfully: Type - ${msg.type}`);

                // Extraire le numéro de téléphone du destinataire
                const phoneNumber = msg.from.split('@')[0];
                const fileExtension = media.mimetype.split('/')[1];
                const fileName = `${phoneNumber}_received_file.${fileExtension}`;

                fs.writeFileSync(fileName, media.data, 'base64');

                // Envoyer le fichier à une API externe
                await sendFileToAPI(fileName, media.mimetype);
                msg.reply(`File ${fileName} received and sent to the API.`);

            } catch (error) {
                console.error("Error during media handling:", error);
                msg.reply("There was an error processing the media.");
            }
        } else if (msg.hasMedia) {
            console.log("Media received but ignored as it lacks #translate keyword.");
            msg.reply("If you need this media processed, please include #translate in your message.");
        }

        // Check for YouTube links
        if (msg.body.includes('youtube.com') || msg.body.includes('youtu.be')) {
            const url = msg.body.match(/(https?:\/\/[^\s]+)/g);
            if (url) {
                await processYouTubeLink(url[0], msg);
            }
        }

        if (msg.body.toLowerCase().includes('translate')) {
            msg.reply('You requested a translation. Processing...');
        } else if (msg.body.toLowerCase().includes('summarize')) {
            msg.reply('You requested a summary. Processing...');
        }
    } catch (error) {
        console.error("Error processing message:", error);
        msg.reply('An error occurred while processing your message.');
    }
});

// Function to send file to an API
async function sendFileToAPI(filePath, mimeType) {
    try {
        const fileData = fs.createReadStream(filePath);
        const form = new FormData();

        // Append the file to the form
        form.append('file', fileData, {
            contentType: mimeType,
            filename: filePath
        });

        const response = await axios.post('${process.env.BACKEND_API}/upload', form, {
            headers: {
                ...form.getHeaders(), // Include multipart/form-data headers
            },
            params: {
                type: mimeType
            }
        });

        console.log('File sent to API successfully:', response.data);
    } catch (error) {
        console.error('Error sending file to API:', error.message);
    }
}

// Function to process YouTube link and send it to the API
async function processYouTubeLink(url, msg) {
    try {
        if (ytdl.validateURL(url)) {
            const response = await axios.post(`${process.env.BACKEND_API}/youtube`, {
                url: url
            });

            console.log('YouTube link sent to API successfully:', response.data);
            msg.reply(`YouTube link sent to the API for processing: ${url}`);
        } else {
            msg.reply('Invalid YouTube link.');
        }
    } catch (error) {
        console.error('Error sending YouTube link to API:', error.message);
        msg.reply('Sorry, I could not send this YouTube link to the API.');
    }
}

// Start the client
client.initialize();
