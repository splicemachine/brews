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
        this.state = {
            currentPage:0,
            pages: [
                {
                    component: <WorkflowManager/>
                },
                {
                    component: <TrainAndRun/>
                },
                {
                    component: <JobStatus/>
                },
                {
                    component: <Output/>
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

