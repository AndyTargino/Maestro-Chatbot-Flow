import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const nodes = require('./nodes.json');
const edges = require('./edges.json');


//   FILTRO DE OBJETO   //

const formatNodes = (_nodes) => {
    var nodesFormated = [];
    _nodes.forEach(node => nodesFormated.push({ 'id': node.id, 'title': node.title, 'message': node.message, 'type': node.type }));
    return nodesFormated;
}

const formatEdges = (_edges) => {
    var nodesFormated = [];
    _edges.forEach(edge => nodesFormated.push({ 'id': edge.id, 'source': edge.source, 'target': edge.target }));
    return nodesFormated;
}

const getAllNodes = formatNodes(nodes);

const getAllEdges = formatEdges(edges);

const findChildremElement = (id) => {

    var array = [];
    var edgeFilter = getAllEdges.filter(edge => edge.source === id);

    edgeFilter.forEach(edge => {
        var filter = getAllNodes.filter(node => node.id === edge.target);
        if (filter.length < 1) return;
        array.push(filter[0])
    });
    return array;

}


getAllNodes.forEach(node => {
    if (node.type === 'end') return
    node.steps = findChildremElement(node.id)
});

// --------------------- //

function mountResponse(option, title, steps) {

    let context = '';
    let index = 0;

    steps.forEach(step => {
        index = index + 1;
        context += `*${index}* - ${step.title}\n`;
    });

    if (option !== 'start') { context += `*${'#'}* - ${'Voltar'}\n`; }

    const body = `\u200e${title}\n${context}`;

    return body;
};


// SALVAR OBJECT ANTERIOR E MONTAR MENSAGEM DE RETORNO
console.clear();

var oldOption = []

export default function stepByStep(op) {

    var step = ''

    if (op === 'start') { step = 'start' } else if (op === '#') { step = '#' } else { step = Number(op) - 1 }

    var savestep = [];

    if (oldOption.length === 0) {

        savestep = getAllNodes.filter(node => node.id === step);
        oldOption.pop()
        oldOption.push(savestep[0]);
        var context = mountResponse(savestep[0].type, savestep[0].message, savestep[0].steps);
        return context;

    } else {

        if (step === `#`) {

            savestep = getAllNodes.filter(node => node.id === 'start');
            oldOption.pop()
            oldOption.push(savestep[0]);
            var context = mountResponse(savestep[0].type, savestep[0].message, savestep[0].steps);
            return context;


        } else {

            var selectedOption = oldOption[0].steps[step];


            if ((selectedOption.type === 'end')) {
                return (selectedOption.message)
            }


            if ((selectedOption.steps.length === 1)) {
                return (selectedOption.steps[0].message)
            }


            oldOption.pop()
            oldOption.push(selectedOption);

            var context = mountResponse(selectedOption.type, selectedOption.message, selectedOption.steps);
            return context;

        }
    }
}



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