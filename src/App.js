import * as React from 'react';

import {
  useState,
  useCallback,
  useEffect
} from "react";

import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Panel,
  getBezierPath,
  MiniMap,
  ReactFlowProvider,
  useReactFlow
} from "reactflow";

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import SendIcon from '@mui/icons-material/Send';
import EditFlowModal from './EditFlowModal';
import ChatBotTestModal from './ChatBotTestModal';

import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import FlagIcon from '@mui/icons-material/Flag';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import GroupIcon from '@mui/icons-material/Group';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import "reactflow/dist/style.css";

const foreignObjectSize = 40;
let nodeId = 1;

const nodeColor = (node) => {
  switch (node.type) {
    case 'input':
      return '#42bf40';
    case 'output':
      return '#ff0072';
    default:
      return '#6865A5';
  }
};



var queues = [{
  "id": 1,
  "name": "Financeiro"
},
{
  "id": 2,
  "name": "Suporte"
},
{
  "id": 3,
  "name": "Dúvidas"
}];


function getQueue(tipo, id) {
  if (Number(id) === 0) {
    if (tipo === 'end') {
      return '- Finalizar';
    } else {
      return;
    }
  }

  var fila = queues.filter(q => q.id === id)
  if (fila.length) {
    if (fila[0].name) {
      return `- ${fila[0].name}`;
    }
  }
}


