const chalk = require('chalk');

function select(color) {
    return function () {
        let args = Array.prototype.slice.call(arguments);
        console.log(chalk[color](...args))
    }
}

module.exports = {
    green: select("green"),
    red: select("red"),
    blue: select("blue"),
    yellow: select("yellow")
};
