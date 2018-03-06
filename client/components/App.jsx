import "../styles/main.css"
import "../../node_modules/purecss/build/pure-min.css"
import "../../node_modules/purecss/build/grids-responsive-min.css"
import "../styles/side-menu-old-ie.css"
import "../styles/side-menu.css"
import React, {Component} from "react";
import SideMenu from "./SideMenu.jsx"
import Header from "./Header.jsx";
import Hamburger from "./Hamburger.jsx";
import Services from "./Services.jsx";
import Home from "./Home.jsx";
import ATP from "./ATP.jsx";

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sideBar: [
                {
                    title: "Home",
                    component: <Home/>,
                    active: false,
                },
                {
                    title: "Services",
                    component: <Services/>,
                    active: false
                },
                {
                    title: "ATP",
                    component: <ATP/>,
                    active: true
                }
            ],
            currentPage: {},
            sideBarActive: false,
        };

        this.state.currentPage = this.state.sideBar[2];

        this.render = this.render.bind(this);
        this.navigate = this.navigate.bind(this);
        this.hamburgerToggle = this.hamburgerToggle.bind(this);
    }

    /**
     * When navigation is triggered in the sidebar, this function is called.
     * @param item
     */
    navigate(item) {
        this.setState({currentPage: item})
    }

    /**
     * When the the media queries allow for the display of the sidebar, this is the click handler.
     * @param e React Event Proxy
     */
    hamburgerToggle(e) {
        e.preventDefault();
        this.setState({sideBarActive: !this.state.sideBarActive})
    }

    render() {
        const active = `${this.state.sideBarActive ? "active" : ""}`;
        return (
            <div id="layout" className={active}>
                <Hamburger toggle={this.hamburgerToggle}/>
                <div id="main">
                    <Header/>
                    <SideMenu config={this.state.sideBar} callback={this.navigate}/>
                    {this.state.currentPage.component}
                </div>
            </div>
        );
    }
}


