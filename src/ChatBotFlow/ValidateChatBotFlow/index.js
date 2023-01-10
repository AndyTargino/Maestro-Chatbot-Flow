import FlowChatBot from "../FlowChatBot"


function checkStep(proximo, actualStep, chatBotFlow) {

    let arraySteps = [];
    arraySteps = actualStep;
    arraySteps.push(proximo);

    let { message, array, step } = FlowChatBot(chatBotFlow, arraySteps);

    if (!array) alert('faltando passos')

    array.forEach(passo => { checkArrayFromStep(passo, actualStep) });
}


function checkArrayFromStep(passo, arrayPasso) {
    checkStep(passo, arrayPasso)
}


const ValidadeChatBotFlow = (chatBotFlow) => {

    let { message, array, step } = FlowChatBot(chatBotFlow, ['start']);

    if (!array) alert('faltando passos')

    console.info(message)
    console.info(array)
    console.info(step)

    checkStep(array, step, chatBotFlow)

}
export default ValidadeChatBotFlow;
