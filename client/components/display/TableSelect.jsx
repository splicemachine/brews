import env from "../../../server/environment";
import React, {Component} from "react";
import ReactTable from "react-table";
import "../../styles/main.css"
import "react-table/react-table.css";

export default class TableSelect extends Component {
    constructor(props) {
        super(props);
        this.props = props;


        this.state = {
            columns: [{Header: "No Data"}],
            data: [],
            fields: this.props.config.parameters.map((item) => ({
                value: item.value,
                type: item.type,
                placeholder: item.placeholder
            })),
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

    getResults(value) {
        return fetch(env.server() + this.props.config.endpoint, this.postInit({params: value})).then((response) => {
            return response.json()
        })
    }

    handleChange(index, event) {
        this.state.fields[index].value = event.target.value;
        this.setState(this.state);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.getResults(this.state.fields.map((item) => item.value))
            .then((result) => {
                if (result[0]) {
                    this.setState({columns: Object.keys(result[0]).map((item) => ({Header: item, accessor: item}))})
                }
                this.setState({data: result});
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
                        <label>
                            {
                                this.state.fields.map((item, index) => {
                                    return (
                                        <input
                                            key={index}
                                            type={item.type}
                                            placeholder={item.placeholder}
                                            value={item.value}
                                            onChange={this.handleChange.bind(this, index)}/>
                                    )
                                })
                            }
                        </label>
                        <input type="submit" value="Submit"/>
                    </form>
                    <ReactTable
                        columns={this.state.columns}
                        data={this.state.data}
                        noDataText="No Data Yet!"
                        defaultPageSize={5}
                    />
                </div>
            </div>
        );
    }
}
