import React, {Component} from "react";

export default class TrainAndRun extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Triggered on button clicks.
     * @param form
     * @param event
     */
    handleSubmit(form, event) {
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form className="pure-form pure-form-aligned"
                      onSubmit={this.handleSubmit.bind(this, "addLine")}>
                    <fieldset>

                    </fieldset>
                </form>
            </div>
        )
    }
}
