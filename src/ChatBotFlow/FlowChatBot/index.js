function finishFlow(queueId, message) {

    console.info(queueId, message)

    if (queueId === 0) {
        // Finaliza o chat
        console.info('finalizando fluxo de bot')
    } else if (queueId === 'capture') {
        // FInaliza o chat
        console.info('Aqui captura a ultima mensagem enviada pelo usuário: ' + message)
    } else {
        // Manda para a fila
        console.info(`Aqui este atendimento será tranferido para a fila ${queueId}`)
    }

    let input = document.querySelector("#inputChatBot");
    if (document.body.contains(input)) {
        setTimeout(() => { input.disabled = true; input.value = 'Finalizou o fluxo do BOT'; }, 500);
    }

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

    //   FILTRO DE OBJETO   //

    const nodes = chatbot.nodes;
    const edges = chatbot.edges;

    const formatNodes = (_nodes) => {
        let nodesFormated = [];
        _nodes.forEach(node => nodesFormated.push({ 'id': node.id, 'title': node.title, 'message': node.message, 'afterMessage': node?.afterMessage, 'type': node.type, 'finish': node.endFlowOption }));
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

    let oldOption = [];
    let finished_flow = false;
    let captured_flow = false;


    const setNewObjectStep = (newOptionStep) => {
        oldOption.splice(-1, 1)
        oldOption.push(newOptionStep);
    }

    const stepByStep = (op) => {

        let step = ''

        if (op === 'start') { step = 'start' } else if (op === '#') { step = '#' } else { step = Number(op) - 1 }

        let saveStep = [];

        if (oldOption.length === 0) {
            saveStep = getAllNodes.filter(node => node.id === step);

            setNewObjectStep(saveStep[0])

            let context = mountResponse(saveStep[0].type, saveStep[0].message, saveStep[0].steps);
            return { 'message': context, 'type': 'flow' };
        } else {

            if (step === `#`) {
                saveStep = getAllNodes.filter(node => node.id === 'start');

                setNewObjectStep(saveStep[0]);

                let context = mountResponse(saveStep[0].type, saveStep[0].message, saveStep[0].steps);
                return { 'message': context, 'type': 'flow' };


            } else {

                let lastOptionChosen = oldOption[0]?.steps && !isNaN(step) ? oldOption[0].steps[step] : oldOption[0];

                // ==================== CAPTURA DE MENSAGEM DURANTE O FLUXO NA CONDICIONAL ==================== //


                if (captured_flow && lastOptionChosen?.type === "conditional") {  // Salvar resposta durante o fluxo do sistema
                    captured_flow = false;
                    let getMessageCaptured = arrayStep[arrayStep.length - 1];
                    console.info({ getMessageCaptured })
                    let context = mountResponse(oldOption[0].type, oldOption[0].afterMessage, oldOption[0].steps);
                    return { 'message': context, 'type': 'flow' };
                }


                if (lastOptionChosen?.finish === 'capture' && lastOptionChosen?.type === "conditional") { // Enviar mensagem para captura de resposta
                    captured_flow = true;
                    setNewObjectStep(lastOptionChosen);
                    return { 'message': lastOptionChosen.message, 'type': 'flow' };
                }

                // ============================================================================================ //



                // ==================== CAPTURA DE MENSAGEM DURANTE O FLUXO NA FINALIZAÇÃO ==================== //


                if (!captured_flow && lastOptionChosen.type === 'end' && lastOptionChosen.finish === 'capture') { // Salvar resposta enviada pelo usuário

                    if (finished_flow) {
                        setNewObjectStep(lastOptionChosen);
                        let finish = finishFlow(lastOptionChosen.finish, lastOptionChosen.afterMessage);
                        return { 'message': finish, 'type': 'end' };
                    } else {
                        finished_flow = true
                        let verifyLastMessage = Number(arrayStep[arrayStep.length - 1]);
                        setNewObjectStep(lastOptionChosen);
                        return { 'message': lastOptionChosen.message, 'type': 'end' };
                    }
                }



                if ((lastOptionChosen.type === 'end' && lastOptionChosen.finish !== 'capture')) { // Finalizar o fluxo do chat
                    let finish = finishFlow(lastOptionChosen.finish, lastOptionChosen.message);
                    return { 'message': finish, 'type': 'end' };
                }

                // ============================================================================================ //


                //Verificar o que este trecho está fazendo

                if ((lastOptionChosen.steps.length === 1)) {
                    return { 'message': lastOptionChosen.steps[0].message, 'type': 'end' };
                }

                setNewObjectStep(lastOptionChosen);

                if (!(lastOptionChosen.steps.length > 0)) return { 'message': 'not_step_defined', 'type': 'error' };

                let context = mountResponse(lastOptionChosen.type, lastOptionChosen.message, lastOptionChosen.steps);

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