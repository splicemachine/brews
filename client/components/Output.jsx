import React, {Component} from "react";
import "../styles/main.css"

export default class Output extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        console.log("Output Props", this.props);
    }

    render() {
        const {className} = this.props;
        return (
            <code className={className || "fucking-nothing"}>
                {this.props.gooby}
            </code>
        )
    }
}


