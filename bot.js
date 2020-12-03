require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.TOKEN);

client.on('ready', () => console.log('Ready!'));

client.on('message', gotMessage);

function gotMessage(msg) {
    console.log(msg.content);
    if (msg.author.bot) return;
    if (msg.channel.id == process.env.CHANNEL && msg.content === 'ping') {
        msg.channel.send('pong');
    }
}