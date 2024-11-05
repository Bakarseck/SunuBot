const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const ytdl = require('ytdl-core');

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
    client.initialize(); // Attempt to re-initialize on disconnection
});

client.on('reconnecting', () => {
    console.log('Client reconnecting...');
});

client.on('message_create', async (msg) => {
    console.log(`Message created: ${msg.body}`);

    try {
        // Check for media files
        if (msg.hasMedia) {
            try {
                console.log("Media detected. Attempting to download...");
                const media = await msg.downloadMedia();
                console.log(`Media downloaded successfully: Type - ${msg.type}`);

                if (msg.type === 'audio' || msg.type === 'ptt') { 
                    console.log('Audio media detected (type audio or ptt)');
                    const fileName = msg.type === 'audio' ? 'audio.ogg' : 'ptt_audio.ogg';
                    fs.writeFileSync(fileName, media.data, 'base64');
                    msg.reply(`Audio received and saved as ${fileName}.`);
                    console.log(`Audio file saved as ${fileName}`);
                } else if (msg.type === 'document' && msg.body.endsWith('.pdf')) {
                    console.log('PDF document detected');
                    fs.writeFileSync('document.pdf', media.data, 'base64');
                    console.log('PDF file saved as document.pdf');
                    await processPDF('document.pdf', msg);
                } else {
                    console.log(`Unhandled media type: ${msg.type}`);
                    msg.reply("Media type not supported yet.");
                }
            } catch (error) {
                console.error("Error during media handling:", error);
                msg.reply("There was an error processing the media.");
            }
        }

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

async function processPDF(filePath, msg) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        const text = pdfData.text;
        console.log(`PDF text extracted: ${text.slice(0, 100)}...`);

        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            quotedMsg.reply('PDF processed. Here’s a preview:\n' + text + '...');
        } else {
            msg.reply('PDF processed. Here’s a preview:\n' + text + '...');
        }
    } catch (error) {
        console.error("Error processing PDF:", error);
        msg.reply('Sorry, there was an error processing the PDF.');
    }
}

async function processYouTubeLink(url, msg) {
    try {
        if (ytdl.validateURL(url)) {
            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title;
            console.log(`YouTube video title: ${title}`);
            msg.reply(`Received YouTube link: ${title}`);
        } else {
            msg.reply('Invalid YouTube link.');
        }
    } catch (error) {
        console.error('Error processing YouTube link:', error.message);
        msg.reply('Sorry, I could not process this YouTube link. It might not be available.');
    }
}

// Start the client
client.initialize();
