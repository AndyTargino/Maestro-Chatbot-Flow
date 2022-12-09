

const nodes = require('./nodes.json');
const edges = require('./edges.json');


//   FILTRO DE OBJETO   //

const formatNodes = (_nodes) => {
    var nodesFormated = [];
    _nodes.forEach(node => nodesFormated.push({ 'id': node.id, 'title': node.title, 'message': node.message }));
    return nodesFormated;
}
const formatEdges = (_edges) => {
    var nodesFormated = [];
    _edges.forEach(edge => nodesFormated.push({ 'id': edge.id, 'source': edge.source, 'target': edge.target }));
    return nodesFormated;
}

const getAllNodes = formatNodes(nodes);

const getAllEdges = formatEdges(edges);

// --------------------- //


var allOptions = [];

const question = (op) => {

    if (op !== 'start' && allOptions[op - 1] === undefined) return 'Selecione uma opcao valida no menu';

    var option = op === 'start' ? 'start' : allOptions[op - 1]?.id === undefined ? 'start' : allOptions[op - 1].id;
    if (op === 'start') { option = 'start' }

    var filterEdges = getAllEdges.filter(element => element.source === option);

    const getOptions = (array) => {
        var returnArray = [];
        array.forEach((edge) => { var nameObj = getAllNodes.filter(node => node.id === edge.target); returnArray.push(nameObj[0]); });
        return returnArray;
    }

    allOptions = getOptions(filterEdges)

    let context = '';

    const titleMessage = getAllNodes.filter(node => node.id === option);

    filterEdges.forEach((edge, index) => {

        const nameObj = allOptions.filter(option => { if (option !== undefined) { return (option.id === edge.target) } });

        if (nameObj.length > 0) { context += `*${index + 1}* - ${nameObj[0].title}\n`; }

    });

    if (option !== 'start') { context += `*${'#'}* - ${'Voltar'}\n`; }

    const body = `\u200e${titleMessage[0].message}\n${context}`;

    return (body);

}





var options = ['start', 5, 3];


options.forEach(op => {
    console.log(question(op));
});



// =========================================================== //

/*
require('dotenv').config()
const fs = require("fs");
const qrcode = require("qrcode-terminal");
const { Client, Location, Buttons, List, LocalAuth } = require("whatsapp-web.js");


const country_code = process.env.COUNTRY_CODE;
const number = process.env.NUMBER;
const msg = process.env.MSG;


const client = new Client({
    authStrategy: new LocalAuth()
});


client.initialize();

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("auth_failure", msg => {
    console.error('AUTHENTICATION FAILURE', msg);
})


client.on("ready", () => {
    console.log("Client is ready!");
    setTimeout(() => {
        let chatId = `${country_code}${number}@c.us`;
        client.sendMessage(chatId, msg).then((response) => {
            if (response.id.fromMe) {
                console.log("It works!");
            }
        })
    }, 5000);
});


client.on("message", message => {
    console.log(message.body);

    if (message.body === "start") {
        client.sendMessage(message.from, question(message.body))
    }

    if (message.body !== "start") {
        client.sendMessage(message.from, question(message.body))
    }
});
*/