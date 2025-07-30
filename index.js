const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require("@discordjs/voice");

const client = new Client({ checkUpdate: false });

const config = require(`${process.cwd()}/config.json`);

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    await joinVC(client, config);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const oldVoice = oldState.channelId;
    const newVoice = newState.channelId;

    if (oldVoice !== newVoice) {
        if (!oldVoice) {
            // Bot baru join voice channel
        } else if (!newVoice) {
            if (oldState.member.id !== client.user.id) return;
            await joinVC(client, config);
        } else {
            if (oldState.member.id !== client.user.id) return;
            if (newVoice !== config.Channel) {
                await joinVC(client, config);
            }
        }

        // ✅ Self-mute bot setelah join VC
        if (newVoice && newState.member.id === client.user.id) {
            try {
                await newState.member.voice.setMute(true, 'Auto self-mute on join');
                console.log(`[VC] Bot dimute otomatis di ${newVoice}`);
            } catch (err) {
                console.error('Gagal self-mute bot:', err);
            }
        }
    }
});

client.login(process.env.TOKEN);

async function joinVC(client, config) {
    const guild = client.guilds.cache.get(config.Guild);
    const voiceChannel = guild.channels.cache.get(config.Channel);
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: true
    });
}
