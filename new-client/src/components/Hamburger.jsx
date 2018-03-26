import React, {Component} from "react";

export default class Hamburger extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};

        this.render = this.render.bind(this);
    }

    render() {
        return (
            <a onClick={this.props.toggle} id="menuLink" className="menu-link">
                <span/>
            </a>
        )
    }
}
