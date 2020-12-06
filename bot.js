require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.TOKEN);

client.on('ready', () => console.log('Ready!'));

client.on('message', gotMessage);

const commands = {
    '>ping': (msg) => msg.channel.send('pong'),
    '>pong': (msg) => msg.channel.send('ping'),
    '>propose': (msg, args) => {
        msg.guild.channels.create(args[0],{
            type: 'text',
            parent: process.env.PROPOSALS,
        }).then(channel => {
            channel.send(args[0]+'?').then(proposal => {
                proposal.react('✅');
                proposal.react('⛔');
            });
        });
    },
    '>vote': (msg, args) => {

    },
}

function gotMessage(msg) {
    console.log(msg.content);
    let args = msg.content.split(' ');
    let command = args.shift();
    if (msg.author.bot) return;
    if (msg.channel.id == process.env.CHANNEL && commands.hasOwnProperty(command)) {
        commands[command](msg, args);
    }
}