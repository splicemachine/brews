import React, {Component} from "react";

export default class CompletedStatus extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};
    }


    render() {
        return (
            <button onClick={this.props.action}>COMPLETED</button>
        )
    }
}
