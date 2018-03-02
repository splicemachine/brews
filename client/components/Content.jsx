


import React, {Component} from "react";

export default class Content extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};
    }

    render() {

        return (

            <div className="content">
                <h2 className="content-subhead">How to use this layout</h2>
                <p>This is where fun things go.</p>

                {/*<div className="pure-g">*/}
                    {/*<div className="pure-u-1-4">*/}
                        {/*<img className="pure-img-responsive" src="http://farm3.staticflickr.com/2875/9069037713_1752f5daeb.jpg" alt="Peyto Lake" />*/}
                    {/*</div>*/}
                {/*</div>*/}
            </div>

        )
    }
}
