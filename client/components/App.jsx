import React, {Component} from "react";
import env from "../../server/environment"
import "../styles/main.css"
import Progress from "react-progressbar";
import Output from "./Output.jsx";
import TransferOrders from "./parameterized-selects/TransferOrders.jsx";

export default class App extends Component {

    constructor(props) {
        super(props);
        this.generateClickHandler = this.generateClickHandler.bind(this);
        this.processText = this.processText.bind(this);
        this.transferOrders = this.transferOrders.bind(this);
        this.containerClasses = `pure-g`;
        this.buttonContainerClasses = `button__container pure-u-1 pure-u-md-1-4`;
        this.outputClasses = `pure-u-1 pure-u-md-3-4`;

        // this.waiting = "Not Waiting.";

        this.state = {
            log: [],
            waiting: "Not Waiting.",
            completed: 0,
            total: 0,
            destinationInventory: ''
        };

        this.getInit = {
            method: "GET",
            headers: new Headers(),
            mode: "cors",
            cache: "default"
        };

        this.postInit = (body) => {
            return {
                method: "POST",
                body: JSON.stringify(body),
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                mode: "cors",
                cache: "default"
            }
        };

        fetch(env.server() + "/api/v1/size", this.getInit).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data);
            this.state.total = data;
            this.setState(this.state);
        })
    }

    generateClickHandler(route) {
        if (typeof route === "string") {
            return () => {
                fetch(env.server() + route, this.getInit).then((response) => {
                    /**
                     * This is probably not needed because I bound the function correctly above now.
                     * See TransferOrders.jsx for the comment.
                     */
                    // if (response.bodyUsed) {
                    console.log("Fetch came back");
                    const reader = response.body.getReader();
                    reader.read().then(this.processText(this.state.log, reader));
                    // } else {
                    //     response.text()
                    //         .then((result) => {
                    //             this.state.log.push(result);
                    //             this.setState(this.state);
                    //         });
                    // }
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
            this.state.completed++;
            this.state.waiting = "Waiting...";
            let additionalText = String.fromCharCode.apply(null, value);
            stream.push(additionalText);
            this.setState(this.state);
            return reader.read().then(this.processText(stream, reader))
        }
    }

    /**
     * This gets called when someone clicks the button in TransferOrders
     * @param destination
     */
    transferOrders(destination) {

        fetch(env.server() + "/api/v1/transfer-orders", this.postInit({destination}))
            .then(res => res.text())
            .catch(error => console.log('Error:', error))
            .then(response => {
                this.state.log.push(response);
                this.setState(this.state);
                // console.log('Success:', response);
            });
    }

    render() {
        const buttonContainerStyle = {
            margin: "1em"
        };
        return (
            <div>
                <h1>Available to Promise: {this.state.waiting}</h1>
                <div className={this.containerClasses}>
                    <div className={this.buttonContainerClasses}>
                        <Progress completed={(this.state.completed / this.state.total) * 100}/>
                        <div style={buttonContainerStyle}>
                            <button className="button" onClick={this.generateClickHandler("/api/v1/prepare")}>
                                Prepare and Import
                            </button>
                        </div>
                        <TransferOrders destination={this.state.destinationInventory}
                                        submit={this.transferOrders}/>
                    </div>
                    <Output log={this.state.log} className={this.outputClasses}/>
                </div>
            </div>
        );
    }
}


