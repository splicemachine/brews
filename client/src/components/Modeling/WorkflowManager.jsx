import "react-table/react-table.css";
import React, {Component} from "react";
import ReactTable from "react-table";
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import {promiseColumns, promiseData} from "./DataTransformations";
import {server} from "../../utilities"

const CheckboxTable = checkboxHOC(ReactTable);

/**
 * Very useful Higher Order Component (HOC) Desctiption Page:
 * https://react-table.js.org/#/story/select-table-hoc
 *
 * Andy and I wanted to write this! http://chancejs.com/
 */

/**
 * Main display. Show the models that you want to do things to.
 */
export default class WorkflowManager extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        /**
         * This is our state machine advancer.
         * @type {*|any}
         */
        this.next = this.props.next.bind(this);
        const data = [];
        const columns = [{Header: "Nothing."}];
        this.state = {
            selection: [],
            selectAll: false,
            table: {
                columns,
                data
            },
            disabled: {
                train: true,
                deploy: true,
                delete: true
            }
        };

        /**
         *
         * @param method
         * @param body
         * @returns {{method: *, body: string, headers: Headers, mode: string, cache: string}}
         */
        this.fetchInit = (method, body) => {
            return {
                method,
                body: JSON.stringify(body),
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                mode: "cors",
                cache: "default"
            }
        };

        this.toggleSelection = this.toggleSelection.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.setButtonAvailability = this.setButtonAvailability.bind(this);
        this.handleButton = this.handleButton.bind(this);
        this.softDelete = this.softDelete.bind(this);
    }

    componentWillMount() {
        this.fetchData().then(noop);
    }

    /**
     * Fetch the data and populate our table.
     * @returns {Promise<any>}
     */
    fetchData() {
        return fetch(server() + "/api/v1/modeling/models")
            .then(response => response.json())
            .then(promiseData)
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

    softDelete(item){
        return fetch(server() + "/api/v1/modeling/models", this.fetchInit("DELETE", item))
            .then(response => response.json())
            .then((deleteResult)=>{
                console.log(deleteResult)
            })
            // .then(noop)
    }

    /**
     * Triggered on button clicks.
     * @param value
     * @param event
     */
    handleButton(value, event) {
        let item = this.getSelectedItem();
        switch (value) {
            case "train":
                this.next(item);
                break;
            case "deploy":
                break;
            case "delete":
                this.softDelete(item)
                    .then(this.fetchData);
                break;
            default:
                console.log("Default button case. Bad news bears.");
        }
        event.preventDefault();
    }

    /**
     * If called with state, it will find the item corresponding to that.
     * If called without, it will default to react component state.
     * Overloading is necessary because this.setState might not resolve by the time we need it.
     * @param [state]
     * @returns {number | * | T | {}}
     */
    getSelectedItem(state) {
        let key = state ? state.selection[0] : this.state.selection[0];
        return this.state.table.data.find((item) => item._id === key);
    }

    /**
     * Return nothing, Mutates the component state to set the button availability.
     * @param state
     */
    setButtonAvailability(state) {
        let item = this.getSelectedItem(state);
        switch (item["STATUS"]) {
            case "TRAINIED":
                this.setState(
                    {
                        disabled: {
                            train: false,
                            deploy: false,
                            delete: false
                        }
                    }
                );
                break;
            case "NEW":
                this.setState(
                    {
                        disabled: {
                            train: false,
                            deploy: true,
                            delete: false
                        }
                    }
                );
                break;
            default:
                /**
                 * TODO: "TRAINIED" is not a valid state. Spelling Mistake.
                 */
                console.log("Really shouldn't encounter defaults man.", item["STATUS"])
        }
    }

    /**
     * React Table
     * From the docs: toggleSelection(key, shift, row)
     * @param key
     */
    toggleSelection(key) {
        let selection = [];
        const keyIndex = selection.indexOf(key);
        if (keyIndex >= 0) {
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1)
            ]
        } else {
            selection.push(key);
        }
        this.setState({selection});
        this.setButtonAvailability({selection});
    }

    /**
     * React Table
     */
    toggleAll() {
        const selectAll = !this.state.selectAll;
        const selection = [];
        if (selectAll) {
            const wrappedInstance = this.checkboxTable.getWrappedInstance();
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            currentRecords.forEach((item) => {
                selection.push(item._original._id);
            })
        }
        this.setState({selectAll, selection})
    }

    /**
     * React Table
     * @param key
     * @returns {boolean}
     */
    isSelected(key) {
        return this.state.selection.includes(key);
    }

    render() {
        const {toggleSelection, toggleAll, isSelected} = this;
        const {selectAll} = this.state;

        const checkboxProps = {
            selectAll,
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: 'radio',
        };

        const centerButtons = {
            textAlign: "center"
        };

        return (
            <div>
                <h3>Models List</h3>

                <CheckboxTable
                    ref={(r) => this.checkboxTable = r}
                    columns={this.state.table.columns}
                    data={this.state.table.data}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    {...checkboxProps}
                />

                <div className="pure-u-1-1"/>

                <form className="pure-form pure-form-aligned"
                      onSubmit={noop}>
                    <fieldset>
                        <div className={"pure-g"} style={centerButtons}>
                            <div className={"pure-u-sm-1-1 pure-u-md-1-3 pure-u-lg-1-3"}>
                                <button className="pure-button pure-button-primary"
                                        onClick={this.handleButton.bind(this, "train")}
                                        disabled={this.state.disabled.train}>
                                    Train / Run
                                </button>
                            </div>
                            <div className={"pure-u-sm-1-1 pure-u-md-1-3 pure-u-lg-1-3"}>
                                <button className="pure-button pure-button-primary"
                                        onClick={this.handleButton.bind(this, "deploy")}
                                        disabled={this.state.disabled.deploy}>Deploy
                                </button>
                            </div>
                            <div className={"pure-u-sm-1-1 pure-u-md-1-3 pure-u-lg-1-3"}>
                                <button className="pure-button pure-button-primary"
                                        onClick={this.handleButton.bind(this, "delete")}
                                        disabled={this.state.disabled.delete}>Delete
                                </button>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }
}

function noop(){}
