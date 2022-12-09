import * as React from 'react';
import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Edge,
  EdgeTypes,
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
import EditFlowModal from './EditFlowModal';


import "reactflow/dist/style.css";

const foreignObjectSize = 40;

let nodeId = 1;

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
      position: { x: 250, y: 0 },
      type: "input",
      style: {
        background: '#24b322',
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
      position: { x: 235, y: 150 },
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
                style={{
                  margin: '5px',
                  lineBreak: 'anywhere'
                }}>Fim do fluxo</p>
            </div>
          </div>
        )
      },
      position: { x: 250, y: 300 },
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
  var initialEdges = [];

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
        position: { x: 10 * nodes.length, y: 10 * nodes.length },
        type: "input",
        style: {
          background: '#24b322',
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
        position: { x: 50 * nodes.length, y: 50 * nodes.length },
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
                  style={{
                    margin: '5px',
                    lineBreak: 'anywhere'
                  }}>Fim do fluxo</p>
              </div>
            </div>
          )
        },
        position: { x: 10 * nodes.length, y: 10 * nodes.length },
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

  return (
    <div id='Teste' style={{
      display: 'flex',
      height: '100%',
      width: '100%',
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
      <button onClick={e => viewData(e)}>Ver Dados</button>
      <div>
        <Button
          id="demo-positioned-button"
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

      <div style={{ height: "70%", width: "70%" }}>
        <>
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            edgeTypes={{ buttonedge: EdgeButton }}
          >
            <Background variant={'lines'} />
            <Controls />
            <MiniMap />
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