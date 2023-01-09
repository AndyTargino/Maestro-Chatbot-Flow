function finishFlow(queueId, message) {

    console.info(queueId, message)

    if (queueId === 0) {
        console.info('finalizando fluxo de bot')
    } else if (queueId === 'capture') {
        console.info('Aqui captura a ultima mensagem enviada pelo usuário: ' + message)
    } else {
        console.info(`Aqui este atendimento será tranferido para a fila ${queueId}`)
    }

    let input = document.querySelector("#inputChatBot");
    setTimeout(() => { input.disabled = true; input.value = 'Finalizou o fluxo do BOT'; }, 500);
    return message
}

const ChatBot = (chatbot, step) => {

    let optionInArray = [];
    let arrayStep;
    // Desenvolver regra de voltar uma resposta apenas
    if (step) {
        if (step[step.length - 1] === '#') {
            arrayStep = step.splice(-2, 2);
        }
        arrayStep = step;
    }

    console.info(arrayStep);

    //   FILTRO DE OBJETO   //

    const nodes = chatbot.nodes;
    const edges = chatbot.edges;

    const formatNodes = (_nodes) => {
        let nodesFormated = [];
        _nodes.forEach(node => nodesFormated.push({ 'id': node.id, 'title': node.title, 'message': node.message, 'type': node.type, 'finish': node.endFlowOption }));
        return nodesFormated;
    }

    const formatEdges = (_edges) => {
        let nodesFormated = [];
        _edges.forEach(edge => nodesFormated.push({ 'id': edge.id, 'source': edge.source, 'target': edge.target }));
        return nodesFormated;
    }

    const getAllNodes = formatNodes(nodes);
    const getAllEdges = formatEdges(edges);

    const findChildremElement = (id) => {

        let array = [];
        let edgeFilter = getAllEdges.filter(edge => edge.source === id);

        edgeFilter.forEach(edge => {
            let filter = getAllNodes.filter(node => node.id === edge.target);
            if (filter.length < 1) return;
            array.push(filter[0])
        });
        return array;

    }


    getAllNodes.forEach(node => {
        if (node.type === 'end') return;
        node.steps = findChildremElement(node.id);
    });

    // --------------------- //

    function mountResponse(option, title, steps) {

        optionInArray = steps;

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


    // SELECIONAR OBJETO ANTERIOR E MONTAR MENSAGEM DE RETORNO

    let oldObject;
    let oldOption = []

    function stepByStep(op) {

        let step = ''

        if (op === 'start') { step = 'start' } else if (op === '#') { step = '#' } else { step = Number(op) - 1 }

        let savestep = [];

        if (oldOption.length === 0) {

            savestep = getAllNodes.filter(node => node.id === step);
            oldOption.pop()
            oldOption.push(savestep[0]);
            let context = mountResponse(savestep[0].type, savestep[0].message, savestep[0].steps);
            return context;

        } else {

            if (step === `#`) {

                savestep = getAllNodes.filter(node => node.id === 'start');
                oldOption.pop()
                oldOption.push(savestep[0]);
                let context = mountResponse(savestep[0].type, savestep[0].message, savestep[0].steps);
                return context;

            } else {

                let selectedOption = oldOption[0].steps[step];

                if (selectedOption === undefined) {

                    let verifyLestMessage = Number(arrayStep[arrayStep.length - 1]);

                    if (isNaN(verifyLestMessage && oldObject?.finish === 'capture')) {
                        let returnThisObject = arrayStep.splice(-1, 1);
                        return `Capturou a mensagem: ${returnThisObject[0]}`
                    }

                    return 'Escolha uma opção válida';
                };

                if ((selectedOption.type === 'end' && selectedOption.finish !== 'capture')) { // Finalizar o fluxo do chat
                    let finish = finishFlow(selectedOption.finish, selectedOption.message);
                    return finish
                }

                if (selectedOption.type === 'end' && selectedOption.finish === 'capture') { // Salvar resposta enviada pelo usuário
                    let verifyLestMessage = Number(arrayStep[arrayStep.length - 1]);
                    console.info(selectedOption);
                    console.info(verifyLestMessage)
                    console.info(isNaN(verifyLestMessage))
                    oldObject = selectedOption;
                    return selectedOption.message;
                }

                if ((selectedOption.steps.length === 1)) {
                    return (selectedOption.steps[0].message)
                }

                oldOption.pop()
                oldOption.push(selectedOption);

                let context = mountResponse(selectedOption.type, selectedOption.message, selectedOption.steps);
                return context;

            }
        }
    }


    // A execução do passo a passo é retornada aqui.

    let lastMessage = '';
    arrayStep.forEach(el => lastMessage = stepByStep(el));

    console.warn(lastMessage); // Mensagem que o sistema manda para o usuario
    console.warn({ message: lastMessage, array: optionInArray, step: arrayStep })
    return { message: lastMessage, array: optionInArray, step: arrayStep };

    // ========================================== //

}

export default ChatBot;