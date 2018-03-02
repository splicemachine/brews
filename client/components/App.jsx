import React, {Component} from "react";
import "../styles/main.css"
import "../../node_modules/purecss/build/pure-min.css"
import "../../node_modules/purecss/build/grids-responsive-min.css"

import "../styles/side-menu-old-ie.css"
import "../styles/side-menu.css"

// import env from "../../server/environment"
// import Output from "./Output.jsx";
// import TableSelect from "./display/TableSelect.jsx";
// import Insert from "./display/Insert.jsx";
// import Delete from "./display/Delete.jsx";

import SideMenu from "./SideMenu.jsx"
import Header from "./Header.jsx";
import Hamburger from "./Hamburger.jsx";
import Services from "./Services.jsx";
import Home from "./Home.jsx";

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sideBar: [
                {
                    title: "Home",
                    component: <Home/>,
                    active: true,
                },
                {
                    title: "Services",
                    component: <Services/>,
                    active: false
                }
            ],
            currentPage: {}
        };

        this.state.currentPage = this.state.sideBar[0];

        this.render = this.render.bind(this);
        this.navigate = this.navigate.bind(this);
    }

    navigate(item) {
        this.setState({currentPage: item})
    }

    render() {
        return (
            <div id="layout">
                <Hamburger/>
                <div id="main">
                    <Header/>
                    <SideMenu config={this.state.sideBar} callback={this.navigate}/>
                    {this.state.currentPage.component}
                </div>
            </div>
        );
    }
}


