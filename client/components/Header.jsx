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
                <h1>Page Title</h1>
                <h2>A subtitle for your page goes here</h2>
            </div>

        )
    }
}
