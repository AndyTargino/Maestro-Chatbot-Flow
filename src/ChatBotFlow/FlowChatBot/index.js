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
    if (document.body.contains(input)) {
        setTimeout(() => { input.disabled = true; input.value = 'Finalizou o fluxo do BOT'; }, 500);
    }

    return message
}

const ChatBot = (chatbot, step) => {
    console.info(step)
    let optionInArray = [];
    let arrayStep;

    // Desenvolver regra de voltar uma resposta apenas
    if (step) {
        if (step[step.length - 1] === '#') {
            arrayStep = step.splice(-2, 2);
        }
        arrayStep = step;
    }

    //   FILTRO DE OBJETO   //

    const nodes = chatbot.nodes;
    const edges = chatbot.edges;

    const formatNodes = (_nodes) => {
        let nodesFormated = [];
        _nodes.forEach(node => nodesFormated.push({ 'id': node.id, 'title': node.title, 'message': node.message, 'afterMessage' :node.endFlowOption,'type': node.type, 'finish': node.endFlowOption }));
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
    let oldOption = [];
    let finished_flow = false;

    function stepByStep(op) {

        let step = ''

        if (op === 'start') { step = 'start' } else if (op === '#') { step = '#' } else { step = Number(op) - 1 }

        let savestep = [];

        if (oldOption.length === 0) {

            savestep = getAllNodes.filter(node => node.id === step);
            oldOption.splice(-1, 1)
            oldOption.push(savestep[0]);
            let context = mountResponse(savestep[0].type, savestep[0].message, savestep[0].steps);

            return { 'message': context, 'type': 'flow' };

        } else {

            if (step === `#`) {

                savestep = getAllNodes.filter(node => node.id === 'start');
                oldOption.splice(-1, 1)
                oldOption.push(savestep[0]);
                let context = mountResponse(savestep[0].type, savestep[0].message, savestep[0].steps);

                return { 'message': context, 'type': 'flow' };

            } else {

                let selectedOption = oldOption[0].steps[step];

                if (selectedOption === undefined) {

                    // CAPTURA DE MENSAGEM AINDA NÃO IMPLEMENTADA NO SISTEMA

                    let verifyLastMessage = Number(arrayStep[arrayStep.length - 1]);

                    if (isNaN(verifyLastMessage && oldObject.finish === 'capture')) {
                        let returnThisObject = arrayStep.splice(-1, 1);
                        return `Capturou a mensagem: ${returnThisObject[0]}`
                    }

                    return { 'message': 'Escolha uma opção válida', 'type': 'flow' };

                };

                if (selectedOption.type === 'end' && selectedOption.finish === 'capture') { // Salvar resposta enviada pelo usuário

                    if (!finished_flow) {
                        console.info(oldObject)
                        console.info(oldOption)
                        finished_flow = true
                        let verifyLastMessage = Number(arrayStep[arrayStep.length - 1]);
                        console.info(selectedOption);
                        console.info(verifyLastMessage)
                        console.info(isNaN(verifyLastMessage))
                        oldObject = selectedOption;
                        return { 'message': selectedOption.message, 'type': 'end' };
                    } else {
                        let finish = finishFlow(selectedOption.finish, selectedOption.message);
                        return { 'message': finish, 'type': 'end' };
                    }

                }

                if ((selectedOption.type === 'end' && selectedOption.finish !== 'capture')) { // Finalizar o fluxo do chat
                    let finish = finishFlow(selectedOption.finish, selectedOption.message);
                    return { 'message': finish, 'type': 'end' };
                }

                if ((selectedOption.steps.length === 1)) {
                    return { 'message': selectedOption.steps[0].message, 'type': 'end' };
                }

                oldOption.splice(-1, 1)
                oldOption.push(selectedOption);

                if (!(selectedOption.steps.length > 0)) return { 'message': 'not_step_defined', 'type': 'error' };

                let context = mountResponse(selectedOption.type, selectedOption.message, selectedOption.steps);

                return { 'message': context, 'type': 'flow' };

            }
        }
    }


    // A execução do passo a passo é retornada aqui.

    let response = {};
    arrayStep.forEach(el => response = stepByStep(el));
    return { message: response.message, array: optionInArray, step: arrayStep, type: response.type };

    // ========================================== //

}

export default ChatBot;