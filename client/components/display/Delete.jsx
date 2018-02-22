import env from "../../../server/environment";
import React, {Component} from "react";
import "../../styles/main.css"

export default class Delete extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            rowsUpdated: "Not updated yet.",
            collapsed: "collapsed",
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

        /**
         * These are important for when HTML actions are triggered based on function calls.
         * That makes sense because they won't be bound to anything at the time of calling
         * without an explicit reference.
         */
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getResults = this.getResults.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.render = this.render.bind(this);
    }

    getResults() {
        return fetch(env.server() + this.props.config.endpoint, this.postInit()).then((response) => {
            return response.json()
        })
    }

    handleChange(index, event) {
        this.state.fields[index].value = event.target.value;
        this.setState(this.state);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.getResults()
            .then((result) => {
                if (result[0]) {
                    this.setState({rowsUpdated: result[0]})
                }
            })
            .catch((e) => {
                console.log("some shit happened", e)
            });
    }

    toggleVisibility() {
        this.state.collapsed = this.state.collapsed === "" ? "collapsed" : "";
        this.setState(this.state);
    }

    render() {
        /**
         * Extract a class if it was passed in.
         */
        const {className} = this.props;

        /**
         * TODO Export Styles
         * @type {{backgroundColor: string, height: string, overflowY: string}}
         */
        const containerStyle = {
            backgroundColor: this.props.config.backgroundColor,
            height: "auto",
            overflowY: "auto",
        };
        const inline = {
            "display": "inline-block",
            "margin": "1em",
        };

        return (
            <div className={className || "fucking-nothing"} style={containerStyle}>
                <button style={inline} onClick={this.toggleVisibility}>&nbsp;</button>
                <h3 style={inline}>{this.props.config.title}</h3>
                <div className={this.state.collapsed}>
                    <form onSubmit={this.handleSubmit}>
                        <input type="submit" value="Submit"/>
                    </form>
                    Rows Updated: {this.state.rowsUpdated}
                </div>
            </div>
        );
    }
}
