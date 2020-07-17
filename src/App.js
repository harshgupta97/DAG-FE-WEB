import React, {Component} from 'react';
import './App.css';
import {Button, Dialog,TextField} from "@material-ui/core";
import GraphComponent from "./components/common/GraphComponent";
import graphConfig from "./config/graph";

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
        }

        this.GraphView = React.createRef();
    }

    onSelectNode = (viewNode) => {
        this.setState({ selected: viewNode });
    }

    onCreateNode = (x, y) => {
        this.handleNewNode(x,y);
    }

    onUpdateNode = () => {
    }


    onDeleteNode = () => {
    }

    onSelectEdge = (viewEdge) => {

    }

    onCreateEdge = (sourceViewNode, targetViewNode) => {

    }

    onSwapEdge = () => {

    }

    onDeleteEdge = () => {

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

    handleNewNode = (x, y) => {
        const graph = this.state.graph;

        graph.nodes = [{
            id: graph.nodes.length + 1,
            title: `Node ${graph.nodes.length + 1}`,
            x: x? x : 10,
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
    }

    render() {
        const {nodes, edges } = this.state.graph;

        const { selected, openDialog } = this.state;

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
                        <Button className="m-2" variant="contained"  color="primary"  onClick={this.handleNodeDialog} >
                            New Node
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
