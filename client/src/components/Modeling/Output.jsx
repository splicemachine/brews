import React, {Component} from "react";
import "react-table/react-table.css";
import ReactTable from "react-table";
import {promiseData, promiseColumns} from "./DataTransformations";
import {server} from "../../utilities";

/**
 * Should be a simple view table page.
 */
export default class JobStatus extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        /**
         * This is our state machine advancer.
         * @type {*|any}
         */
        this.next = this.props.next.bind(this);
        const lastActions = this.props.last;
        const data = [];
        const columns = [{Header: "Nothing."}];
        this.state = {
            lastActions,
            table: {
                data,
                columns
            }
        };
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData() {
        return fetch(server() + "/api/v1/modeling/output")
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
