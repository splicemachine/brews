import React, {Component} from "react";

export default class Services extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};
    }

    render() {

        return (

            <div className="content">
                <h2 className="content-subhead">Here's Some Other Stuff</h2>
                <p>This is where more fun things go.</p>
            </div>

        )
    }
}
