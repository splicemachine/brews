import React, {Component} from "react";
import Chance from "chance";
import {job_status} from "./test_data";
import "react-table/react-table.css";
import ReactTable from "react-table";
import CompletedStatus from "./CompletedStatus.jsx";

const chance = new Chance();

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
        const data = this.getData(job_status);
        const columns = this.getColumns(data);
        this.state = {
            lastActions,
            data,
            columns
        };
        this.handleCompleted = this.handleCompleted.bind(this);
    }

    handleCompleted(item, event){
        this.next(item);
        event.preventDefault();
    }

    getData(raw) {
        return raw.map((item) => {
            const _id = chance.hash({length: 6});
            if (item.status.toLowerCase() === "completed"){
                item.status = <CompletedStatus action={this.handleCompleted.bind(this, item)}/>
            }
            return {
                _id,
                ...item,
            }
        });
    }

    getColumns(data) {
        const columns = [];
        const sample = data[0];
        Object.keys(sample).forEach((key) => {
            if (key !== '_id') {
                columns.push({
                    accessor: key,
                    Header: key,
                })
            }
        });
        return columns;
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
