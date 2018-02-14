import React, {Component} from "react";
import "../../styles/main.css";
import ReactTable from "react-table";
import "react-table/react-table.css";

export default class TableView extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};
    }

    render() {
        const {className} = this.props;

        const data = [{
            name: 'Tanner Linsley',
            age: 26,
            friend: {
                name: 'Jason Maurer',
                age: 23,
            }
        }];

        const columns = [{
            Header: 'Name',
            accessor: 'name' // String-based value accessors!
        }, {
            Header: 'Age',
            accessor: 'age',
            Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            id: 'friendName', // Required because our accessor is not a string
            Header: 'Friend Name',
            accessor: d => d.friend.name // Custom value accessors!
        }, {
            Header: props => <span>Friend Age</span>, // Custom header components!
            accessor: 'friend.age'
        }];

        return (
            <div className={className || "fucking-nothing"}>
                <ReactTable data={data} columns={columns}/>
            </div>
        )
    }
}