function Flow() {


  const reactFlowInstance = useReactFlow();

  // ==== Renderizar objetos anteriores na tela ==== //
  const renderIcon = (type, endOption) => {
    if (type === 'start') {
      return <Tooltip title="Inicio do fluxo"><FlagIcon /></Tooltip>;
    }
    if (type === 'conditional') {
      return <Tooltip title="Uma pergunta ou seleção para prosseguir"><QuestionMarkIcon /></Tooltip>;
    }
    if (type === 'end') {
      if (endOption === 0) {
        return <Tooltip title="Finaliza o fluxo encerrando o atendimento"><DoneAllIcon /></Tooltip>;
      } else {
        return <Tooltip title="Finaliza o fluxo movendo para fila"><GroupIcon /></Tooltip>;
      }
    }
  }

  const RenderObject = (obj) => {

    var type = obj.type;
    var typeEndFlow = obj.endFlowOption

    var objeto = {};

    objeto = {
      id: `${obj.id}`,
      data: {
        label: (
          <div className="showOptions">
            <Tooltip title="Editar" placement="top">
              <IconButton className="configButton" style={{
                position: 'absolute',
                margin: '-26% 0px 0px',
                left: '0px'
              }}
                onClick={() => EditNodeElement(`${obj.id}`)}
              >
                <BorderColorIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Deletar" placement="top">
              <IconButton className="configButton" style={{
                position: 'absolute',
                margin: '-25% -5px 0px 0px',
                right: '0px'
              }}
                onClick={() => deleteNodeCard(`${obj.id}`)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <p
              className="headerObject"
              style={{
                margin: '5px',
                lineBreak: 'anywhere',
                fontSize: '15px'
              }}>{obj.title}</p>

            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'center'
            }}>
            </div>
            <div style={{
              background: 'white',
              color: 'black',
              marginTop: '-1px',
              padding: '10px',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center'
            }}>
              <p
                className="bodyObject"
                style={{
                  margin: '5px',
                  lineBreak: 'anywhere'
                }}>{obj.message}</p>
              <p
                className="endOption"
                style={{ display: 'none' }}>{typeEndFlow}</p>
            </div>
            <div
              style={{
                margin: '5px 3px 0px 0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <div> {renderIcon(type, typeEndFlow)}</div>
              <div>{type !== 'start' && getQueue(type, typeEndFlow)} </div>
            </div>
          </div>
        )
      },
      position: obj.position,
      type: type === 'end' ? 'output' : type === 'start' ? 'input' : type,
      style: obj.style
    }

    return objeto;

  }

  function renderNodes(_nodes) {
    var array = [];
    _nodes.forEach(obj => array.push(RenderObject(obj)));
    return array;
  }

  // ================================================ //


  // =============== Valores iniciais =============== //

  const initialNodes = [{ "id": "end_9", "title": "Pacote de produtos em promoção", "message": "Link para compra de pacote no site.", "endFlowOption": 0, "position": { "x": 1469.3758675395663, "y": 434.7505804580599 }, "style": { "background": "#bf4054", "color": "#ffffff", "width": 180, "fontStyle": "oblique", "padding": "3px", "border": "1px" }, "type": "end" }, { "id": "end_8", "title": "Chave de software", "message": "Enviar cupom de desconto", "endFlowOption": 0, "position": { "x": 1306.078655725802, "y": 687.9244030693274 }, "style": { "background": "#862d79", "color": "#ffffff", "width": 180, "fontStyle": "oblique", "padding": "3px", "border": "1px" }, "type": "end" }, { "id": "end_7", "title": "Software de drivers", "message": "Chave de desconto", "endFlowOption": 0, "position": { "x": 995.1588508043224, "y": 594.0228497384687 }, "style": { "background": "#bd40bf", "color": "#ffffff", "width": 180, "fontStyle": "oblique", "padding": "3px", "border": "1px" }, "type": "end" }, { "id": "conditional_6", "title": "Promoções em produtos", "message": "Temos promoções disponíveis para 3 produtos:", "endFlowOption": 0, "position": { "x": 978.4980906225047, "y": 304.42087154277533 }, "style": { "background": "#4d1944", "color": "#ffffff", "width": 180, "fontStyle": "oblique", "padding": "3px", "border": "1px" }, "type": "conditional" }, { "id": "end_5", "title": "Problemas com aplicativo", "message": "Descreva uma breve descrição do problema enquanto te direcionamos para um de nossos atendentes.", "endFlowOption": 0, "position": { "x": 955.1600763417966, "y": 825.9782270000976 }, "style": { "background": "#79b8d2", "color": "#ffffff", "width": 180, "fontStyle": "oblique", "padding": "3px", "border": "1px" }, "type": "end" }, { "id": "end_4", "title": "Treinamento", "message": "Um especialista irá atende-lo em breve, aguarde um instante.", "endFlowOption": 0, "position": { "x": 722.335132819154, "y": 917.3994079613797 }, "style": { "background": "#4092bf", "color": "#ffffff", "width": 180, "fontStyle": "oblique", "padding": "3px", "border": "1px" }, "type": "end" }, { "id": "end_3", "title": "Software", "message": "Enviar apostila com dados para cliente sobre o software para cliente.", "endFlowOption": 0, "position": { "x": 513.1494508062156, "y": 818.371364025877 }, "style": { "background": "#79a9d2", "color": "#ffffff", "width": 180, "fontStyle": "oblique", "padding": "3px", "border": "1px" }, "type": "end" }, { "id": "end_2", "title": "Problemas com pagamento.", "message": "Aguarde que em breve você será atendido.", "endFlowOption": 2, "position": { "x": 241.61505656695005, "y": 512.8689065420092 }, "style": { "background": "#40bf4b", "color": "#ffffff", "width": 180, "fontStyle": "oblique", "padding": "3px", "border": "1px" }, "type": "end" }, { "id": "start", "title": "Inicio", "message": "Seja bem vindo!\nEscolha uma das opções para prosseguir:", "endFlowOption": 0, "position": { "x": 728.5659344885909, "y": 67.996788457279 }, "style": { "background": "#42bf40", "color": "#ffffff", "width": 180, "fontStyle": "oblique", "padding": "3px", "border": "1px" }, "type": "start" }, { "id": "conditional_example", "title": "Financeiro", "message": "Qual assunto em financeiro você deseja prosseguir?", "endFlowOption": 0, "position": { "x": 449.34958677255895, "y": 306.95111115371697 }, "style": { "background": "#2d867c", "color": "#ffffff", "width": 180, "fontStyle": "oblique", "padding": "3px", "border": "1px" }, "type": "conditional" }, { "id": "conditional_example_1", "title": "Suporte", "message": "Com qual assunto você precisa de ajuda?", "endFlowOption": 0, "position": { "x": 728.7256487893693, "y": 586.6084674464471 }, "style": { "background": "#4042bf", "color": "#ffffff", "width": 180, "fontStyle": "oblique", "padding": "3px", "border": "1px" }, "type": "conditional" }, { "id": "end", "title": "Gerar segunda via de boleto", "message": "Aguarde que você será atendido em breve. Enquanto aguarda, descreva uma pequena descrição de qual boleto deseja gerar segunda via.", "endFlowOption": 0, "position": { "x": 457.2734628025855, "y": 511.90964242268404 }, "style": { "background": "#40bf46", "color": "#ffffff", "width": 180, "fontStyle": "oblique", "padding": "3px", "border": "1px" }, "type": "end" }];

  const initialEdges = [
    {
      "animated": true,
      "id": "reactflow__edge-start-conditional", "source": "start", "sourceHandle": null, "target": "conditional", "targetHandle": null, "type": "buttonedge"
    }, { "animated": true, "id": "reactflow__edge-conditional-end", "source": "conditional", "sourceHandle": null, "target": "end", "targetHandle": null, "type": "buttonedge" }, { "animated": true, "id": "reactflow__edge-start-conditional_example", "source": "start", "sourceHandle": null, "target": "conditional_example", "targetHandle": null, "type": "buttonedge" }, { "animated": true, "id": "reactflow__edge-conditional_example-end_2", "source": "conditional_example", "sourceHandle": null, "target": "end_2", "targetHandle": null, "type": "buttonedge" }, { "animated": true, "id": "reactflow__edge-conditional_example-end", "source": "conditional_example", "sourceHandle": null, "target": "end", "targetHandle": null, "type": "buttonedge" }, { "animated": true, "id": "reactflow__edge-start-conditional_6", "source": "start", "sourceHandle": null, "target": "conditional_6", "targetHandle": null, "type": "buttonedge" }, { "animated": true, "id": "reactflow__edge-conditional_6-end_9", "source": "conditional_6", "sourceHandle": null, "target": "end_9", "targetHandle": null, "type": "buttonedge" }, { "animated": true, "id": "reactflow__edge-conditional_6-end_7", "source": "conditional_6", "sourceHandle": null, "target": "end_7", "targetHandle": null, "type": "buttonedge" }, { "animated": true, "id": "reactflow__edge-conditional_6-end_8", "source": "conditional_6", "sourceHandle": null, "target": "end_8", "targetHandle": null, "type": "buttonedge" }, { "animated": true, "id": "reactflow__edge-conditional_example_1-end_4", "source": "conditional_example_1", "sourceHandle": null, "target": "end_4", "targetHandle": null, "type": "buttonedge" }, { "animated": true, "id": "reactflow__edge-conditional_example_1-end_3", "source": "conditional_example_1", "sourceHandle": null, "target": "end_3", "targetHandle": null, "type": "buttonedge" }, { "animated": true, "id": "reactflow__edge-conditional_example_1-end_5", "source": "conditional_example_1", "sourceHandle": null, "target": "end_5", "targetHandle": null, "type": "buttonedge" }, { "animated": true, "id": "reactflow__edge-start-conditional_example_1", "source": "start", "sourceHandle": null, "target": "conditional_example_1", "targetHandle": null, "type": "buttonedge" }
  ];

  // ================================================ //


  // ================= REACT props ================== //

  const [modalChatbotOpen, setModalChatbotOpen] = useState(false);
  const [nodes, setNodes] = useState(renderNodes(initialNodes));
  const [edges, setEdges] = useState(initialEdges);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClickOpenMenu = e => setAnchorEl(e.currentTarget);
  const handleClickCloseMenu = () => setAnchorEl(null);

  const [elementOnEdit, setElementOnEdit] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [chatBotFlow, setChatBotFlow] = useState({});

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(renderNewConnectStyle(params), eds)), []);

  const openMenu = Boolean(anchorEl);

  // ================================================ //

  // ============ BOTÃO DE EXCLUIR ALVO ============= //

  function EdgeButton({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }) {
    const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });

    return (
      <>
        <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
        <foreignObject width={foreignObjectSize} height={foreignObjectSize} x={labelX - foreignObjectSize / 2} y={labelY - foreignObjectSize / 2} className="edgebutton-foreignobject" requiredExtensions="http://www.w3.org/1999/xhtml">
          <div>
            <button className="edgebutton" onClick={(event) => DeleteTargetEdgeLile(event, id)}> × </button>
          </div>
        </foreignObject>
      </>
    );
  }

  // =============== Modal de edições ============== //

  const EditNodeElement = (id) => {
    setElementOnEdit(id)
    setConfirmModalOpen(true)
  }

  // ================ FILTRO DE DADOS =============== //

  const FilterNodeData = (id) => {
    var title = '';
    var message = '';
    var endFlowOption = '';

    const position_object = nodes.map(i => i.id).indexOf(id);
    if (position_object === -1) return;
    nodes[position_object].data.label.props.children.forEach((obj) => {

      if (obj?.props?.children) {
        if ((obj.props.children).length === 2) {
          var objetoArray = obj.props.children;
          objetoArray.forEach(obj => {
            if (obj.props.className === 'bodyObject') { message = obj.props.children }
            if (obj.props.className === 'endOption') { endFlowOption = obj.props.children }
          });
        }
      }

      if (obj.props?.className === 'headerObject') { title = obj.props.children }
    });

    const getPosition = (id_name) => {
      if (id_name.includes('end')) {
        return 'end'
      }
      if (id_name.includes('conditional')) {
        return 'conditional'
      }
      if (id_name.includes('start')) {
        return 'start'
      }
    }

    return { id, title, message, endFlowOption, position: nodes[position_object].position, style: nodes[position_object].style, type: getPosition(id) }
  }

  const FilterEdgeData = (edge) => {
    return {
      "animated": edge.animated,
      "id": edge.id,
      "source": edge.source,
      "sourceHandle": edge.sourceHandle,
      "target": edge.target,
      "targetHandle": edge.targetHandle,
      "type": edge.type,
    }
  }

  // ================================================ //

  // ============== Funções de deletar ============== //

  const DeleteTargetEdgeLile = (evt, id) => {
    evt.stopPropagation();
    deleteEdgeLine(id)
  };

  const deleteNodeCard = (id) => setNodes(nds => nds.filter(node => node.id !== id));

  const deleteEdgeLine = (id) => setEdges(eds => eds.filter(edge => edge.id !== id));

  // ================================================ //


  // ========== Pegar propriedades do NODE ========== //

  const getNodeProps = (id) => {

    var lastTitle = '';
    var lastMessage = '';
    var endFlowOption = '';

    const position = nodes.map(i => i.id).indexOf(id);
    if (position === -1) return;
    nodes[position].data.label.props.children.forEach((obj) => {

      if (obj?.props?.children) {
        if ((obj.props.children).length === 2) {
          var objetoArray = obj.props.children;
          objetoArray.forEach(obj => {
            if (obj.props.className === 'bodyObject') { lastMessage = obj.props.children }
            if (obj.props.className === 'endOption') { endFlowOption = obj.props.children }
          });
        }
      }

      if (obj.props?.className === 'headerObject') { lastTitle = obj.props.children };

    });

    const getPosition = (id_name) => {
      if (id_name.includes('end')) {
        return 'end'
      }
      if (id_name.includes('conditional')) {
        return 'conditional'
      }
      if (id_name.includes('start')) {
        return 'start'
      }
    }

    return { lastTitle, lastMessage, endFlowOption, background: nodes[position].style.background, position: getPosition(id) }

  }

  // ================================================ //

  // ================= Editar Node ================== //

  const EditNodeObjectProps = (id, title, message, color, endOption, type) => {



    var oldProps = getNodeProps(id);

    var endOptionProps = endOption || endOption === 0 ? endOption : oldProps.endFlowOption;
    console.info(endOptionProps);

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            label: (<div className="showOptions" id={id}>
              <Tooltip title="Editar" placement="top">
                <IconButton className="configButton" style={{
                  position: `absolute`,
                  margin: '-26% 0px 0px',
                  left: '0px'
                }}
                  onClick={() => EditNodeElement(id)}
                >
                  <BorderColorIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Deletar" placement="top">
                <IconButton className="configButton" style={{
                  position: `absolute`,
                  margin: '-25% -5px 0px 0px',
                  right: '0px'
                }}
                  onClick={() => deleteNodeCard(id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <p
                className="headerObject"
                style={{ margin: '5px', lineBreak: 'anywhere', fontSize: '15px' }}>{title ? title : 'Titulo'}</p>
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'center'
              }}>
              </div>
              <div style={{
                background: 'white',
                color: 'black',
                marginTop: '-1px',
                padding: '10px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center'
              }}>
                <p
                  className="bodyObject"
                  style={{
                    margin: '5px',
                    lineBreak: 'anywhere'
                  }}>{message ? message : 'Mensagem'}</p>
                <p
                  className="endOption"
                  style={{ display: 'none' }}>{endOptionProps}
                </p>
              </div>
              <div
                style={{
                  margin: '5px 3px 0px 0px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <div>{renderIcon(type, endOptionProps)}</div>
                <div>{type !== 'start' && getQueue(type, endOptionProps)}</div>
              </div>
            </div>),
          };
          node.style = {
            ...node.style,
            background: color ? color : oldProps.background
          };
          node.type = type === 'end' ? 'output' : type
        }
        return node;
      })
    );
  }

  // ================================================ //

  // = DESCONSTRUINDO OBJETO PARA NOVOS PARAMETROS = //

  const renderNewConnectStyle = (props) => {
    var object = {
      "source": props.source,
      "sourceHandle": props.sourceHandle,
      "target": props.target,
      "animated": true,
      "targetHandle": props.targetHandle,
      "type": 'buttonedge',
    }
    return object;
  }

  // ================================================ //

  // ============= Criar novo elemento ============== //

  const createNewNode = useCallback((element) => {
    var object = {};
    const id = `${++nodeId}`;
    if (element === 'start') {
      object = {
        id: `start_${id}`,
        data: {
          label: (
            <div className="showOptions">
              <Tooltip title="Editar" placement="top">
                <IconButton className="configButton" style={{
                  position: `absolute`,
                  margin: '-26% 0px 0px',
                  left: '0px'
                }}
                  onClick={() => EditNodeElement(`start_${id}`)}
                >
                  <BorderColorIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Deletar" placement="top">
                <IconButton className="configButton" style={{
                  position: `absolute`,
                  margin: '-25% -5px 0px 0px',
                  right: '0px'
                }}
                  onClick={() => deleteNodeCard(`start_${id}`)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <p
                className="headerObject"
                style={{ margin: '5px', lineBreak: 'anywhere', fontSize: '15px' }}>{`Inicio do fluxo ${id}`}</p>

              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'center'
              }}>
              </div>
              <div style={{
                background: 'white',
                color: 'black',
                marginTop: '-1px',
                padding: '10px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center'
              }}>
                <p
                  className="bodyObject"
                  style={{
                    margin: '5px',
                    lineBreak: 'anywhere'
                  }}>Inicio do fluxo</p>
                <p
                  className="endOption"
                  style={{ display: 'none' }}>{0}
                </p>
              </div>
              <div
                style={{
                  margin: '5px 3px 0px 0px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <div>{renderIcon('start', 0)}</div>
              </div>
            </div>
          )
        },
        position: { x: 10 * nodeId, y: 10 * nodeId },
        type: "input",
        style: {
          background: '#42bf40',
          color: '#ffffff',
          width: 180,
          fontStyle: 'oblique',
          padding: '3px',
          border: '1px'
        }
      }
    }
    if (element === 'cond') {
      object = {
        id: `conditional_${id}`,
        data: {
          label:
            (<div className="showOptions" id={`conditional_${id}`}>
              <Tooltip title="Editar" placement="top">
                <IconButton className="configButton" style={{
                  position: `absolute`,
                  margin: '-26% 0px 0px',
                  left: '0px'
                }}
                  onClick={() => EditNodeElement(`conditional_${id}`)}
                >
                  <BorderColorIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Deletar" placement="top">
                <IconButton className="configButton" style={{
                  position: `absolute`,
                  margin: '-25% -5px 0px 0px',
                  right: '0px'
                }}
                  onClick={() => deleteNodeCard(`conditional_${id}`)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <p
                className="headerObject"
                style={{ margin: '5px', lineBreak: 'anywhere', fontSize: '15px' }}>{`Titulo ${id}`}</p>
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'center'
              }}>
              </div>
              <div style={{
                background: 'white',
                color: 'black',
                marginTop: '-1px',
                padding: '10px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center'
              }}>
                <p
                  className="bodyObject"
                  style={{
                    margin: '5px',
                    lineBreak: 'anywhere'
                  }}>Mensagem</p>
                <p
                  className="endOption"
                  style={{ display: 'none' }}>{0}
                </p>
              </div>
              <div
                style={{
                  margin: '5px 3px 0px 0px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <div>{renderIcon('conditional', 0)}</div>
                <div>{getQueue('conditional', 0)}</div>
              </div>
            </div>)
        },
        position: { x: 10 * nodeId, y: 10 * nodeId },
        style: {
          background: '#191a4d',
          color: '#ffffff',
          width: 180,
          fontStyle: 'oblique',
          padding: '3px',
          border: '1px'
        },
      }
    }
    if (element === 'end') {
      object = {
        id: `end_flow_${id}`,
        data: {
          label:
            (<div className="showOptions" id={`end_flow_${id}`}>
              <Tooltip title="Editar" placement="top">
                <IconButton className="configButton" style={{
                  position: `absolute`,
                  margin: '-26% 0px 0px',
                  left: '0px'
                }}
                  onClick={() => EditNodeElement(`end_flow_${id}`)}
                >
                  <BorderColorIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Deletar" placement="top">
                <IconButton className="configButton" style={{
                  position: `absolute`,
                  margin: '-25% -5px 0px 0px',
                  right: '0px'
                }}
                  onClick={() => deleteNodeCard(`end_flow_${id}`)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <p
                className="headerObject"
                style={{ margin: '5px', lineBreak: 'anywhere', fontSize: '15px' }}>{`Titulo ${id}`}</p>

              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'center'
              }}>
              </div>
              <div style={{
                background: 'white',
                color: 'black',
                marginTop: '-1px',
                padding: '10px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center'
              }}>
                <p
                  className="bodyObject"
                  style={{
                    margin: '5px',
                    lineBreak: 'anywhere'
                  }}>{'Mensagem'}</p>
                <p
                  className="endOption"
                  style={{ display: 'none' }}>{0}</p>
              </div>
              <div
                style={{
                  margin: '5px 3px 0px 0px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <div>{renderIcon('end', 0)}</div>
                <div>{getQueue('end', 0)}</div>
              </div>
            </div>)
        },
        position: { x: 10 * nodeId, y: 10 * nodeId },
        type: "output",
        style: {
          background: "#bf4040",
          color: '#ffffff',
          width: 180,
          fontStyle: 'oblique',
          padding: '3px',
          border: '1px'
        }
      }
    }

    reactFlowInstance.addNodes(object);
  }, []);

  // ================================================ //

  // =============== modal de chatbot =============== //

  const openChatbotModal = () => {

    // Nessesário formatar os dados enviados para conseguir executar no fluxo de chatbot
    var edgesObjects = [];
    var nodesObjects = [];

    edges.forEach(edge => edgesObjects.push(FilterEdgeData(edge)));
    nodes.forEach(node => nodesObjects.push(FilterNodeData(node.id)));

    setChatBotFlow({ 'nodes': nodesObjects, 'edges': edgesObjects });
    setModalChatbotOpen(true);

  }

  // ================================================ //

  const viewData = (e) => {

    var edgesObjects = [];
    edges.forEach(edge => edgesObjects.push(FilterEdgeData(edge)));
    console.info(JSON.stringify(edgesObjects));

    var nodesObjects = [];
    nodes.forEach(node => nodesObjects.push(FilterNodeData(node.id)));
    console.info(JSON.stringify(nodesObjects));
  }


  return (
    <div id='Teste' style={{
      display: 'flex',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    }}>

      <EditFlowModal
        propsObject={getNodeProps(elementOnEdit)}
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        queues={queues}
        onConfirm={(title, message, color, endOption, position) => EditNodeObjectProps(elementOnEdit, title, message, color, endOption, position)}
      />

      <div style={{ height: "100%", width: "100%" }}>
        <>
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            edgeTypes={{ buttonedge: EdgeButton }}
            style={{ backgroundColor: '#d9d9d9' }}
          >
            <Panel position="top-left">
              <div>
                <Button
                  id="demo-positioned-button"
                  variant="outlined"
                  aria-controls={openMenu ? 'demo-positioned-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openMenu ? 'true' : undefined}
                  onClick={handleClickOpenMenu}
                >
                  Novo Elemento
                </Button>
                <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleClickCloseMenu}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <MenuItem disabled onClick={(e) => { handleClickCloseMenu(e); createNewNode('start') }}>Inicio</MenuItem>
                  <MenuItem onClick={(e) => { handleClickCloseMenu(e); createNewNode('cond') }}>Pergunta</MenuItem>
                  <MenuItem onClick={(e) => { handleClickCloseMenu(e); createNewNode('end') }}>Finalizar / Transferir</MenuItem>
                </Menu>
              </div>
            </Panel>
            <Panel position="top-right">
              <Button onClick={e => viewData(e)} variant="outlined">Ver Dados</Button>
            </Panel>
            <Panel position="bottom-right">
              <Button style={{ marginBottom: '240%' }} onClick={e => { openChatbotModal(e); }} variant="text">
                <ModeCommentIcon />
              </Button>
              <ChatBotTestModal
                open={modalChatbotOpen}
                onClose={setModalChatbotOpen}
                chatBotFlow={chatBotFlow}
              />
            </Panel>
            <Background variant={'lines'} />
            <Controls />
            <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
          </ReactFlow>
        </>
      </div>
    </div >
  );
};


export default function () {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
};