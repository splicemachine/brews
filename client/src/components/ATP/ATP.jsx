// noinspection NpmUsedModulesInstalled
import ReactTable from "react-table";
import "react-table/react-table.css";
import "../../../node_modules/purecss/build/pure-min.css"
import "../../../node_modules/purecss/build/grids-responsive-min.css"
import "../../styles/side-menu.scss"
import React, {Component} from "react";

function server() {
    return process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
}

export default class ATP extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            targetDate: "",
            quantity: "",
            itemNumber: "",
            formComplete: false,
            results: [
                {
                    key: `proposedOrder`,
                    title: `Proposed Order`,
                    endpoint: `/api/v1/atp/proposed-order`,
                    data: [],
                    columns: [{Header: "No Data"}],
                },
                {
                    key: `orderATP`,
                    title: `Order ATP`,
                    endpoint: `/api/v1/atp/order-atp`,
                    data: [],
                    columns: [{Header: "No Data"}],
                },
                {
                    key: `lineItemATP`,
                    title: `Line Item ATP`,
                    endpoint: `/api/v1/atp/line-item-atp`,
                    data: [],
                    columns: [{Header: "No Data"}],
                },
            ]
        };

        /**
         * This is a helper function to format JSON for use with the Fetch API
         * @param body
         * @returns RequestInit
         */
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

        /**
         * Bind everything you need to the constructor context.
         */
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.disable = this.disable.bind(this);
        this.displayResults = this.displayResults.bind(this);
        this.getResults = this.getResults.bind(this);
        this.exceptionHandler = this.exceptionHandler.bind(this);
    }

    componentWillMount() {
        this.getResults("clearLines");
    }

    /**
     * React requires that changes be handled within the framework.
     * Also a very convenient place to handle form validations.
     * @param key
     * @param event
     */
    handleChange(key, event) {
        this.state[key] = event.target.value;
        this.state.formComplete = !(this.state.targetDate === '' ||
            this.state.itemNumber === '' ||
            this.state.quantity === '');
        this.setState(this.state);
        /**
         * If you do it this way, you are sending a request to React to update state for you.
         * This is fine most of the time except in this case where I need to also set formComplete
         * based on the value of state.
         *
         * Here, I will set state explicitly, and then tell React that it can have my new object.
         *
         this.setState({
            [key]: event.target.value,
            formComplete: !(this.state.targetDate === '' ||
                this.state.itemNumber === '' ||
                this.state.quantity === '')
        });
         */
    }

    /**
     * Triggered on button clicks.
     * @param form
     * @param event
     */
    handleSubmit(form, event) {
        let payload = {};

        const endpoints = {
            addLine: `/api/v1/atp/add-line`,
            runATP: `/api/v1/atp/run-atp`,
            clearLines: `/api/v1/atp/clear-lines`,
        };

        /**
         * Construct the payload.
         */
        switch (form) {
            case "addLine":
                payload.quantity = this.state.quantity;
                payload.itemNumber = this.state.itemNumber;
                break;
            case "runATP":
                payload.targetDate = this.state.targetDate;
                break;
            case "clearLines":
                break;
            default:
                console.log("I don't know what that one is.");
                break;
        }

        /**
         * Run the functions to do the inserts.
         */
        fetch(server() + endpoints[form], this.postInit(payload))
            .then((response) => {
                return response.json()
            })
            .then(this.getResults.bind(this, form))
            .catch(this.exceptionHandler);

        event.preventDefault();
    }

    /**
     * Used to refresh our table views.
     * @param target
     * @param result
     */
    displayResults(target, result) {
        let block = this.state.results.find(item => item.key === target);
        if (result && result[0]) {
            block.columns = Object.keys(result[0]).map((item) => ({Header: item, accessor: item}));
            block.data = result;
        } else {
            block.columns = [{Header: "No Data"}];
            block.data = [];
        }
        // noinspection JSCheckFunctionSignatures
        this.setState(this.state.results);
    }

    /**
     * Collect all the API calls and map them to table display refreshing.
     * @param form
     */
    getResults(form) {
        /**
         * Run the functions we want to do after button actions.
         */
        switch (form) {
            case "addLine":
                fetch(server() + `/api/v1/atp/proposed-order`, this.postInit({}))
                    .then((response) => {
                        return response.json()
                    })
                    .then(this.displayResults.bind(this, "proposedOrder"))
                    .catch(this.exceptionHandler);
                break;
            case "runATP":
                fetch(server() + `/api/v1/atp/order-atp`, this.postInit({}))
                    .then((response) => {
                        return response.json()
                    })
                    .then(this.displayResults.bind(this, "orderATP"))
                    .catch(this.exceptionHandler);
                fetch(server() + `/api/v1/atp/line-item-atp`, this.postInit({}))
                    .then((response) => {
                        return response.json()
                    })
                    .then(this.displayResults.bind(this, "lineItemATP"))
                    .catch(this.exceptionHandler);
                break;
            case "clearLines":
                fetch(server() + `/api/v1/atp/clear-lines`, this.postInit({}))
                    .then((response) => {
                        return response.json()
                    })
                    .catch(this.exceptionHandler);
                fetch(server() + `/api/v1/atp/order-atp`, this.postInit({}))
                    .then((response) => {
                        return response.json()
                    })
                    .then(this.displayResults.bind(this, "orderATP"))
                    .catch(this.exceptionHandler);
                fetch(server() + `/api/v1/atp/line-item-atp`, this.postInit({}))
                    .then((response) => {
                        return response.json()
                    })
                    .then(this.displayResults.bind(this, "lineItemATP"))
                    .catch(this.exceptionHandler);
                fetch(server() + `/api/v1/atp/proposed-order`, this.postInit({}))
                    .then((response) => {
                        return response.json()
                    })
                    .then(this.displayResults.bind(this, "proposedOrder"))
                    .catch(this.exceptionHandler);

                break;
            default:
                console.log("I don't know what that one is.");
                break;
        }
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Catches exceptions.
     * @param exception
     */
    exceptionHandler(exception) {
        if (exception instanceof TypeError) {
            console.log("I think the server isn't hooked up.");
            return;
        }

        console.error(exception);
    }

    /**
     * Validation helper.
     * @param form
     * @returns {boolean}
     */
    disable(form) {
        switch (form) {
            case "addLine":
                return this.state.quantity === "" || this.state.itemNumber === "";
            case "runATP":
                return this.state.targetDate === "";
            case "clearLines":
                return false;
            default:
                return true;
        }
    }

    render() {
        // noinspection HtmlUnknownAttribute
        return (
            <div className="content">
                <h2 className="content-subhead">ATP</h2>
                <div className="pure-g">
                    <div className={"pure-u-sm-1-1 pure-u-md-1-3 pure-u-lg-1-3"}>
                        <form className="pure-form pure-form-aligned"
                              onSubmit={this.handleSubmit.bind(this, "addLine")}>
                            <fieldset>
                                <div className="pure-control-group">
                                    <label htmlFor="quantity">
                                        <input
                                            required
                                            id="quantity"
                                            type="number"
                                            placeholder="Quantity"
                                            value={this.state.quantity}
                                            onChange={this.handleChange.bind(this, "quantity")}/>
                                    </label>
                                </div>
                                <div className="pure-control-group">
                                    <label htmlFor="itemNumber">
                                        <input
                                            required
                                            id="itemNumber"
                                            type="number"
                                            placeholder="Item Number"
                                            value={this.state.itemNumber}
                                            onChange={this.handleChange.bind(this, "itemNumber")}/>
                                    </label>
                                </div>
                                <div className="">
                                    <button type="submit" className="pure-button pure-button-primary"
                                            disabled={this.disable("addLine")}>Add Line
                                    </button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <div className={"pure-u-sm-1-1 pure-u-md-1-3 pure-u-lg-1-3"}>
                        <form className="pure-form pure-form-aligned"
                              onSubmit={this.handleSubmit.bind(this, "runATP")}>
                            <fieldset>
                                <div className="pure-control-group">
                                    <label htmlFor="targetDate">
                                        <input
                                            required
                                            id="targetDate"
                                            type="date"
                                            placeholder="Target Date"
                                            value={this.state.targetDate}
                                            onChange={this.handleChange.bind(this, "targetDate")}/>
                                    </label>
                                </div>
                                <div className="">
                                    <button type="submit" className="pure-button pure-button-primary"
                                            disabled={this.disable("runATP")}>Run ATP
                                    </button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <div className={"pure-u-sm-1-1 pure-u-md-1-3 pure-u-lg-1-3"}>
                        <form className="pure-form pure-form-aligned"
                              onSubmit={this.handleSubmit.bind(this, "clearLines")}>
                            <fieldset>
                                <div className="">
                                    <button type="submit" className="pure-button pure-button-primary"
                                            disabled={this.disable("clearLines")}>Clear Lines
                                    </button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <div className={"pure-u-sm-1-1 pure-u-md-1-1 pure-u-lg-1-1"}>
                        {
                            this.state.results.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <h3>{item.title}</h3>
                                        <ReactTable
                                            columns={item.columns}
                                            data={item.data}
                                            noDataText="No Data Yet!"
                                            defaultPageSize={5}/>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

