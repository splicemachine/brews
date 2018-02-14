// noinspection NpmUsedModulesInstalled
import Progress from "react-progressbar";
import React, {Component} from "react";
import env from "../../server/environment"
import "../styles/main.css"
import Output from "./Output.jsx";
import TableSelect from "./display/TableSelect.jsx";


export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            log: [],
            waiting: "Not Waiting.",
            completed: 0,
            total: 0,
        };

        this.getInit = {
            method: "GET",
            headers: new Headers(),
            mode: "cors",
            cache: "default"
        };

        fetch(env.server() + "/api/v1/size", this.getInit).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data);
            this.state.total = data;
            this.setState(this.state);
        });

        this.generateClickHandler = this.generateClickHandler.bind(this);
        this.processText = this.processText.bind(this);
        this.render = this.render.bind(this);

    }

    generateClickHandler(route) {
        if (typeof route === "string") {
            return () => {
                fetch(env.server() + route, this.getInit).then((response) => {
                    /**
                     * This is probably not needed because I bound the function correctly above now.
                     * See TransferOrders.jsx for the comment.
                     * There was an error about response.bodyUsed when I was using FF, but I forgot the context.
                     * I removed the commented if check for that.
                     */
                    console.log("Fetch came back");
                    const reader = response.body.getReader();
                    reader.read().then(this.processText(this.state.log, reader));
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



    render() {

        const {waiting, completed, total, log} = this.state;

        /**
         * CLASSES
         * TODO: Export Styles
         */
        const classes = {
            transfer: `pure-u-1 pure-u-md-1-4`,
            table: `pure-u-1 pure-u-md-3-4`,
            container: `pure-g`,
            button: `button__container pure-u-1 pure-u-md-1-4`,
            output: `pure-u-1 pure-u-md-3-4`,
        };

        /**
         * STYLES
         * TODO: Export Styles
         */
        const buttonStyle = {
            margin: "1em"
        };

        const transferOrders = {
            endpoint: `/api/v1/transfer-orders`,
            title: `Transfer Orders`,
            parameters: [
                {
                    placeholder: "Destination Inventory",
                    value: 0,
                },
            ]
        };

        return (
            <div>
                <h1>Available to Promise: {waiting}</h1>

                <TableSelect config={transferOrders}/>

                <div className={classes.container}>
                    <div className={classes.button}>
                        <Progress completed={(completed / total) * 100}/>
                        <div style={buttonStyle}>
                            <button className="button" onClick={this.generateClickHandler("/api/v1/prepare")}>
                                Prepare and Import
                            </button>
                        </div>

                    </div>
                    <Output log={log} className={classes.output}/>
                </div>
            </div>
        );
    }
}


