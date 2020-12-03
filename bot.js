require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.TOKEN);

client.on('ready', () => console.log('Ready!'));

client.on('message', gotMessage);

const commands = {
    '>ping': (msg) => msg.channel.send('pong'),
    '>pong': (msg) => msg.channel.send('ping'),
    '>propose': (msg, args) => msg.guild.channels.create(args[0],{
        type: 'text',
        parent: process.env.PROPOSALS,
    }),
}

function gotMessage(msg) {
    console.log(msg.content);
    let args = msg.content.split(' ');
    let command = args[0];
    args.shift();
    if (msg.author.bot) return;
    if (msg.channel.id == process.env.CHANNEL) {
        commands[command](msg, args);
    }
}