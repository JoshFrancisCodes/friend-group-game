import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import { Network } from 'vis-network';

const App = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [weights, setWeights] = useState({});
    const [selectedNode, setSelectedNode] = useState(null);
    const [strength, setStrength] = useState(null);
    const [nodeNames, setNodeNames] = useState({});
    const networkRef = useRef(null);
    const [networkOptions, setNetworkOptions] = useState({});

    document.title = "Friend Group Strength";

    useEffect(() => {
        // Create an empty network
        const container = document.getElementById('network-container');
        const options = {
            layout: {
            improvedLayout: true,
            },
            physics: {
            forceAtlas2Based: {
                gravitationalConstant: -26,
                centralGravity: 0.005,
                springLength: 230,
                springConstant: 0.18,
                damping: 0.4,
                avoidOverlap: 0.6,
            },
            maxVelocity: 146,
            minVelocity: 0.75,
            solver: 'forceAtlas2Based',
            timestep: 0.35,
            stabilization: {
                enabled: true,
                iterations: 200,
                updateInterval: 25,
            },
        },
        edges: {
            arrows: {
              to: {
                enabled: true,
              },
            },
            color: {
              color: "#848484",
              highlight: "#848484",
              hover: "#848484",
              inherit: false,
            },
        },
        };
        setNetworkOptions(options);
        networkRef.current = new Network(container, { nodes: [], edges: [] }, options);
    }, []);

    useEffect(() => {
        // Update the network data whenever nodes or edges change
        const nodesData = nodes.map((node) => ({ id: node, label: nodeNames[node] || node }));
        const edgesData = edges.flatMap((edge, index) => {
        const [source, target] = edge.split('-');
        const weight = weights[source]?.[target]?.toString() || '';
        //   const reversedEdge = `${target}-${source}-${index}`;
        //   const reversedWeight = weights[target]?.[source]?.toString() || '';
        return [
            { id: `${edge}-${index}`, from: source, to: target, label: weight },
            // { id: reversedEdge, from: target, to: source, label: reversedWeight },
        ];
        });
        networkRef.current.setData({ nodes: nodesData, edges: edgesData });
    }, [nodes, edges, nodeNames, weights]);
  
  

    const handleAddNode = () => {
        const nodeId = `node${nodes.length + 1}`;
        setNodes([...nodes, nodeId]);
        setWeights({ ...weights, [nodeId]: {} });
    };

    const handleRemoveEdge = (edge) => {
        const updatedEdges = edges.filter((e) => e !== edge);
        const [source, target] = edge.split('-');
        const updatedWeights = { ...weights };
        delete updatedWeights[source][target];
        setEdges(updatedEdges);
        setWeights(updatedWeights);
    };

    const handleNodeClick = (node) => {
        if (selectedNode === node) {
        setSelectedNode(null);
        } else if (selectedNode) {
        const source = selectedNode;
        const target = node;
        const edgeId = `${source}-${target}`;
        setEdges([...edges, edgeId]);
        setWeights({ ...weights, [source]: { ...weights[source], [target]: 0 } });
        setSelectedNode(null);
        } else {
        setSelectedNode(node);
        }
    };

    const handleWeightChange = (source, target, weight) => {
        setWeights({ ...weights, [source]: { ...weights[source], [target]: weight } });
    };

    const handleNameChange = (nodeId, newName) => {
        setNodeNames({ ...nodeNames, [nodeId]: newName });
    };

    const handleCalculateStrength = () => {
        if (nodes.length === 0) {
            // No nodes in the graph
            setStrength(null);
            return;
          }
        
          let maxFlow = 0;
          let maxFlowSource = null;
          let maxFlowSink = null;
          let minCutEdges = [];
        
          // Convert the directed graph to an undirected graph
          const adjacencyList = nodes.reduce((list, node) => {
            list[node] = [];
            return list;
          }, {});
        
          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const nodeA = nodes[i];
              const nodeB = nodes[j];
              const weightAtoB = weights[nodeA]?.[nodeB] || 0;
              const weightBtoA = weights[nodeB]?.[nodeA] || 0;
              const undirectedWeight = weightAtoB + weightBtoA;
        
              adjacencyList[nodeA].push({ node: nodeB, weight: undirectedWeight });
              adjacencyList[nodeB].push({ node: nodeA, weight: undirectedWeight });
            }
          }
      
        // Iterate over all possible combinations of source and sink vertices
        for (let i = 0; i < nodes.length; i++) {
          const source = nodes[i];
      
          for (let j = i + 1; j < nodes.length; j++) {
            const sink = nodes[j];
      
            // Build the adjacency matrix based on the weights
            const adjacencyList = {};
            nodes.forEach((node) => {
                adjacencyList[node] = {};
              nodes.forEach((otherNode) => {
                if (weights[node]?.[otherNode]) {
                    adjacencyList[node][otherNode] = Number(weights[node][otherNode]);
                } else {
                    adjacencyList[node][otherNode] = 0;
                }
              });
            });
      
            // Implement the Edmonds-Karp algorithm to calculate max flow
            const residualGraph = JSON.parse(JSON.stringify(adjacencyList));
            const parent = {};
            let currentMaxFlow = 0;
      
            while (bfs(residualGraph, source, sink, parent)) {
              let pathFlow = Infinity;
              let v = sink;
              while (v !== source) {
                const u = parent[v];
                pathFlow = Math.min(pathFlow, residualGraph[u][v]);
                v = u;
              }
      
              v = sink;
              while (v !== source) {
                const u = parent[v];
                residualGraph[u][v] -= pathFlow;
                residualGraph[v][u] += pathFlow;
                v = u;
              }
      
              currentMaxFlow += pathFlow;
            }
      
            if (currentMaxFlow > maxFlow) {
              maxFlow = currentMaxFlow;
              maxFlowSource = source;
              maxFlowSink = sink;
      
              // Calculate the min-cut based on the residual graph
              const minCut = [];
              nodes.forEach((node) => {
                if (bfs(residualGraph, source, node, parent)) {
                  minCut.push(node);
                }
              });
      
              // Collect the edges that cross the min-cut
              const cutEdges = edges.filter((edge) => {
                const [sourceNode, targetNode] = edge.split('-');
                return (
                  minCut.includes(sourceNode) && !minCut.includes(targetNode)
                );
              });
      
              minCutEdges = minCutEdges.concat(cutEdges);
            }
          }
        }
      
        setStrength(maxFlow);
        console.log(`Maximum max-flow: ${maxFlow} (Source: ${maxFlowSource}, Sink: ${maxFlowSink})`);
      
        // Set the min-cut edges to be highlighted
        const highlightedEdges = [];
  minCutEdges.forEach((edge) => {
    const [sourceNode, targetNode] = edge.split('-');

    // Check if the directed edges exist in the original graph before adding them
    if (weights[sourceNode]?.[targetNode]) {
      highlightedEdges.push(`${sourceNode}-${targetNode}`);
    }
    if (weights[targetNode]?.[sourceNode]) {
      highlightedEdges.push(`${targetNode}-${sourceNode}`);
    }
  });

  setHighlightedEdges(highlightedEdges);
        console.log('Min-cut edges:', minCutEdges);
      };
      
      // Helper function to perform breadth-first search (BFS)
      const bfs = (graph, source, target, parent) => {
        const visited = {};
        const queue = [];
        queue.push(source);
        visited[source] = true;
        parent[source] = -1;
      
        while (queue.length > 0) {
          const currentNode = queue.shift();
      
          for (const nextNode in graph[currentNode]) {
            if (graph[currentNode][nextNode] > 0 && !visited[nextNode]) {
              queue.push(nextNode);
              visited[nextNode] = true;
              parent[nextNode] = currentNode;
            }
          }
        }
      
        return visited[target] === true;
      };

      const setHighlightedEdges = (edges) => {
        // Create a Set for faster lookup
        const highlightedEdgeIds = new Set(edges);
      
        // Get the current nodes and edges from the network
        const nodesData = networkRef.current.body.data.nodes;
        const edgesData = networkRef.current.body.data.edges;
        console.log(edgesData);
      
        // Update the color of the edges in the edgesData DataSet
        edgesData.forEach((edge) => {
            console.log(edge);
          if (highlightedEdgeIds.has(edge.id.substr(0, edge.id.lastIndexOf('-')))) {
            edgesData.update({ id: edge.id, color: { color: 'red' } });
          } else {
            edgesData.update({ id: edge.id, color: { color: '#848484' } });
          }
        });
      
        // Refresh the network to reflect the changes
        networkRef.current.redraw();
      };
      
      
      
      
      

    return (
        <div>
        <h1>Friend Group Strength Calculator</h1>
        <div className="canvas">
            <div className="nodes">
            {nodes.map((node) => (
                <div
                className={`node ${selectedNode === node ? 'selected' : ''}`}
                key={node}
                onClick={() => handleNodeClick(node)}
                >
                <input
                    type="text"
                    value={nodeNames[node] || ''}
                    onChange={(e) => handleNameChange(node, e.target.value)}
                    placeholder="Enter name"
                />
                </div>
            ))}
            </div>
            <div className="edges">
            {edges.map((edge) => {
                const [source, target] = edge.split('-');
                const weight = weights[source][target];
                return (
                <div className="edge" key={edge}>
                    <span>
                    {nodeNames[source] || source} -&gt; {nodeNames[target] || target}
                    </span>
                    <input
                    type="number"
                    min={0}
                    max={10}
                    value={weight}
                    onChange={(e) => handleWeightChange(source, target, e.target.value)}
                    />
                    <button onClick={() => handleRemoveEdge(edge)}>Remove</button>
                </div>
                );
            })}
            </div>
        </div>
        <div>
            <button onClick={handleAddNode}>Add Node</button>
            {nodes.length === 0 && <p>No nodes added</p>}
            {nodes.length > 0 && <p>Click on two nodes to add an edge. Click the same node twice to deselect.</p>}
            {nodes.map((node) => (
            <div
                key={node}
                className={`node-label ${selectedNode === node ? 'selected' : ''}`}
                onClick={() => handleNodeClick(node)}
                style={{ cursor: 'pointer' }}
            >
                {nodeNames[node] || node}
            </div>
            ))}
        </div>
        <div id="network-container" style={{ height: '400px', backgroundColor: "#F2F2F2" }}></div>
        <div>
            <button disabled={edges.length === 0} onClick={handleCalculateStrength}>
            Calculate Strength
            </button>
            {strength !== null && <p>Group Strength: {strength}/{(nodes.length - 1) * 10} = {(100 * strength / ((nodes.length - 1) * 10)).toFixed(2)}%</p>}
            <p>Red edges are the edges holding the group together. If they fall apart, the group falls apart.</p>
        </div>
        </div>
    );
};

export default App;

