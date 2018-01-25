import React, {Component} from "react";
import "../styles/main.css"

export default class Output extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        console.log("Output Props", this.props);
    }

    render() {
        const {className} = this.props;
        const listStyle = {
            display: "inherit"
        };
        return (

            <div className={className || "fucking-nothing"}>
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


/*
            <div className={className || "fucking-nothing"}>
                <ul>
                    {
                        this.props.log.map((entry, idx)=>{
                            return <li key={idx}><code>{entry}</code></li>
                        })
                    }
                </ul>
            </div>


            <code className={className || "fucking-nothing"}>
                {this.props.log}
            </code>

*/
