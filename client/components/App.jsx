import React, {Component} from "react";
import env from "../../server/environment"
import "../styles/main.css"
import Progress from "react-progressbar";
import Output from "./Output.jsx";

export default class App extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.containerClasses = ``;
        this.buttonContainerClasses = `button__container pure-u-1 pure-u-lg-1-2`;
        // this.progressBarClasses = `pure-u-1 pure-u-lg-1-4`;
        this.outputClasses = `pure-u-1 pure-u-lg-1-2`;
    }

    handleClick() {

        let store = document.createElement("p");
        document.querySelector("body").appendChild(store);
        let myHeaders = new Headers();
        let myInit = {
            method: "GET",
            headers: myHeaders,
            mode: "cors",
            cache: "default"
        };

        fetch(env.server() + "/api/v1/atp", myInit).then((response) => {
            console.log("Fetch came back");
            const reader = response.body.getReader();
            reader.read().then(function processText({done, value}) {
                if (done) {
                    console.log("Stream complete");
                    return;
                }
                store.innerHTML += String.fromCharCode.apply(null, value).split("\n").filter((item) => item.length > 0).join("<br>") + ("<br>");
                return reader.read().then(processText);
            });
        });
    }

    render() {
        return (
            <div>
                <h1>Available to Promise</h1>
                <div className={this.containerClasses}>
                    <div className={this.buttonContainerClasses}>
                        <Progress completed={1}/>
                        <button className="button" onClick={this.handleClick}>Click Me</button>
                    </div>
                    <Output gooby="nothing" className={this.outputClasses}/>
                </div>
            </div>
        );
    }
}


