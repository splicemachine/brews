// require("normalize.css/normalize.css");
require("./styles/index.scss");

// document.addEventListener("DOMContentLoaded", () => {
//
//     const pluginsTriggerElement = document.getElementById("plugins-trigger");
//     const pluginsElement = document.getElementById("plugins");
//
//     const pluginsVisibleClass = "splash-overview-plugins__list--visible";
//
//     pluginsTriggerElement.onclick = () => {
//         pluginsElement.classList.toggle(pluginsVisibleClass);
//     }
// });


import React from "react";
import {render} from "react-dom";

import {createStore} from "redux";
import {Provider} from "react-redux";

import App from "./components/App.jsx";
import rootReducer from './reducers'; // The default import is the combination of reducers.

const store = createStore(rootReducer);
// console.log(store.getState());

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("root")
);
