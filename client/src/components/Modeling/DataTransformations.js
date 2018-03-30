import Chance from "chance";

const chance = new Chance();

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
