require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.TOKEN);

client.on('ready', () => console.log('Ready!'));

client.on('message', gotMessage);

client.on("messageReactionAdd", gotReaction);

const commands = {
    '>ping': (msg) => msg.channel.send('pong'),
    '>pong': (msg) => msg.channel.send('ping'),
    '>propose': (msg, args) => {
        msg.guild.channels.create(args[0],{
            "type": 'text',
            "parent": process.env.PROPOSALS,
        }).then(channel => {
            channel.send(args[0]+'?').then(proposal => {
                proposal.react('✅');
                proposal.react('⛔');
            });
        });
    },
    '>vote': (msg, args) => {
        msg.channel.send("<@!"+msg.author+"> voted "+args[0]);
        msg.author.send("You voted "+args[0]+" for "+msg.channel.name);
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

let designations = { }

function gotReaction(messageReaction, user) {
    if (designations.hasOwnProperty(user.id)) {
        if (designations.hasOwnProperty(messageReaction.message.author.id)) {
            // Remove user from the designators list of whom they previously designated
            designations[designations[user.id]["designated"]].designators =
                designations[designations[user.id]["designated"]].designators
                    .filter(item => item !== user.id);
        }
        designations[user.id]["designated"] = messageReaction.message.author.id;
    } else {
        designations[user.id] = {
            "designated": messageReaction.message.author.id,
            "designators": [],
        };
    }

    if (designations.hasOwnProperty(messageReaction.message.author.id)) {
        if (!designations[messageReaction.message.author.id].designators.includes(user.id)) {
            designations[messageReaction.message.author.id].designators.push(user.id);
        }
    } else {
        designations[messageReaction.message.author.id] = {
            "designators": [user.id],
        };
    }
    console.log("Got reaction");
    console.log(designations);
}