import React, {Component} from "react";
import {decorateWithIds,transformDatasetList, transformModelPropertyCases} from "./DataTransformations";
import {server} from "../../utilities";

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
        const models = transformModelPropertyCases(this.props.models);
        const datasets = [{}];
        this.state = {
            selectedModel: models[0],
            selectedDataset: datasets[0],
            models,
            datasets
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
        this.next({
            model,
            dataset,
            action
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
        return (
            <div>
                <form className="pure-form pure-form-aligned"
                      onSubmit={this.handleSubmit}>
                    <fieldset>
                        <select id="MODEL" onChange={this.handleChange.bind(this, "model")}>
                            {
                                this.state.models.map((item, index) =>
                                    <option key={index} value={index}>
                                        {item.name}
                                    </option>)
                            }
                        </select>
                        <select id="DATASET" onChange={this.handleChange.bind(this, "dataset")}>
                            {
                                this.state.datasets.map((item, index) =>
                                    <option key={index} value={index}>
                                        {item.name}
                                    </option>)
                            }
                        </select>

                        <button type="button" className="pure-button pure-button-primary"
                                disabled={this.disable()}
                                onClick={this.handleButton.bind(this, "train")}>
                            Train
                        </button>

                        <button type="button" className="pure-button pure-button-primary"
                                disabled={this.disable()}
                                onClick={this.handleButton.bind(this, "run")}>
                            Run
                        </button>
                    </fieldset>
                </form>
            </div>
        )
    }
}
