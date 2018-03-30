import React, {Component} from "react";

/**
 * Just a button component that does the action you give it.
 */
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
