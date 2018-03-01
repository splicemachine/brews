import React, {Component} from "react";

export default class Hamburger extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};
    }

    render() {

        return (

            <a href="#menu" id="menuLink" className="menu-link">
                <span/>
            </a>

        )
    }
}
