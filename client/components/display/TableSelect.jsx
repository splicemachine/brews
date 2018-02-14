import React, {Component} from "react";
import "../../styles/main.css"
import ReactTable from "react-table";
import env from "../../../server/environment";
import "react-table/react-table.css";

export default class TableSelect extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.config = this.props.config;
        this.state = {
            columns: [{Header:"No Data"}],
            data: [],
            value: "",
        };

        this.getInit = {
            method: "GET",
            headers: new Headers(),
            mode: "cors",
            cache: "default"
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

    /**
     * React Initialization Hook
     */
    // componentDidMount() {
    //     this.getColumns().then((data) => {
    //         /**
    //          * This comes back as an array of strings.
    //          * React table would like an array of objects with 'name' and 'accessor'
    //          * @type {Response}
    //          */
    //         this.state.columns = data.map((item) => ({Header: item, accessor: item}));
    //         this.setState(this.state);
    //     });
    // }

    // getColumns() {
    //     return fetch(env.server() + this.config.endpoint, this.getInit).then((response) => {
    //         return response.json()
    //     })
    // }

    getResults(value) {
        return fetch(env.server() + this.config.endpoint, this.postInit({destination: value})).then((response) => {
            return response.json()
        })
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.getResults(this.state.value)
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
                    <h3>{this.config.title}</h3>
                    <label>
                        <input
                            type="text"
                            placeholder="Destination Inventory"
                            value={this.state.value}
                            onChange={this.handleChange}/>
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
