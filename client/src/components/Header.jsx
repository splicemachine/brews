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
                <h1>{this.props.config.longTitle}</h1>
                <h2>{this.props.config.subTitle}</h2>
            </div>

        )
    }
}
