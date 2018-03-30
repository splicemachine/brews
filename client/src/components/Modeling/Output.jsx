import React, {Component} from "react";
import {output_sample} from "./test_data";
import "react-table/react-table.css";
import ReactTable from "react-table";
import {getData, getColumns} from "./DataTransformations";

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
        const data = getData(output_sample);
        const columns = getColumns(data);
        this.state = {
            lastActions,
            data,
            columns
        };
    }

    render() {
        return (
            <div>
                <h3>Output</h3>
                <ReactTable
                    columns={this.state.columns}
                    data={this.state.data}
                    noDataText="No Data Yet!"
                    defaultPageSize={5}/>
            </div>
        )
    }
}
