import "react-table/react-table.css";
import React, {Component} from "react";
import ReactTable from "react-table";
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import {getData, getColumns, promiseColumns, promiseData} from "./DataTransformations";

const CheckboxTable = checkboxHOC(ReactTable);

function server() {
    return process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
}

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
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleSelection = this.toggleSelection.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.fetchData = this.fetchData.bind(this);

    }

    componentWillMount() {
        this.fetchData();
    }

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

    /**
     * Triggered on button clicks.
     * @param form
     * @param event
     */
    handleSubmit(event) {
        let item = this.state.table.data.find((item) => item._id === this.state.selection[0]);
        this.next(item);
        event.preventDefault();
    }

    /**
     * Validation helper.
     * @returns {boolean}
     */
    disable() {
        return this.state.selection.length === 0;
    }

    /**
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
    }

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

        return (
            <div>
                <h3>Models</h3>

                <CheckboxTable
                    ref={(r) => this.checkboxTable = r}
                    columns={this.state.table.columns}
                    data={this.state.table.data}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    {...checkboxProps}
                />

                <form className="pure-form pure-form-aligned"
                      onSubmit={this.handleSubmit}>
                    <fieldset>
                        <button type="submit" className="pure-button pure-button-primary"
                                disabled={this.disable()}>Train / Run
                        </button>
                        <button type="submit" className="pure-button pure-button-primary"
                                disabled={true}>Deploy
                        </button>
                        <button type="submit" className="pure-button pure-button-primary"
                                disabled={true}>Delete
                        </button>
                    </fieldset>
                </form>
            </div>
        )
    }
}
