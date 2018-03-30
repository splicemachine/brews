import React, {Component} from "react";
import "react-table/react-table.css";
import ReactTable from "react-table";
import CompletedStatus from "./CompletedStatus.jsx";
import {promiseData, promiseColumns} from "./DataTransformations";
import {server} from "../../utilities";

/**
 * This component will query the status of current jobs.
 * If it finds a completed status, it will pass that information on to the Output component.
 * It also shows an alert for the last thing you did that got you to this page. Train or Run something.
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
        this.handleCompleted = this.handleCompleted.bind(this);
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData() {
        return fetch(server() + "/api/v1/modeling/jobs")
            .then(response => response.json())
            .then(data => promiseData(
                data,
                "COMPLETE",
                {STATUS: (context) => <CompletedStatus action={this.handleCompleted.bind(this, context)}/>})
            )
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
                    columns={this.state.table.columns}
                    data={this.state.table.data}
                    noDataText="No Data Yet!"
                    defaultPageSize={5}/>
            </div>
        )
    }
}
