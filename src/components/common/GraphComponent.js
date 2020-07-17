import React, {Component} from "react";
import GraphView from "react-digraph";
import graphConfig from "../../config/graph"

class GraphComponent extends Component {
    render() {
        return <GraphView
            ref={this.props.refName}
            nodeKey={this.props.nodeKey? this.props.nodeKey : graphConfig.NODE_KEY}
            nodes={this.props.nodes}
            edges={this.props.edges}
            selected={this.props.selected}
            nodeTypes={this.props.nodeTypes}
            nodeSubtypes={this.props.nodeSubtypes}
            edgeTypes={this.props.edgeTypes}
            onSelectNode={this.props.onSelectNode}
            onCreateNode={this.props.onCreateNode}
            onUpdateNode={this.props.onUpdateNode}
            onDeleteNode={this.props.onDeleteNode}
            onSelectEdge={this.props.onSelectEdge}
            onCreateEdge={this.props.onCreateEdge}
            onSwapEdge={this.props.onSwapEdge}
            onDeleteEdge={this.props.onDeleteEdge}
        />;
    }
}
export default GraphComponent;
