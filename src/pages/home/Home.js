import React, {useCallback, useEffect, useState} from 'react';
import ReactFlow, {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls,
    MarkerType,
    updateEdge,
    getConnectedEdges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import SideMenu from '../../components/UI/SideMenu.js';
import NodeButton from '../../components/Button/NodeButton.js';
import './Home.css';
import CustomTextNode from '../components/CustomTextNode.js';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import CustomTextNodeDummy from '../components/CustomTextNodeDummy.js';
import _ from "lodash";
import NodeEditor from '../components/NodeEditor.js';
import Navbar from '../../components/UI/Navbar.js';
import toast from "react-hot-toast";
import {getToastStyles} from "../../utils/toastUtils.js";

// Initial nodes and edges
const initialNodes = [
    { id: '1', type: "textUpdater", position: { x: 50, y: 50 }, data: { message: 'Message number 1', isSelected: false }, },
    { id: '2', type: "textUpdater", position: { x: 350, y: 150 }, data: { message: 'Message number 2', isSelected: false },  },
];
const initialEdges = [];

// Retrieve saved nodes and edges from local storage
const savedNodes = JSON.parse(window.localStorage.getItem('savedNodes'));
const savedEdges = JSON.parse(window.localStorage.getItem('savedEdges'));

// Defined custom node types
const nodeTypes = {textUpdater: CustomTextNode}

const Home = ({...props}) => {
    const [nodes, setNodes] = useState(savedNodes ? savedNodes : initialNodes);
    const [edges, setEdges] = useState(savedEdges ? savedEdges : initialEdges);
    const [pointerLocation, setPointerLocation] = useState({x: 0, y: 0});
    const [selectedNode, setSelectedNode] = useState({});

    // Effect hook to update pointer location
    useEffect(() => {
        window.addEventListener('mousemove', (e) => setPointerLocation({x: e.clientX, y: e.clientY}))

        return () => {
            window.removeEventListener('mousemove', this)
        }
    }, []);

    // Callback for handling node changes
    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );

    // Callback for handling edge changes
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    // Callback for handling new connections
    const onConnect = useCallback(
        (connection) => {
            if(connection.source !== connection.target) {
                const newEdge = {
                    ...connection,
                    markerEnd: {
                        type: MarkerType.Arrow,
                    },
                };

                setEdges((edges) => {
                    let edgeExists = [...edges].filter(edge => edge.source === connection.source)?.[0];
                    if(_.isEmpty(edgeExists)) {
                        return addEdge(newEdge, edges)
                    } else {
                        return updateEdge(edgeExists, newEdge, edges)
                    }
                });
            }
        },
        [setEdges]
    );

    // Callback for handling selection changes
    const onSelectionChange = useCallback(
        (selection) => {
            if(!_.isEmpty(selection.nodes)) {
                const newSelection = selection?.nodes[0];
                setSelectedNode(newSelection);
                setNodes((nds) => nds.map(node => {
                    if(node?.id === newSelection?.id) {
                        node.selected = true;
                        node.data = {
                            ...node.data,
                            isSelected: true
                        }
                    } else {
                        node.selected = false;
                        node.data = {
                            ...node.data,
                            isSelected: false
                        }
                    }

                    return node;
                }));
            }
        },
        [setSelectedNode, setNodes]
    );

     // Function to add new nodes
    const addNodes = (pointer) => {
            const newNode = {
                id: (nodes.length + 1).toString(),
                type: "textUpdater",
                position: {x: pointer?.x ? pointer.x -100 :100*(nodes.length + 1), y: pointer.y ? pointer.y - 100 : 100*(nodes.length + 1)},
                data: {message: `Message number ${nodes.length + 1}`, isSelected: false},
                width: 280,
                height: 90,
            }
            setNodes((nds) => [...nds, newNode]);
    }

    // Function to change nodes' data
    const changeNodes = (newNode, message) => {
        const tempNode = {...newNode}
        setNodes((nds) => nds.map(node => {
            if(node.id === tempNode.id) {
                node.data = {
                    ...node.data,
                    message: message,
                };
            }

            return node
        }));
    }

    // Handler for drag end events
    const onDragEnd = (change) => {
        if(change?.destination?.droppableId === 'droppable-1') {
            addNodes(pointerLocation);
        }
    }

    // Handler for text change in selected node
    const handleTextChange = (text) => {
        let newNode = {...selectedNode};
        newNode.data.message = text;
        setSelectedNode(newNode);
        changeNodes(newNode, text)
    }

    // Function to validate connections before saving
    const validateConnectionsForSaving = () => {
        let isValid = true;
        let message = "No connections";

        if(_.isEmpty(edges)) {
            isValid = false;
            message = "No connections"
        } else {
            let connectedEdges = getConnectedEdges(nodes, edges);
            let nodesWithAtLeastOneConnection = [];
            let nodeWithZeroConnections = [];
            connectedEdges.forEach(edge => {
                if (!nodesWithAtLeastOneConnection.includes(edge.source)) {
                    nodesWithAtLeastOneConnection.push(edge.source)
                }
                if (!nodesWithAtLeastOneConnection.includes(edge.target)) {
                    nodesWithAtLeastOneConnection.push(edge.target)
                }
            })

            nodes.forEach(node => {
                if(!nodesWithAtLeastOneConnection.includes(node.id)) {
                    nodeWithZeroConnections.push(node.id)
                }
            })

            if(nodeWithZeroConnections.length > 0) {
                isValid = false;
                message = "Not all nodes connected"
            }
        }

        return {isValid, error: message}
    }

    // Handler for saving nodes and edges
    const handleSave = () => {
        let {isValid, error} = validateConnectionsForSaving();
        if(isValid) {
            window.localStorage.setItem('savedNodes', JSON.stringify(nodes))
            window.localStorage.setItem('savedEdges', JSON.stringify(edges))
            toast('Saved Data !', {
                style: getToastStyles('success')
            })
        } else {
            toast(error ? error : "Cannot Save", {
                style: getToastStyles('error')
            })
        }
    }

    // Handler for deselecting node
    const handleBack = () => {
        setSelectedNode({});
        onSelectionChange({nodes: [{}]})
    }


    return (
            <>
                <Navbar onSave={handleSave} />
                <DragDropContext
                    onDragEnd={onDragEnd}
                >
                    <div className={'home'}>
                        <Droppable droppableId="droppable-1" type="PERSON">
                            {
                                (provided, snapshot) => {

                                    return (
                                        <div ref={provided.innerRef} className={'flow-drawer'}>
                                            <ReactFlow
                                                elementsSelectable={true}
                                                onSelectionChange={onSelectionChange}
                                                nodes={nodes}
                                                edges={edges}
                                                onNodesChange={onNodesChange}
                                                onEdgesChange={onEdgesChange}
                                                onConnect={onConnect}
                                                nodeTypes={nodeTypes}
                                            >
                                                <Controls />
                                                {/*<MiniMap />*/}
                                                <Background variant="dots" gap={12} size={1} />
                                            </ReactFlow>
                                            {provided.placeholder}
                                        </div>
                                    )
                                }
                            }
                        </Droppable>
                        {
                            _.isEmpty(selectedNode) ? (
                                <Droppable droppableId={"droppable-2"} type={"PERSON"}>
                                    {
                                        (provided, snapshot) => (
                                            <div ref={provided.innerRef}>
                                                <SideMenu position={'right'}>
                                                    <Draggable draggableId="draggable-1" index={0}>
                                                        {
                                                            (provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    {snapshot.isDragging ? <CustomTextNodeDummy data={{message: "Drop me !"}} /> : <NodeButton onClick={addNodes} style={{width: '45%'}} text={'Message'} />}
                                                                </div>
                                                            )
                                                        }
                                                    </Draggable>
                                                </SideMenu>
                                                {provided.placeholder}
                                            </div>
                                        )
                                    }
                                </Droppable>
                            ) : (
                                <SideMenu style={{padding:0, width: "27%", height: "94vh"}} position={'right'}>
                                    {selectedNode && <NodeEditor handleBack={handleBack} onChange={handleTextChange} type={'Message'} data={selectedNode.data}/>}
                                </SideMenu>
                            )
                        }
                    </div>
                </DragDropContext>
            </>
    )
}

export default Home