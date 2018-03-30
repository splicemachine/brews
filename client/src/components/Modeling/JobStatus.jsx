import React, {Component} from "react";
import {job_status} from "./test_data";
import "react-table/react-table.css";
import ReactTable from "react-table";
import CompletedStatus from "./CompletedStatus.jsx";
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
        const data = getData(
            job_status,
            "COMPLETED",
            {status: (context) => <CompletedStatus action={this.handleCompleted.bind(this, context)}/>});
        const columns = getColumns(data);
        this.state = {
            lastActions,
            data,
            columns
        };
        this.handleCompleted = this.handleCompleted.bind(this);
    }

    handleCompleted(item, event) {
        this.next(item);
        event.preventDefault();
    }

    render() {
        const alertStyle = {
            backgroundColor: "#cceeff"

        };
        return (
            <div>
                {
                    this.state.lastActions.map((item, index) =>
                        <div className={"pure-g"} key={index} style={alertStyle}>
                            <span className={"pure-u-1-3"}>Action: {item.action}</span>
                            <span className={"pure-u-1-3"}>Model: {item.model.first_name}</span>
                            <span className={"pure-u-1-3"}>Dataset: {item.dataset.name}</span>
                        </div>
                    )
                }
                <ReactTable
                    columns={this.state.columns}
                    data={this.state.data}
                    noDataText="No Data Yet!"
                    defaultPageSize={5}/>
            </div>
        )
    }
}
