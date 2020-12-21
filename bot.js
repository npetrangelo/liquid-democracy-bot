require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

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
    '>designate': (msg, args) => {
        // Get user id from tag
        let userID = args[0].substring(3, args[0].length-1);
        designate(userID, process.env.ID);
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
let designations = { };
if (fs.existsSync('designations.json')) {
    designations = JSON.parse(fs.readFileSync('designations.json', 'utf-8'));
}

function designate(designated, designator) {
    if (designations.hasOwnProperty(designator)) {
        if (designations[designator].hasOwnProperty("designated")) {
            // Remove user from their previous designation's designators list
            designations[designations[designator].designated].designators =
                designations[designations[designator].designated].designators
                    .filter(item => item !== designator);
        }
        designations[designator]["designated"] = designated;
    } else {
        designations[designator] = {
            "designated": designated,
            "designators": [],
        };
    }

    if (designations.hasOwnProperty(designated)) {
        if (!designations[designated].designators.includes(designator)) {
            designations[designated].designators.push(designator);
        }
    } else {
        designations[designated] = {
            "designators": [designator],
        };
    }

    fs.writeFile('designations.json', JSON.stringify(designations), () => console.log(designations));
}

function gotReaction(messageReaction, user) {
    console.log(user.username+" designates "+messageReaction.message.author.username);
    designate(messageReaction.message.author.id, user.id);
}