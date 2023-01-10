
export default function ValidadeChatBotFlow(chatBotFlow) {

    const nodes = chatBotFlow.nodes;
    const edges = chatBotFlow.edges;

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
    const nodesIdArray = getAllNodes.map(node => node.id)

    // Buscar apenas valores que existem em nodes (O reactflow por sí tem bugs na hora de capturar os dados existentes)
    function FilterEdge() {
        let getFromSource = getAllEdges.map(edge => edge.source);
        let getFromTarget = getAllEdges.map(edge => edge.target);
        const arrUnique = [...new Set(getFromSource.concat(getFromTarget))];
        let filteredArray = [];
        arrUnique.forEach(nodeId => { if (nodesIdArray.indexOf(nodeId) !== -1) filteredArray.push(nodeId) });
        return filteredArray;
    }


    const getFlowConditionals = getAllNodes.filter(node => node.id.includes('conditional') || node.id.includes('start'))


    let existsNodes = FilterEdge();
    let saveValuesValids = [];
    getAllEdges.forEach(edge => {
        const edges_S = getAllEdges.filter(e => e.source === edge.source)
        edges_S.forEach(find => {
            if (existsNodes.indexOf(find.target) !== -1) {
                saveValuesValids.push(find)
            }
        });
    });
    const arrUnique = [...new Set(saveValuesValids)];
    
    let error = [];

    getFlowConditionals.forEach(cond => {
        if (arrUnique.findIndex(e => e.source === cond.id) === -1) {
            error.push(cond)
        }
    });

    if (error.length === 0) {
        return { message: 'Fluxo sem problemas', type: 'success' }
    } else {
        return { message: `O card "${error[0].title}" não tem condicionais para prosseguir`, type: 'error' }
    }

}
