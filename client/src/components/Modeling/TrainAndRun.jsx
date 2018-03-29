import React, {Component} from "react";
import Chance from "chance";
import {sample_datasets} from "./test_data";

const chance = new Chance();

export default class TrainAndRun extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        /**
         * This is our state machine advancer.
         * @type {*|any}
         */
        this.next = this.props.next.bind(this);
        const models = this.props.models;
        const datasets = this.getDatasets(sample_datasets);
        this.state = {
            selectedModel: models[0],
            selectedDataset: datasets[0],
            models,
            datasets
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleButton = this.handleButton.bind(this);
        this.disable = this.disable.bind(this);
    }

    getDatasets(raw) {
        return raw.map((item) => ({
            _id: chance.hash({length: 6}),
            ...item
        }))
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
                                        {item.first_name}
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
