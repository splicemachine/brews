import React, {Component} from "react";
import env from "../../server/environment"
import "../styles/main.css"
import Progress from "react-progressbar";
import Output from "./Output.jsx";

export default class App extends Component {

    constructor(props) {
        super(props);
        this.generateClickHandler = this.generateClickHandler.bind(this);
        this.containerClasses = `pure-g`;
        this.buttonContainerClasses = `button__container pure-u-1 pure-u-md-1-4`;
        this.outputClasses = `pure-u-1 pure-u-md-3-4`;
        // this.waiting = "Not Waiting.";

        this.state = {
            log: [],
            waiting: "Not Waiting."
        };

        this.getInit = {
            method: "GET",
            headers: new Headers(),
            mode: "cors",
            cache: "default"
        };
    }

    generateClickHandler(route){
        if(typeof route === "string"){
            return ()=>{
                fetch(env.server() + route, this.getInit).then((response) => {
                    console.log("Fetch came back");
                    const reader = response.body.getReader();
                    reader.read().then(this.processText(this.state.log, reader))
                });
            }
        }
    }

    processText(stream, reader) {
        return ({done, value}) => {
            if (done) {
                this.state.waiting = "Not Waiting.";
                this.setState(this.state);
                console.log("Stream complete");
                return;
            }
            this.state.waiting = "Waiting...";
            let additionalText = String.fromCharCode.apply(null, value);
            stream.push(additionalText);
            this.setState(this.state);
            return reader.read().then(this.processText(stream, reader))
        }
    }

    render() {
        return (
            <div>
                <h1>Available to Promise: {this.state.waiting}</h1>
                <div className={this.containerClasses}>
                    <div className={this.buttonContainerClasses}>
                        <Progress completed={1}/>
                        <button className="button" onClick={this.generateClickHandler("/api/v1/prepare")}>Prepare Tables and Import Data</button>
                        <button className="button" onClick={this.generateClickHandler("/api/v1/get-thingy")}>Get Thingy</button>
                    </div>
                    <Output log={this.state.log} className={this.outputClasses}/>
                </div>
            </div>
        );
    }
}


