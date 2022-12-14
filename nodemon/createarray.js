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

function stepByStep(op) {

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


var steps = ['start', 3, '#', 3, 1];

steps.forEach(step => {

    console.log(stepByStep(step))

});



