import React, {Component} from "react";
import "../../styles/main.css"

export default class TransferOrders extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            destination: this.props.destination
        };

        /**
         * These are important for when HTML actions are triggered based on function calls.
         * That makes sense because they won't be bound to anything at the time of calling
         * without and explicit reference.
         */
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.headingStyle = {
            margin: "1em"
        };
        this.formStyle = {
            margin: "0em 1em 1em 1em"
        };
    }

    handleChange(event) {
        console.log("Handle Change Event", event);
        this.state.destination = event.target.value;
        this.setState(this.state);
    }

    handleSubmit(event) {
        this.props.submit(this.state.destination);
        event.preventDefault();
    }

    render() {
        const {className} = this.props;
        const containerStyle = {
            backgroundColor: "#ffaa00",
            height: "auto",
            overflowY: "auto",
        };

        return (

            <div className={className || "fucking-nothing"} style={containerStyle} id={"TRANSFER_ORDERS"}>
                <a href="https://splicemachine.atlassian.net/browse/DBAAS-1314">
                    <h3 style={this.headingStyle}>Transfer Orders</h3>
                </a>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <input style={this.formStyle} type="text" placeholder="Destination Inventory"
                               value={this.state.destination} onChange={this.handleChange}/>
                    </label>
                    <input style={this.formStyle} type="submit" value="Submit"/>
                </form>
            </div>

        )
    }
}
