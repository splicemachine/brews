import React, {Component} from "react";
import "react-table/react-table.css";
import ReactTable from "react-table";
import {promiseData, promiseColumns} from "./DataTransformations";
import {server} from "../../utilities";

/**
 * Should be a simple view table page.
 */
export default class Output extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        /**
         * This is our state machine advancer.
         * @type {*|any}
         */
        this.next = this.props.next.bind(this);
        const target = this.props.target;
        const data = [];
        const columns = [{Header: "Nothing."}];
        this.state = {
            target,
            table: {
                data,
                columns
            }
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
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData() {
        const target = this.state.target;
        return fetch(server() + "/api/v1/modeling/output", this.postInit(target))
            .then(response => response.json())
            .then(promiseData)
            .then((data) => {
                this.state.table.data = data;
                return Promise.resolve(data);
            })
            .then(promiseColumns)
            .then((cols) => {
                this.state.table.columns = cols;
                return Promise.resolve();
            })
            .then(() => {
                this.setState(this.state);
            })
    }

    render() {
        return (
            <div>
                <h3>Output</h3>
                <ReactTable
                    columns={this.state.table.columns}
                    data={this.state.table.data}
                    noDataText="No Data Yet!"
                    defaultPageSize={5}/>
            </div>
        )
    }
}
