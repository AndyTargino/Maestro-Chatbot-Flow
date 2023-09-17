export default function validateChatBotFlow({ nodes, edges }) {

    const formatNodes = (_nodes) => _nodes.map(node => ({
        'id': node.id,
        'title': node.title,
        'message': node.message,
        'type': node.type,
        'finish': node.endFlowOption
    }));

    const formatEdges = (_edges) => _edges.map(edge => ({
        'id': edge.id,
        'source': edge.source,
        'target': edge.target
    }));

    const formattedNodes = formatNodes(nodes);
    const formattedEdges = formatEdges(edges);
    const nodeIds = formattedNodes.map(node => node.id);

    const filterEdges = () => {
        const uniqueEdgeSources = [...new Set(formattedEdges.flatMap(edge => [edge.source, edge.target]))];
        return uniqueEdgeSources.filter(nodeId => nodeIds.includes(nodeId));
    }

    const conditionalNodes = formattedNodes.filter(node =>
        node.id.includes('conditional') || node.id.includes('start')
    );

    const existingNodes = filterEdges();

    const validEdges = formattedEdges.filter(edge => {
        return existingNodes.includes(edge.source) && existingNodes.includes(edge.target);
    });

    const firstInvalidNode = conditionalNodes.find(cond =>
        !validEdges.some(edge => edge.source === cond.id)
    );

    return firstInvalidNode ?
        { message: `O card "${firstInvalidNode.title}" não tem condicionais para prosseguir`, type: 'error' } :
        { message: 'Fluxo sem problemas', type: 'success' };
}
