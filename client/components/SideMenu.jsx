import React, {Component} from "react";

export default class SideMenu extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};
    }

    render() {

        const active = {
            services: false,
            home: true,
        };

        const services = `pure-menu-item ${active.services? "pure-menu-selected" : ""}`;
        const home = `pure-menu-item ${active.home? "pure-menu-selected" : ""}`;

        return (
            <div id="menu">
                <div className="pure-menu">
                    <a className={"menu-header-link"} href="https://www.splicemachine.com/">
                        <img className={"menu-header-image"} src="../../static/img/splice-logo.png" alt=""/>
                    </a>
                    <ul className="pure-menu-list">
                        <li className={home}>
                            <a href="#" className="pure-menu-link">Home</a>
                        </li>
                        <li className={services}>
                            <a href="#" className="pure-menu-link">Services</a>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
