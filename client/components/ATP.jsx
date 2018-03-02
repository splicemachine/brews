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

    handleSubmit(event) {
        console.log(this.state);
        event.preventDefault();
    }

    render() {
        return (

            <div className="content">
                <h2 className="content-subhead">ATP</h2>

                <form className="pure-form pure-form-aligned" onSubmit={this.handleSubmit}>
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
                            <button type="submit" className="pure-button pure-button-primary" disabled={!this.state.formComplete}>Submit</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }
}

