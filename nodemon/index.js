import chatbot from './chatbot.js';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);



var passo = ['start', 3, '#', 3, 1];



function step_by_step(array) {
    var interval = 1000;
    var promise = Promise.resolve();
    array.forEach(function (el) {
        promise = promise.then(function () {
            console.log(chatbot(el));
            return new Promise(function (resolve) {
                setTimeout(resolve, interval);
            });
        });
    });

    promise.then(function () {
        console.log('Loop finished.');
    });
}

step_by_step(passo);



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
        client.sendMessage(message.from, chatbot(message.body))
    }

    if (message.body !== "start") {
        client.sendMessage(message.from, chatbot(message.body))
    }
});
*/
