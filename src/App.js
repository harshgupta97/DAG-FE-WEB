import React, {Component} from 'react';
import './App.css';
import {Button, Dialog,TextField} from "@material-ui/core";
import GraphComponent from "./components/common/GraphComponent";
import graphConfig from "./config/graph";
import GraphServices from "./services/GraphServices";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nodeLabel:undefined,
            openDialog:false,
            graph: {
                "nodes": [

                ],
                "edges": [

                ]
            },
            selected: {},
            isPersisted:true
        }

        this.GraphView = React.createRef();
    }

    storeGraph = () => {
        this.state.isPersisted && localStorage.setItem('graph',JSON.stringify(this.state.graph));
    }

    onSelectNode = (viewNode) => {
        this.setState({ selected: viewNode });
    }

    onCreateNode = (x, y) => {
        this.handleNewNode(x,y);
    }

    onUpdateNode = () => {
        this.storeGraph();
    }


    onDeleteNode = (viewNode, nodeId, nodeArr) => {
        const graph = this.state.graph;
        // Delete any connected edges
        const newEdges = graph.edges.filter((edge, i) => {
            return (
                edge.source !== viewNode[graphConfig.NODE_KEY] && edge.target !== viewNode[graphConfig.NODE_KEY]
            );
        });

        graph.nodes = nodeArr;
        graph.edges = newEdges;

        this.setState({ graph, selected: null });
    }

    onSelectEdge = (viewEdge) => {
        this.setState({ selected: viewEdge });
    }

    onCreateEdge = (sourceViewNode, targetViewNode) => {
        const graph = this.state.graph;
        const viewEdge = {
            source: sourceViewNode[graphConfig.NODE_KEY],
            target: targetViewNode[graphConfig.NODE_KEY],
            type:"emptyEdge",
        };

        // Only add the edge when the source node is not the same as the target
        if (viewEdge.source !== viewEdge.target) {
            graph.edges = [...graph.edges, viewEdge];
            this.setState({
                graph,
                selected: viewEdge,
            });
        }

        this.storeGraph();
    }

    onSwapEdge = () => {

    }

    onDeleteEdge = (viewEdge, edges) => {
        const graph = this.state.graph;

        graph.edges = edges;
        this.setState({
            graph,
            selected: null,
        });
    }

    handleNodeDialog = () => {
        this.setState({
            ...this.state,
            openDialog:true
        });
    }

    handleCloseDialog = () => {
        this.setState({
            ...this.state,
            openDialog:false
        });
    }

    handleNodeLabel = (event) => {
        const newLabel = event.target.value;
        this.setState({
            ...this.state,
            nodeLabel:newLabel
        })
    }

    handleNewNode = (x, y) => {
        const {graph, nodeLabel} = this.state;


        graph.nodes = [{
            id: graph.nodes.length + 1,
            title: nodeLabel === undefined ? `Node ${graph.nodes.length + 1}` : nodeLabel,
            x: y? x : 10,
            y: y? y : 10,
            type: "empty"
        },...graph.nodes];


        this.setState({
            ...this.state,
            graph: graph,
            nodeLabel:undefined
        });

        // eslint-disable-next-line no-unused-expressions
        y === undefined ?  this.handleCloseDialog() : null;

        this.storeGraph();
    }

    handleGetAllPathFromSource = async() => {

        let graphServices = new GraphServices();
        const graph = this.prepareGraph();
        let sourceNode;
        if(this.state.selected !== null && this.state.selected.id !== undefined){
            sourceNode = this.state.selected.id
        }else{
            alert("please select a node to get all its possible paths") ;
            return;
        }
        try{

            let response = await graphServices.getAllPath(graph, sourceNode);
            this.setState({
                ...this.state,
                isPersisted:false
            })
            this.handleOutGraph(response.data);
        }catch (e){
            console.error(e)
        }


    }

    prepareGraph = () => {
        let {graph} =  this.state;
        let adjacencyList = new Map();
        graph.nodes.forEach(node => {
            adjacencyList.set(node.id, []);
            graph.edges.forEach(edge => {
                if(edge.source === node.id){
                    adjacencyList.get(node.id).push(edge.target);
                }
            })
        });

        return Object.fromEntries(adjacencyList);
    }

    handleOutGraph = (paths) => {
        let nodes = new Set();
        let edges = [];


        paths.forEach( (path, PathIndex) => {
            path.forEach((node, nodeIndex) => {
                if(path[nodeIndex+1] !== undefined)
                    edges.push([node,path[nodeIndex+1]]);
                nodes.add(node);
            })
        });

        edges = this.getUniquePath(edges);
        this.addOutNodesEdges(nodes,edges);
    }

    getUniquePath = (allPaths) => {
        var uniques = [];
        var pathFound = {};
        for(var i = 0, l = allPaths.length; i < l; i++) {
            var stringified = JSON.stringify(allPaths[i]);
            if(pathFound[stringified]) { continue; }
            uniques.push(allPaths[i]);
            pathFound[stringified] = true;
        }
        return uniques;
    }

    addOutNodesEdges = (nodes,edges) =>{
        const graphOut = {
            nodes:[],
            edges:[]
        };
        nodes.forEach(node => {
            graphOut.nodes = [
                {
                    id: node,
                    title: `Node ${node}`,
                    x: 300+ Math.floor(Math.random() * 10 * node),
                    y: 150 +Math.floor(Math.random() * 50 * node ),
                    type: "empty"
                },...graphOut.nodes
            ]
        });


        let viewEdge = null;
        edges.forEach(edge =>{
            const sourceViewNode = edge[0];
            const targetViewNode = edge[1];

            viewEdge = {
                source: sourceViewNode,
                target: targetViewNode,
                type:"emptyEdge",
            };

            if (viewEdge.source !== viewEdge.target) {
                graphOut.edges= [viewEdge,...graphOut.edges];
            }
        });


        this.setState({
                ...this.state,
                graph:graphOut
            }
        );
    }

    handleGraphRestore = () => {
        let graphState = JSON.parse(localStorage.getItem('graph'));
        this.setState({
            ...this.state,
            graph:graphState,
            isPersisted:true
        })
    }

    handleGraphClear = () => {
        const graphOut = {
            nodes:[],
            edges:[]
        };

        this.setState({
            ...this.state,
            graph:graphOut,
            isPersisted:true
        });
    }

    render() {
        const {nodes, edges } = this.state.graph;

        const { selected, openDialog, isPersisted } = this.state;

        const NodeTypes = graphConfig.GraphConfig.NodeTypes;
        const NodeSubtypes = graphConfig.GraphConfig.NodeSubtypes;
        const EdgeTypes = graphConfig.GraphConfig.EdgeTypes;
        return (
            <React.Fragment>

            <div className="container-fluid height-100">
                <div className="row height-70">
                    <div className="col-12 m-0">
                        <h2>Juntrax DAG Graph</h2>
                    </div>
                    <div className="col-12">
                        <Button className="m-2" variant="contained" onClick={this.handleNodeDialog} color="primary" disabled={!isPersisted && nodes.length }>
                            New Node
                        </Button>
                        <Button className="m-2" variant="contained" onClick={this.handleGetAllPathFromSource}
                                color="primary" disabled={!nodes.length || !isPersisted}>
                            Find All Paths
                        </Button>

                        <Button className="m-2" variant="contained" onClick={this.handleGraphRestore}
                                color="primary" disabled={ isPersisted && nodes.length }>
                            Back
                        </Button>
                        <Button className="m-2" variant="contained" onClick={this.handleGraphClear}
                                color="primary" disabled={!nodes.length}>
                            clear
                        </Button>
                    </div>
                    <div className="col-12 height-70">
                        <GraphComponent refName={el => (this.GraphView = el)} nodes={nodes} edges={edges} selected={selected}
                                        nodeTypes={NodeTypes} nodeSubtypes={NodeSubtypes} edgeTypes={EdgeTypes}
                                        onSelectNode={this.onSelectNode} onCreateNode={this.onCreateNode}
                                        onUpdateNode={this.onUpdateNode} onDeleteNode={this.onDeleteNode}
                                        onSelectEdge={this.onSelectEdge} onCreateEdge={this.onCreateEdge}
                                        onSwapEdge={this.onSwapEdge} onDeleteEdge={this.onDeleteEdge}/>
                    </div>
                </div>
            </div>
                <Dialog onClose={this.handleCloseDialog} open={openDialog}>
                    <div className="container">
                        <div className="row justify-content-center my-5">
                            <div className="col-8 d-flex justify-content-center">
                                <TextField id="outlined-basic" name="nodeLabel" onChange={this.handleNodeLabel}
                                           label="Node Name" variant="outlined" value={this.state.nodeLabel}/>
                            </div>
                            <div className="col-8 my-2  d-flex justify-content-center">
                                <Button className="mx-2" variant="outlined" color="primary" onClick={this.handleNewNode}>
                                    Confirm
                                </Button>
                                <Button className="mx-2" variant="outlined" color="secondary" onClick={this.handleCloseDialog}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </React.Fragment>
        );
    }


}

export default App;
