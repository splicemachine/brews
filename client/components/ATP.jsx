import React, {Component} from "react";

export default class ATP extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            targetDate: "",
            quantity: "",
            itemNumber: "",
            formComplete: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.disable = this.disable.bind(this);
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
         */
        // this.setState({
        //     [key]: event.target.value,
        //     formComplete: !(this.state.targetDate === '' ||
        //         this.state.itemNumber === '' ||
        //         this.state.quantity === '')
        // });
    }

    handleSubmit(form, event) {
        switch(form){
            case "addLine":
                console.log(form, event);
                break;
            case "runATP":
                console.log(form, event);
                break;
            case "clearLines":
                console.log(form, event);
                break;
            default:
                console.log("I don't know what that one is.");
                break;
        }
        event.preventDefault();
    }

    disable(form){
        switch(form){
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
                    <div className={"pure-u-1 pure-u-md-1-2 pure-u-lg-1-2"}>
                        <form className="pure-form pure-form-aligned" onSubmit={this.handleSubmit.bind(this, "addLine")}>
                            <fieldset>
                                <div className="pure-control-group">
                                    <label htmlFor="quantity">Quantity</label>
                                    <input
                                        required
                                        id="quantity"
                                        type="number"
                                        placeholder="Quantity"
                                        value={this.state.quantity}
                                        onChange={this.handleChange.bind(this, "quantity")}/>
                                </div>
                                <div className="pure-control-group">
                                    <label htmlFor="itemNumber">Item Number</label>
                                    <input
                                        required
                                        id="itemNumber"
                                        type="number"
                                        placeholder="Item Number"
                                        value={this.state.itemNumber}
                                        onChange={this.handleChange.bind(this, "itemNumber")}/>
                                </div>
                                <div className="pure-controls">
                                    <button type="submit" className="pure-button pure-button-primary" disabled={this.disable("addLine")}>Add Line</button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <div className={"pure-u-1 pure-u-md-1-2 pure-u-lg-1-2"}>
                        <form className="pure-form pure-form-aligned" onSubmit={this.handleSubmit.bind(this, "runATP")}>
                            <fieldset>
                                <div className="pure-control-group">
                                    <label htmlFor="targetDate">Target Date</label>
                                    <input
                                        required
                                        id="targetDate"
                                        type="date"
                                        placeholder="Target Date"
                                        value={this.state.targetDate}
                                        onChange={this.handleChange.bind(this, "targetDate")}/>
                                </div>
                                <div className="pure-controls">
                                    <button type="submit" className="pure-button pure-button-primary" disabled={this.disable("runATP")}>Run ATP</button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <div className={"pure-u-1 pure-u-md-1-1 pure-u-lg-1-1"}>
                        <form className="pure-form pure-form-aligned" onSubmit={this.handleSubmit.bind(this, "clearLines")}>
                            <fieldset>
                                <div className="pure-controls">
                                    <button type="submit" className="pure-button pure-button-primary" disabled={this.disable("clearLines")}>Clear Lines</button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

