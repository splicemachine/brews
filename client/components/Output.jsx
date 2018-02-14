import React, {Component} from "react";
import "../styles/main.css"

export default class Output extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};
    }

    render() {
        const {className} = this.props;

        const listStyle = {
            display: "inherit",
            color: "#16aa16",
            backgroundColor: "#161616",
        };

        const containerStyle = {
            backgroundColor: "#161616",
            height: "20em",
            overflowY: "auto",
        };

        return (

            <div className={className || "fucking-nothing"} style={containerStyle} id={"OUTPUT"}>
                <ul>
                    {
                        this.props.log.map((entry, idx) => {
                            return <li style={listStyle} key={idx}><code>{entry}</code></li>
                        })
                    }
                </ul>
            </div>

        )
    }
}
