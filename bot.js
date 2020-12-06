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

function designate(designation, designator) {
    if (designations.hasOwnProperty(designator)) {
        if (designations[designator].hasOwnProperty("designated")) {
            // Remove user from their previous designation's designators list
            designations[designations[designator].designated].designators =
                designations[designations[designator].designated].designators
                    .filter(item => item !== designator);
        }
        designations[designator]["designated"] = designation;
    } else {
        designations[designator] = {
            "designated": designation,
            "designators": [],
        };
    }

    if (designations.hasOwnProperty(designation)) {
        if (!designations[designation].designators.includes(designator)) {
            designations[designation].designators.push(designator);
        }
    } else {
        designations[designation] = {
            "designators": [designator],
        };
    }
}

function gotReaction(messageReaction, user) {
    designate(messageReaction.message.author.id, user.id);
    console.log(user.username+" designates "+messageReaction.message.author.username);
    console.log(designations);
}