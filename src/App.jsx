import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  Background,
  useEdgesState,
} from "reactflow";
import { v4 } from "uuid";

import "reactflow/dist/base.css";

import Sidebar from "./components/SideBar/SideBar";
import CustomNode from "./components/CutomNode/CustomNode";
import MessageNode from "./components/MessageNode/MessageNode";
import Navbar from "./components/Navbar/Navbar";

import "./App.css";

const REACT_FLOW_STORAGE_KEY = "react-flow-storage-key";

const initialNodes = [
  {
    id: v4(),
    type: "textnode",
    data: { label: "text message 1" },
    position: { x: 250, y: 5 },
  },
];

const nodeTypes = {
  textnode: CustomNode,
};

const App = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);
  const [nodeName, setNodeName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (selectedElements.length > 0) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedElements[0]?.id) {
            node.data = {
              ...node.data,
              label: nodeName,
            };
          }
          return node;
        })
      );
    } else {
      setNodeName("");
    }
  }, [nodeName, selectedElements, setNodes]);

  useEffect(() => {
    const savedFlow = localStorage.getItem(REACT_FLOW_STORAGE_KEY);
    if (savedFlow) {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedFlow);
      setNodes(savedNodes);
      setEdges(savedEdges);
    }
  }, [setEdges, setNodes]);

  const onNodeClick = useCallback(
    (event, node) => {
      setSelectedElements([node]);
      setNodeName(node.data.label);
      setNodes((nodes) =>
        nodes.map((n) => ({
          ...n,
          selected: n.id === node.id,
        }))
      );
    },
    [setNodes]
  );

  const checkEmptyTargetHandles = useCallback(() => {
    let emptyTargetHandles = 0;
    edges.forEach((edge) => {
      if (!edge.targetHandle) {
        emptyTargetHandles++;
      }
    });
    return emptyTargetHandles;
  }, [edges]);

  const isNodeUnconnected = useCallback(() => {
    let unconnectedNodes = nodes.filter(
      (node) =>
        !edges.find(
          (edge) => edge.source === node.id || edge.target === node.id
        )
    );

    return unconnectedNodes.length > 0;
  }, [nodes, edges]);

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const emptyTargetHandles = checkEmptyTargetHandles();

      if (nodes.length > 1 && (emptyTargetHandles > 1 || isNodeUnconnected())) {
        setErrorMessage(
          "More than one node has an empty target handle or there are unconnected nodes."
        );
        setTimeout(() => setErrorMessage(""), 5000); // hide msg after 5 sec
      } else {
        const flow = reactFlowInstance.toObject();
        localStorage.setItem(REACT_FLOW_STORAGE_KEY, JSON.stringify(flow)); // saving flow state to localstorage
        setSuccessMessage("Flow Saved Successfully");
        setTimeout(() => setSuccessMessage(""), 5000);
      }
    }
  }, [reactFlowInstance, nodes, isNodeUnconnected, checkEmptyTargetHandles]);

  const onConnect = useCallback(
    (params) => {
      console.log("Edge created: ", params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: v4(),
        type,
        position,
        data: { label: `${type}` },
      };

      console.log("Node created: ", newNode);
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const rfStyle = {
    backgroundColor: "#ffffff",
  };

  return (
    <div className="container">
      <Navbar onSave={onSave} />
      <div className="App">
        <div className="flow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            style={rfStyle}
            onNodeClick={onNodeClick}
            onPaneClick={() => {
              setSelectedElements([]);
              setNodes((nodes) =>
                nodes.map((n) => ({
                  ...n,
                  selected: false,
                }))
              );
            }}
            fitView
          >
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
        {errorMessage.length && (
          <div className="error-message">{errorMessage}</div>
        )}

        {successMessage.length && (
          <div className="success-message">{successMessage}</div>
        )}

        <div className="draggable-box">
          <MessageNode />
        </div>

        <Sidebar
          nodeName={nodeName}
          setNodeName={setNodeName}
          selectedNode={selectedElements[0]}
          setSelectedElements={setSelectedElements}
        />
      </div>
    </div>
  );
};

App.propTypes = {
  nodeName: PropTypes.string,
  setNodeName: PropTypes.func,
  selectedNode: PropTypes.object,
  setSelectedElements: PropTypes.func,
};

function FlowWithProvider() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}

export default FlowWithProvider;
