import React, {Component} from "react";

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};
    }

    render() {


        return (

            <div className="header">
                <h1>Available to Promise</h1>
                <h2>A Splice Machine Use-Case</h2>
            </div>

        )
    }
}
