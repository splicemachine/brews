import "react-table/react-table.css";
import React, {Component} from "react";
import WorkflowManager from "./WorkflowManager.jsx";
import TrainAndRun from "./TrainAndRun.jsx";
import JobStatus from "./JobStatus.jsx";
import Output from "./Output.jsx";

export default class Modeling extends Component {

    constructor(props) {

        super(props);
        this.props = props;
        this.advanceFlow = this.advanceFlow.bind(this);
        this.jump = this.jump.bind(this);

        /**
         * Default to empty components with the advancing function because ideally you
         * would be able to get to the next stage from any page.
         * @type {{currentPage: number, pages: *[]}}
         */
        this.state = {
            currentPage: 0,
            pages: [
                {
                    component: <WorkflowManager next={this.advanceFlow} start={this.jump.bind(this, 0)}/>
                },
                {
                    component: <TrainAndRun next={this.advanceFlow} start={this.jump.bind(this, 0)}/>
                },
                {
                    component: <JobStatus next={this.advanceFlow} start={this.jump.bind(this, 0)}/>
                },
                {
                    component: <Output next={this.advanceFlow} start={this.jump.bind(this, 0)}/>
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
    }

    /**
     * Try to target a state machine for orchestrating the flow of the application. 🙏
     * @param context
     */
    advanceFlow(...context) {
        let nextPage = -1;
        switch (this.state.currentPage) {
            case 0:
                console.log("Workflow Manager sent this:", ...context);
                nextPage = 1;
                this.state.currentPage = nextPage;
                this.state.pages[nextPage].component =
                    <TrainAndRun next={this.advanceFlow}
                                 models={context}
                                 home={this.jump.bind(this, 2)}
                                 start={this.jump.bind(this, 0)}/>;
                break;
            case 1:
                console.log("Train and Run sent this:", ...context);
                nextPage = 2;
                this.state.currentPage = nextPage;
                this.state.pages[nextPage].component =
                    <JobStatus next={this.advanceFlow}
                               last={context}
                               start={this.jump.bind(this, 0)}/>;
                break;
            case 2:
                console.log("Job Status sent this:", ...context);
                nextPage = 3;
                this.state.currentPage = nextPage;
                this.state.pages[nextPage].component =
                    <Output next={this.advanceFlow}
                            target={context}
                            home={this.jump.bind(this, 2)}
                            start={this.jump.bind(this, 0)}/>;
                break;
            case 3:
                console.log("Output sent this:", ...context);
                break;
            default:
                console.log("YOU SHOULD HANDLE ALL THE FLOW CASES FOOL.")
        }
        this.setState(this.state);
    }

    jump(target) {
        this.setState({currentPage: target});
    }

    render() {
        return (
            <div className="content">
                {this.state.pages[this.state.currentPage].component}
            </div>
        )
    }
}

