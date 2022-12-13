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
  //Edge,
  //EdgeTypes,
  Panel,
  getBezierPath,
  MiniMap,
  ReactFlowProvider,
  useReactFlow
} from "reactflow";

//import { ToastContainer, toast } from 'react-toastify';

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
import "reactflow/dist/style.css";

const foreignObjectSize = 40;
let nodeId = 1;

const nodeColor = (node) => {
  switch (node.type) {
    case 'input':
      return '#6ede87';
    case 'output':
      return '#ff0072';
    default:
      return '#6865A5';
  }
};

function Flow() {

  const reactFlowInstance = useReactFlow();

  // --------------- Valores iniciais --------------- //

  var initialNodes = [
    {
      id: `start`,
      data: {
        label: (
          <div className="showOptions">
            <Tooltip title="Editar" placement="top">
              <IconButton className="configButton" style={{
                position: `absolute`,
                margin: '-26% 0px 0px',
                left: '0px'
              }}
                onClick={() => editElement(`start`)}
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
                onClick={() => deleteNodeCard(`start`)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <p
              className="headerObject"
              style={{ margin: '5px', lineBreak: 'anywhere', fontSize: '15px' }}>{`Inicio do fluxo`}</p>

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
            </div>
          </div>
        )
      },
      position: { x: (document.body.offsetWidth / 3), y: 200 },
      type: "input",
      style: {
        background: '#42bf40',
        color: '#ffffff',
        width: 180,
        fontStyle: 'oblique',
        padding: '3px',
        border: '1px'
      }
    },
    {
      id: 'conditional',
      data: {
        label:
          (<div className="showOptions" id="conditional">
            <Tooltip title="Editar" placement="top">
              <IconButton className="configButton" style={{
                position: `absolute`,
                margin: '-26% 0px 0px',
                left: '0px'
              }}
                onClick={() => editElement('conditional')}
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
                onClick={() => deleteNodeCard('conditional')}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <p
              className="headerObject"
              style={{ margin: '5px', lineBreak: 'anywhere', fontSize: '15px' }}>Titulo</p>
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
            </div>
          </div>)
      },
      position: { x: (document.body.offsetWidth / 3) + 80, y: 400 },
      style: {
        background: '#191a4d',
        color: '#ffffff',
        width: 180,
        fontStyle: 'oblique',
        padding: '3px',
        border: '1px'
      },
    },
    {
      id: "end",
      data: {
        label: (
          <div className="showOptions">
            <Tooltip title="Editar" placement="top">
              <IconButton className="configButton" style={{
                position: `absolute`,
                margin: '-26% 0px 0px',
                left: '0px'
              }}
                onClick={() => editElement(`end`)}
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
                onClick={() => deleteNodeCard(`end`)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <p
              className="headerObject"
              style={{ margin: '5px', lineBreak: 'anywhere', fontSize: '15px' }}>{`Fim do fluxo`}</p>

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
                style={{ margin: '5px', lineBreak: 'anywhere', display: 'none' }}>{`Fim do fluxo`}</p>
              <p
                className="bodyObject"
                style={{ margin: '5px', lineBreak: 'anywhere', }}>{`Fim do fluxo`}</p>
            </div>
          </div>
        )
      },
      position: { x: (document.body.offsetWidth / 3) + 160, y: 600 },
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
  ];

  var initialEdges = [
    {
      "source": "start",
      "sourceHandle": null,
      "target": "conditional",
      "animated": true,
      "targetHandle": null,
      "type": "buttonedge",
      "id": "reactflow__edge-start-conditional"
    },
    {
      "source": "conditional",
      "sourceHandle": null,
      "target": "end",
      "animated": true,
      "targetHandle": null,
      "type": "buttonedge",
      "id": "reactflow__edge-conditional-end"
    }
  ];

  // ------------------------------------------------ //

  // ------ Config de elementos do fluxograma ------- //

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // ------------------------------------------------ //



  // -------------- funcoes do sistema --------------- //

  function EdgeButton({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
  }) {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    return (
      <>
        <path
          id={id}
          style={style}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd={markerEnd}
        />
        <foreignObject
          width={foreignObjectSize}
          height={foreignObjectSize}
          x={labelX - foreignObjectSize / 2}
          y={labelY - foreignObjectSize / 2}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div>
            <button className="edgebutton" onClick={(event) => onEdgeClick(event, id)}> × </button>
          </div>
        </foreignObject>
      </>
    );
  }

  const editElement = (id) => {
    setElementOnEdit(id)
    setConfirmModalOpen(true)
  }

  const getLastProps = (id) => {


    var lastTitle = '';
    var lastMessage = '';
    const position = nodes.map(i => i.id).indexOf(id);
    if (position === -1) return;
    nodes[position].data.label.props.children.forEach((obj) => {
      if (obj.props?.className === 'headerObject') { lastTitle = obj.props.children }
      if (obj.props.children?.props) { if (obj.props.children.props.className === 'bodyObject') { lastMessage = obj.props.children.props.children } }
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

    return { lastTitle, lastMessage, background: nodes[position].style.background, position: getPosition(id) }

  }


  const getPropsToSave = (id) => {
    var title = '';
    var message = '';
    const position_object = nodes.map(i => i.id).indexOf(id);
    if (position_object === -1) return;
    nodes[position_object].data.label.props.children.forEach((obj) => {
      if (obj.props?.className === 'headerObject') { title = obj.props.children }
      if (obj.props.children?.props) { if (obj.props.children.props.className === 'bodyObject') { message = obj.props.children.props.children } }
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

    return { id, title, message, position: nodes[position_object].position, style: nodes[position_object].style, type: getPosition(id) }
  }

  const editObjectProps = (id, title, message, color) => {

    var oldProps = getLastProps(id);

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
                  onClick={() => editElement(id)}
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
                style={{ margin: '5px', lineBreak: 'anywhere', fontSize: '15px' }}>{title ? title : oldProps.lastTitle}</p>
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
                  }}>{message ? message : oldProps.lastMessage}</p>
              </div>
            </div>),
          };
          node.style = {
            ...node.style,
            background: color ? color : oldProps.background
          };
        }

        return node;
      })
    );
  }

  const deleteNodeCard = (id) => setNodes(nds => nds.filter(node => node.id !== id));

  const deleteEdgeLine = (id) => setEdges(eds => eds.filter(edge => edge.id !== id));

  // ------------------------------------------------ //



  // --------- Config do menu de fluxograma --------- //

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClickOpenMenu = e => setAnchorEl(e.currentTarget);
  const handleClickCloseMenu = () => setAnchorEl(null);

  // ------------------------------------------------ //

  // - DESCONSTRUINDO OBJETO PARA NOVOS PARAMETROS - //
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
  // ------------------------------------------------ //

  // ----- Config de modificacao do fluxograma ------ //
  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(renderNewConnectStyle(params), eds)), []);
  // ------------------------------------------------ //


  const [elementOnEdit, setElementOnEdit] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);


  const createNewElement = useCallback((element) => {
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
                  onClick={() => editElement(`start_${id}`)}
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
                  onClick={() => editElement(`conditional_${id}`)}
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
        id: `end_${id}`,
        data: {
          label: (
            <div className="showOptions">
              <Tooltip title="Editar" placement="top">
                <IconButton className="configButton" style={{
                  position: `absolute`,
                  margin: '-26% 0px 0px',
                  left: '0px'
                }}
                  onClick={() => editElement(`end_${id}`)}
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
                  onClick={() => deleteNodeCard(`end_${id}`)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <p
                className="headerObject"
                style={{ margin: '5px', lineBreak: 'anywhere', fontSize: '15px' }}>{`Fim do fluxo ${id}`}</p>

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
                  style={{ margin: '5px', lineBreak: 'anywhere', display: 'none' }}></p>
                <p
                  className="bodyObject"
                  style={{ margin: '5px', lineBreak: 'anywhere', }}>{`Fim do fluxo`}</p>

              </div>
            </div>
          )
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


  const onEdgeClick = (evt, id) => {
    evt.stopPropagation();
    deleteEdgeLine(id)
  };



  const formatEdgeToSend = (edge) => {
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

  const viewData = (e) => {

    var edgesObjects = [];
    edges.forEach(edge => edgesObjects.push(formatEdgeToSend(edge)));
    console.warn(JSON.stringify(edgesObjects));

    var nodesObjects = [];
    nodes.forEach(node => nodesObjects.push(getPropsToSave(node.id)));
    console.warn(JSON.stringify(nodesObjects));

  }


  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const openModalChatBot = Boolean(anchorEl1);
  const handleClick = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl1(null);
  };

  var defaultMsg = [
    {
      'fromMe': false,
      'message': 'Teste mensagem'
    }, {
      'fromMe': true,
      'message': 'Teste mensagem local'
    }
  ]

  const [messagesBot, setMessagesBot] = useState(defaultMsg);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => { if (!openModalChatBot) { setMessagesBot(defaultMsg) } }, [openModalChatBot]);


  const defineNewMessage = (fromMe, message) => {
    const body = document.getElementById('body_Bot');
    setMessagesBot(pre => [...pre, { 'fromMe': fromMe, 'message': message }]);
    setInputValue('');
    setTimeout(() => { body.scrollTop = body.scrollHeight + 500; }, 150);
  }


  const onClickSend = e => {
    if (e !== 'Enter' || String(inputValue).length < 1) return;
    defineNewMessage(true, inputValue);
  }


  return (
    <div id='Teste' style={{
      display: 'flex',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <EditFlowModal
        title={`Titulo`}
        propsObject={getLastProps(elementOnEdit)}
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={(title, message, color) => editObjectProps(elementOnEdit, title, message, color)}
      />
      <div style={{ height: "90%", width: "90%" }}>
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
                  <MenuItem onClick={(e) => { handleClickCloseMenu(e); createNewElement('start') }}>Inicio</MenuItem>
                  <MenuItem onClick={(e) => { handleClickCloseMenu(e); createNewElement('cond') }}>Condicional</MenuItem>
                  <MenuItem onClick={(e) => { handleClickCloseMenu(e); createNewElement('end') }}>Fim</MenuItem>
                </Menu>
              </div>
            </Panel>
            <Panel position="top-right">
              <Button onClick={e => viewData(e)} variant="outlined">Ver Dados</Button>
            </Panel>
            <Panel position="bottom-right">
              <Button style={{ marginBottom: '240%' }} onClick={e => { viewData(e); handleClick(e); }} variant="text">
                <ModeCommentIcon />
              </Button>
              <Menu
                anchorEl={anchorEl1}
                open={openModalChatBot}
                onClose={handleClose}
              >
                <div style={{ backgroundColor: '#dddddd', width: '300px', height: '400px', margin: '-8px 0px -8px 0px' }}>
                  <div style={{
                    display: 'flex',
                    width: '100%',
                    height: '5%',
                    padding: '10px 0px 0px 0px',
                    alignContent: 'center',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}><p>Teste de fluxo do BOT</p></div>
                  <div
                    id="body_Bot"
                    style={{
                      maxHeight: '80%',
                      overflow: 'auto',
                      display: 'flex',
                      width: '94%',
                      margin: '10px 10px 0px 9px',
                      height: '80%',
                      backgroundColor: '#ffffff',
                      flexDirection: 'column',
                    }}>
                    <>{openModalChatBot && messagesBot.map((msg) => (
                      <>
                        {msg.message !== '' && <>
                          {msg.fromMe === true ?
                            <>
                              <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                width: '100%'
                              }}>
                                <div style={{
                                  textAlign: 'end',
                                  border: 'solid 1px #888888',
                                  color: 'white',
                                  borderRadius: '10px 0px 10px 10px',
                                  backgroundColor: '#888888',
                                  margin: '5px 5px 5px 0px',
                                  padding: '0px 5px 0PX 5PX',
                                  fontSize: '14px',
                                  wordBreak: 'break-all',
                                  maxWidth: '200px'
                                }}>
                                  <p style={{ margin: '5px 0px 5px 0px' }}>{msg.message}</p>
                                </div>
                              </div>
                            </> : <>
                              <div style={{
                                display: 'flex',
                                width: '100%'
                              }}>
                                <div style={{
                                  border: 'solid 1px #dad0d0',
                                  borderRadius: '0px 10px 10px 10px',
                                  backgroundColor: '#c3c3c300',
                                  margin: '5px 0px 5px 5px',
                                  padding: '0px 5px 0PX 5PX',
                                  fontSize: '14px',
                                  wordBreak: 'break-all',
                                  maxWidth: '200px'
                                }}>
                                  <p style={{ margin: '5px 0px 5px 0px' }}>{msg.message}</p>
                                </div>
                              </div>
                            </>}
                        </>
                        }</>
                    ))}
                    </>
                  </div>
                  <div style={{
                    display: 'flex',
                    width: '100%',
                    height: '10%',
                    justifyContent: 'center'
                  }}>
                    <input
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyPress={e => onClickSend(e.key)}
                      style={{
                        width: '80%',
                        height: '30px',
                        borderRadius: '0px 0px 0px 5px',
                        border: 'solid 1px #bbbbbb'
                      }} type="text" />
                    <button
                      onClick={e => onClickSend('Enter')}
                      style={{
                        width: '12%',
                        height: '34px',
                        borderRadius: '0px 0px 5px',
                        border: 'solid 1px #bbbbbb',
                        backgroundColor: 'white'
                      }}>
                      <SendIcon style={{ width: '17px' }} />
                    </button>
                  </div>
                </div>
              </Menu>
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