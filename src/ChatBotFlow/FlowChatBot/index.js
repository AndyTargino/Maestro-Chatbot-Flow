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

    let oldObject;
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

        let savestep = [];

        if (oldOption.length === 0) {
            savestep = getAllNodes.filter(node => node.id === step);

            setNewObjectStep(savestep[0])

            let context = mountResponse(savestep[0].type, savestep[0].message, savestep[0].steps);
            return { 'message': context, 'type': 'flow' };
        } else {

            if (step === `#`) {


                console.info('Voltando fluxo')
                savestep = getAllNodes.filter(node => node.id === 'start');

                setNewObjectStep(savestep[0]);

                let context = mountResponse(savestep[0].type, savestep[0].message, savestep[0].steps);
                return { 'message': context, 'type': 'flow' };


            } else {

                let lastOptionChosen = oldOption[0]?.steps && !isNaN(step) ? oldOption[0].steps[step] : oldOption[0];

                /*
                                if (lastOptionChosen === undefined && !captured_flow) {
                                    console.info('Proximo passo com seleção undefined')
                                    // CAPTURA DE MENSAGEM AINDA NÃO IMPLEMENTADA NO SISTEMA
                                    let verifyLastMessage = Number(arrayStep[arrayStep.length - 1]);
                                    console.info({ verifyLastMessage })
                                    console.info({ oldObject })
                
                                    if (isNaN(verifyLastMessage) && oldObject.finish === 'capture') {
                                        let returnThisObject = arrayStep.splice(-1, 1);
                                        return `Capturou a mensagem: ${returnThisObject[0]}`
                                    }
                                    return { 'message': 'Escolha uma opção válida', 'type': 'flow' };
                                };
                
                */

                // ==================== CAPTURA DE MENSAGEM DURANTE O FLUXO NA CONDICIONAL ==================== //

                console.info('passando pena captura de condicional');
                console.info({ lastOptionChosen });
                console.info({ captured_flow });

                if (captured_flow && lastOptionChosen?.type === "conditional") {
                    console.info('teste1')
                    captured_flow = false;
                    let context = mountResponse(oldOption[0].type, oldOption[0].afterMessage, oldOption[0].steps);
                    return { 'message': context, 'type': 'flow' };
                }

                if (lastOptionChosen?.finish === 'capture' && lastOptionChosen?.type === "conditional") {
                    console.info(oldOption);
                    console.info('teste2')
                    captured_flow = true;

                    setNewObjectStep(lastOptionChosen);

                    console.info('entrei na captura')
                    return { 'message': lastOptionChosen.message, 'type': 'flow' };
                }

                // ============================================================================================ //



                // ==================== CAPTURA DE MENSAGEM DURANTE O FLUXO NA FINALIZAÇÃO ==================== //

                console.info('passando pena captura de finalização')
                if (!captured_flow && lastOptionChosen.type === 'end' && lastOptionChosen.finish === 'capture') { // Salvar resposta enviada pelo usuário
                    console.info('Entrou na finalização com captura de mensagem')
                    console.info(lastOptionChosen)
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
                    console.info('Entrou na finalização sem captura de mensagem')
                    let finish = finishFlow(lastOptionChosen.finish, lastOptionChosen.message);
                    return { 'message': finish, 'type': 'end' };
                }

                // ============================================================================================ //


                //Verificar o que este trecho está fazendo
                if ((lastOptionChosen.steps.length === 1)) {
                    console.info('entrei aqui')
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