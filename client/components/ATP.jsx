import React, {Component} from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import env from "../../server/environment";

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
                    endpoint: `/api/v1/proposed-order`,
                    data: [],
                    columns: [{Header: "No Data"}],
                },
                {
                    key: `orderATP`,
                    title: `Order ATP`,
                    endpoint: `/api/v1/order-atp`,
                    data: [],
                    columns: [{Header: "No Data"}],
                },
                {
                    key: `lineItemATP`,
                    title: `Line Item ATP`,
                    endpoint: `/api/v1/line-item-atp`,
                    data: [],
                    columns: [{Header: "No Data"}],
                },
            ]
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

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.disable = this.disable.bind(this);
        this.displayResults = this.displayResults.bind(this);
        this.getResults = this.getResults.bind(this);
    }

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

    handleSubmit(form, event) {
        let payload = {};

        const endpoints = {
            addLine: `/api/v1/add-line`,
            runATP: `/api/v1/run-atp`,
            clearLines: `/api/v1/clear-lines`,
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
        fetch(env.server() + endpoints[form], this.postInit(payload)).then((response) => {
            return response.json()
        })
            .then(this.getResults.bind(this, form))
            .catch((e) => {
                console.error(e)
            });

        event.preventDefault();
    }

    displayResults(target, result){
        let block = this.state.results.find(item => item.key === target);
        if (result[0]) {
            block.columns = Object.keys(result[0]).map((item) => ({Header: item, accessor: item}));
        }
        block.data = result;
        this.setState(this.state.results);
        console.log(result)
    }

    getResults(form){
        /**
         * Run the functions we want to do after button actions.
         */
        switch (form) {
            case "addLine":
                //7505 :: Proposed Order
                fetch(env.server() + `/api/v1/proposed-order`, this.postInit({})).then((response) => {
                    return response.json()
                })
                    .then(this.displayResults.bind(this, "proposedOrder"))
                    .catch((e) => {
                        console.error(e)
                    });
                break;
            case "runATP":
                //1794 :: Order ATP
                fetch(env.server() + `/api/v1/order-atp`, this.postInit({})).then((response) => {
                    return response.json()
                })
                    .then(this.displayResults.bind(this, "orderATP"))
                    .catch((e) => {
                        console.error(e)
                    });
                //7691 :: Line Item ATP
                fetch(env.server() + `/api/v1/line-item-atp`, this.postInit({})).then((response) => {
                    return response.json()
                })
                    .then(this.displayResults.bind(this, "lineItemATP"))
                    .catch((e) => {
                        console.error(e)
                    });
                break;
            case "clearLines":
                break;
            default:
                console.log("I don't know what that one is.");
                break;
        }
    }

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
        return (
            <div className="content">
                <h2 className="content-subhead">ATP</h2>
                <div className="pure-g">
                    <div className={"pure-u-1 pure-u-md-1-3 pure-u-lg-1-3"}>
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
                    <div className={"pure-u-1 pure-u-md-1-3 pure-u-lg-1-3"}>
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
                    <div className={"pure-u-1 pure-u-md-1-3 pure-u-lg-1-3"}>
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
                    <div className={"pure-u-1 pure-u-md-1-1 pure-u-lg-1-1"}>
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

