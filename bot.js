require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.TOKEN);

client.on('ready', () => console.log('Ready!'));

client.on('message', gotMessage);

const commands = {
    '>ping': (msg) => msg.channel.send('pong'),
    '>pong': (msg) => msg.channel.send('ping')
}

function gotMessage(msg) {
    console.log(msg.content);
    if (msg.author.bot) return;
    if (msg.channel.id == process.env.CHANNEL) {
        commands[msg.content](msg);
    }
}