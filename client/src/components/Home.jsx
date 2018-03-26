import React, {Component} from "react";

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};
    }

    render() {
        return (
            <div className="content">
                <h2 className="content-subhead">Here's Some Stuff</h2>
                <p>This is where fun things go.</p>
            </div>

        )
    }
}
