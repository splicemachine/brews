import React, {Component} from "react";
import {
    decorateWithIds, transformDatasetList,
    transformModelPropertyCases
} from "./DataTransformations";
import {server} from "../../utilities";
import Navigator from "./Navigator.jsx";

/**
 * Get the list of models. I think this list should just be one because that's what you picked on the previous screen.
 * Get the list of datasets. This list will be kept server side and needs to be retrieved.
 * Then either train or run. Fire a call to insert a row to a table.
 */
export default class TrainAndRun extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        /**
         * This is our state machine advancer.
         * @type {*|any}
         */
        this.next = this.props.next.bind(this);
        this.home = this.props.home.bind(this);
        this.start = this.props.start.bind(this);
        const models = transformModelPropertyCases(this.props.models);
        const datasets = [{}];
        this.state = {
            selectedModel: models[0],
            selectedDataset: datasets[0],
            models,
            datasets
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

        this.fetchData = this.fetchData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleButton = this.handleButton.bind(this);
        this.disable = this.disable.bind(this);
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData() {
        return fetch(server() + "/api/v1/modeling/datasets")
            .then(response => response.json())
            .then(transformDatasetList)
            .then(decorateWithIds)
            .then((data) => {
                this.state.datasets = data;
                this.state.selectedModel = this.state.models[0];
                this.state.selectedDataset = this.state.datasets[0];
                return Promise.resolve(this.state);
            })
            .then((state) => {
                this.setState(state);
            })
    }

    /**
     * Triggered on button clicks.
     * @param event
     */
    handleSubmit(event) {
        event.preventDefault();
    }

    handleChange(menu, event) {
        switch (menu) {
            case "model":
                this.setState({selectedModel: this.state.models[event.target.value]});
                break;
            case "dataset":
                this.setState({selectedDataset: this.state.datasets[event.target.value]});
                break;
            default:
                console.log("SHOULDN'T HAPPEN FOOL");
        }
    }

    handleButton(action, event) {
        const model = this.state.selectedModel;
        const dataset = this.state.selectedDataset;


        fetch(server() + "/api/v1/modeling/action", this.postInit({model, dataset, action}))
            .then(response => response.json())
            .then((response) => {
                console.log("Action sent", response);
                this.next({
                    model,
                    dataset,
                    action
                });
            });

        event.preventDefault();
    }

    /**
     * Validation helper.
     * @returns {boolean}
     */
    disable() {
        return false;
    }

    render() {

        const alignment = {
            margin: "1em 0 1em 0"
        };

        const label = {
            margin: "0 1em 0 0"
        };

        return (
            <div>
                <h3>Train or Run</h3>
                <form className="pure-form pure-form-aligned"
                      onSubmit={this.handleSubmit}>
                    <fieldset>
                        <div className={"pure-g"}>
                            <div className={"pure-u-sm-1-1 pure-u-md-1-1 pure-u-lg-1-1"}>
                                <div style={alignment}>
                                    <span style={label}>
                                        Selected Model:
                                    </span>
                                    <span>
                                        {this.state.selectedModel.name}
                                    </span>
                                </div>
                                <div style={alignment}>
                                    <span style={label}>
                                        <label htmlFor="DATASET">
                                            Selected Dataset:
                                        </label>
                                    </span>
                                    <span>
                                        <select id="DATASET" onChange={this.handleChange.bind(this, "dataset")}>
                                            {
                                                this.state.datasets.map((item, index) =>
                                                    <option key={index} value={index}>
                                                        {item.name}
                                                    </option>)
                                            }
                                        </select>
                                    </span>
                                </div>
                            </div>
                            <div className={"pure-u-sm-1-1 pure-u-md-1-1 pure-u-lg-1-1"}>
                                <span>
                                    <button style={label} type="button" className="pure-button pure-button-primary"
                                            disabled={this.disable()}
                                            onClick={this.handleButton.bind(this, "TRAIN")}>
                                        Train
                                    </button>
                                </span>
                                <span>
                                    <button style={label} type="button" className="pure-button pure-button-primary"
                                            disabled={this.disable()}
                                            onClick={this.handleButton.bind(this, "RUN")}>
                                        Run
                                    </button>
                                </span>
                            </div>
                            <Navigator home={this.home} start={this.start}/>
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }
}
