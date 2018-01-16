import React from 'react';
import env from '../../config/environment'

export default class App extends React.Component {

    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {

        let myHeaders = new Headers();
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        };

        fetch(env() + '/api/v1/me', myInit).then((response) => {
            console.log("Fetch came back");
            const reader = response.body.getReader();
            let charsReceived = 0;
            let result = "";

            reader.read().then(function processText({ done, value }) {
                if (done) {
                    console.log("Stream complete", result);
                    return;
                }

                charsReceived += value.length;
                console.log(value);
                result += value;
                return reader.read().then(processText);
            });
        });
    }

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <h1>Hello Nik.</h1>
                <div className='button__container'>
                    <button className='button' onClick={this.handleClick}>Click Me</button>
                </div>
            </div>
        );
    }
}


