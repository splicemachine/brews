// noinspection NpmUsedModulesInstalled
// import Progress from "react-progressbar";
import React, {Component} from "react";
import env from "../../server/environment"
import "../styles/main.css"
import "../../node_modules/purecss/build/pure-min.css"
import "../../node_modules/purecss/build/grids-responsive-min.css"
import Output from "./Output.jsx";
import TableSelect from "./display/TableSelect.jsx";
import Insert from "./display/Insert.jsx";
import Delete from "./display/Delete.jsx";

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

        /**
         * The progress bar is more complicated now, so I will turn it off until I can componentize it.
         * @type {any}
         */
        // fetch(env.server() + "/api/v1/size", this.getInit).then((response) => {
        //     return response.json()
        // }).then((data) => {
        //     this.state.total = data;
        //     this.setState(this.state);
        // });

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
                return;
            }
            // this.state.completed++;
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
         * TODO: Export Classes
         */
        const classes = {
            transfer: `pure-u-1 pure-u-md-1-4`,
            table: `pure-u-1 pure-u-md-3-4`,
            container: `pure-g`,
            button: `button__container pure-u-1 pure-u-md-1-4`,
            output: `pure-u-1 pure-u-md-3-4`,
        };

        /**
         * TODO: Export Styles
         */
        const buttonStyle = {
            margin: "1em"
        };

        const transferOrders = {
            endpoint: `/api/v1/transfer-orders`,
            title: `Transfer Orders`,
            backgroundColor: getRandomColor(),
            parameters: [
                {
                    placeholder: "Destination Inventory",
                    type: "number",
                    value: 0,
                },
            ]
        };

        const atpOnDate = {
            endpoint: `/api/v1/atp-on-date`,
            title: `ATP On Date`,
            backgroundColor: getRandomColor(),
            parameters: [
                {
                    placeholder: "Inventory",
                    type: "number",
                    value: 0,
                },
                {
                    placeholder: "Time ATP",
                    type: "date",
                    value: "",
                },
                {
                    placeholder: "Time Horizon",
                    type: "date",
                    value: "",
                },
            ]
        };

        const trackingInventoryAsTimelines = {
            endpoint: `/api/v1/tracking-inventory-as-timelines`,
            title: `Tracking Inventory As Timelines`,
            backgroundColor: getRandomColor(),
            parameters: [
                {
                    placeholder: "Inventory",
                    type: "number",
                    value: 0,
                },
            ]
        };

        const inventoryOnDate = {
            endpoint: `/api/v1/inventory-on-date`,
            title: `Inventory on Date`,
            backgroundColor: getRandomColor(),
            parameters: [
                {
                    placeholder: "Inventory",
                    type: "number",
                    value: 0,
                },
                {
                    placeholder: "Date",
                    type: "date",
                    value: "",
                },
                {
                    placeholder: "Same Date",
                    type: "date",
                    value: "",
                },
            ]
        };

        const proposedOrder = {
            endpoint: `/api/v1/proposed-order`,
            title: `Proposed Order`,
            backgroundColor: getRandomColor(),
            parameters: []
        };
        const orderATP = {
            endpoint: `/api/v1/order-atp`,
            title: `Order ATP`,
            backgroundColor: getRandomColor(),
            parameters: []
        };
        const lineItemATP = {
            endpoint: `/api/v1/line-item-atp`,
            title: `Line Item ATP`,
            backgroundColor: getRandomColor(),
            parameters: []
        };

        const addQuickCheckLine = {
            title: `Add Quick Check Line`,
            endpoint: `/api/v1/add-quick-check-line`,
            parameters: [
                {
                    placeholder: "Item ID",
                    type: "number",
                    value: 0,
                },
                {
                    placeholder: "Quantity",
                    type: "number",
                    value: 0,
                },
            ]
        };

        const deleteTimelineDates = {
            endpoint: `/api/v1/delete-timeline-dates`,
            title: `Delete Timeline Dates`,
            backgroundColor: getRandomColor(),
            parameters: []
        };

        return (
            <div>
                <h1>Available to Promise: {waiting}</h1>

                {/*<TableSelect config={transferOrders}/>*/}
                {/*<TableSelect config={atpOnDate}/>*/}
                {/*<TableSelect config={trackingInventoryAsTimelines}/>*/}
                {/*<TableSelect config={inventoryOnDate}/>*/}
                {/*<TableSelect config={proposedOrder}/>*/}
                {/*<TableSelect config={orderATP}/>*/}
                {/*<TableSelect config={lineItemATP}/>*/}

                <Insert config={addQuickCheckLine}/>

                <Delete config={deleteTimelineDates}/>

                <div className={classes.container}>
                    <div className={classes.button}>
                        {/*<Progress completed={(completed / total) * 100}/>*/}
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

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
