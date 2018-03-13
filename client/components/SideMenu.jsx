import React, {Component} from "react";
import logo from "../../static/img/splice-logo.png";

export default class SideMenu extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            config: props.config
        };

        this.navigate = props.callback;

        this.render = this.render.bind(this);
        this.selectItem = this.selectItem.bind(this);
    }

    selectItem(clicked) {
        this.state.config.forEach((item) => {
            item.active = item === clicked;
        });
        this.setState(this.state);
        this.navigate(clicked);
    }

    render() {
        return (
            <div id="menu">
                <div className="pure-menu">
                    <a className={"menu-header-link"} href="https://www.splicemachine.com/">
                        <img className={"menu-header-image"} src={logo} alt=""/>
                    </a>
                    <ul className="pure-menu-list">
                        {
                            this.state.config.map((item, index) => {
                                return (
                                    <li className={`pure-menu-item ${item.active ? "pure-menu-selected" : ""}`}
                                        key={index}>
                                        <a onClick={this.selectItem.bind(this, item)} className="pure-menu-link">
                                            {item.title}
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
