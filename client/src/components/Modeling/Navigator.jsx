import React, {Component} from "react";

/**
 * Just a button component that does the action you give it.
 */
export default class Navigator extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};

        if (this.props.home) {
            this.home = this.props.home.bind(this);
        }

        if (this.props.start) {
            this.start = this.props.start.bind(this);
        }

    }


    render() {
        return (
            <div className={"pure-u-sm-1-1 pure-u-md-1-1 pure-u-lg-1-1"}>
                <h3>Return To:</h3>
                <ConditionalButton title={"Model Selection"} fn={this.start}/>
                <ConditionalButton title={"Job Status"} fn={this.home}/>
            </div>
        )
    }
}

function ConditionalButton(props) {
    if (props.fn) {
        return (
            <button type="button"
                    className="pure-button pure-button-primary job-status"
                    onClick={props.fn}>
                {props.title}
            </button>
        )
    } else {
        return (
            <div/>
        )
    }
}
