// noinspection NpmUsedModulesInstalled
import ReactTable from "react-table";
import "react-table/react-table.css";
import React, {Component} from "react";
import WorkflowManager from "./WorkflowManager.jsx";
import TrainAndRun from "./TrainAndRun.jsx";
import JobStatus from "./JobStatus.jsx";
import Output from "./Output.jsx";


function server() {
    return process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
}

export default class Modeling extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.advanceFlow = this.advanceFlow.bind(this);
        this.state = {
            currentPage: 0,
            pages: [
                {
                    component: <WorkflowManager next={this.advanceFlow}/>
                },
                {
                    component: <TrainAndRun next={this.advanceFlow}/>
                },
                {
                    component: <JobStatus next={this.advanceFlow}/>
                },
                {
                    component: <Output next={this.advanceFlow}/>
                },
            ]
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

        /**
         * Bind everything you need to the constructor context.
         */
        this.exceptionHandler = this.exceptionHandler.bind(this);
    }

    advanceFlow(...context) {
        switch (this.state.currentPage) {
            case 0:
                console.log("Workflow Manager sent this:", ...context);
                break;
            case 1:
                console.log("Train and Run sent this:", ...context);
                break;
            case 2:
                console.log("Job Status sent this:", ...context);
                break;
            case 3:
                console.log("Output sent this:", ...context);
                break;
            default:
                console.log("YOU SHOULD HANDLE ALL THE FLOW CASES FOOL.")
        }

    }


    // noinspection JSMethodCanBeStatic
    /**
     * Catches exceptions.
     * @param exception
     */
    exceptionHandler(exception) {
        if (exception instanceof TypeError) {
            console.log("I think the server isn't hooked up.");
            return;
        }

        console.error(exception);
    }


    render() {
        // noinspection HtmlUnknownAttribute
        return (
            <div>
                {this.state.pages[this.state.currentPage].component}
            </div>
        )
    }
}

