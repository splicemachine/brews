import React, {Component} from "react";
import "../../styles/main.css"
import ReactTable from "react-table";
import env from "../../../server/environment";
import "react-table/react-table.css";

export default class TableSelect extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            columns: [{Header: "No Data"}],
            data: [],
            fields: this.props.config.parameters.map((item) => ({value: item.value, placeholder: item.placeholder})),
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
         * without and explicit reference.
         */
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getResults = this.getResults.bind(this);
        this.render = this.render.bind(this);
    }

    getResults(value) {
        console.log("get results", value);
        return fetch(env.server() + this.props.config.endpoint, this.postInit({params: value})).then((response) => {
            return response.json()
        })
    }

    handleChange(index, event) {
        /**
         * TODO: Do I really want to force NaN to the user? (yes obviously, but really)
         * @type {number}
         */
        this.state.fields[index].value = parseInt(event.target.value);
        this.setState(this.state);

    }

    handleSubmit(event) {
        event.preventDefault();
        this.getResults(this.state.fields.map((item)=>item.value))
            .then((result) => {
                if (result[0]) {
                    this.setState({columns: Object.keys(result[0]).map((item) => ({Header: item, accessor: item}))})
                }
                this.setState({data: result});
            })
            .catch((e) => {
                console.log("fucked up", e)
            });
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
            backgroundColor: "#ffaa00",
            height: "auto",
            overflowY: "auto",
        };

        return (
            <div className={className || "fucking-nothing"} style={containerStyle}>
                <form onSubmit={this.handleSubmit}>
                    <h3>{this.props.config.title}</h3>
                    <label>
                        {
                            this.state.fields.map((item, index) => {
                                return (
                                    <input
                                        key={index}
                                        type="text"
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
                    defaultPageSize={10}
                />
            </div>

        );
    }
}
