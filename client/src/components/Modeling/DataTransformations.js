import Chance from "chance";

const chance = new Chance();

/**
 * Okay, when you get a raw block of json data, transform it with _id because the react-table HOC
 * select-table needs those _id to work.
 * I've also included an option to decorate:
 * The object transform contains key:value where if the item[key] in the data matches match, it will
 * be replaced with transform[key]
 * I used this to drop in a react component in to the data for "completed'.
 * Note that transform[key] needs to be a function because it will provide it 'item' context.
 * @param raw           Raw data blob that will be decorated with _id and optionally transformation objects.
 * @param match         For now, a string that will trigger the condition to replace raw[item][key]
 * @param transform:    key:value where key matches one of the keys in each item of raw.
 *                      value will be a function that returns the item we want to place at raw[item][key]
 */
export function getData(raw, match, transform) {
    return raw.map((item) => {
        const _id = chance.hash({length: 6});
        if(match && transform){
            Object.keys(transform).map((key)=>{
                if(item[key] === match){
                    item[key] = transform[key](item)
                }
            });
        }
        return {
            _id,
            ...item,
        }
    });
}

export function promiseData(raw, match, transform) {
    return new Promise((resolve) => (
        resolve(raw.map((item) => {
            const _id = chance.hash({length: 6});
            if(match && transform){
                Object.keys(transform).map((key)=>{
                    if(item[key] === match){
                        item[key] = transform[key](item)
                    }
                });
            }
            return {
                _id,
                ...item,
            }
        }))
    ))
}

/**
 * This on e is easier. React-Table needs a list of columns that have human readable names and accessors
 * so it can make the columns at the top of the rendered display.
 * accessor should be a unique key stringlike
 * Header should be a pretty human readable value.
 * See react-table for better docs.
 * @param data
 * @returns {Array}
 */
export function getColumns(data) {
    const columns = [];
    const sample = data[0];
    Object.keys(sample).forEach((key) => {
        if (key !== '_id') {
            columns.push({
                accessor: key,
                Header: key,
            })
        }
    });
    return columns;
}
export function promiseColumns(data) {

    const columns = [];
    const sample = data[0];

    Object.keys(sample).forEach((key) => {
        if (key !== '_id') {
            columns.push({
                accessor: key,
                Header: key,
            })
        }
    });

    return new Promise((resolve) => (
            resolve(columns)
    ))
}
