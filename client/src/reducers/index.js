import {combineReducers} from "redux"
import report from "./report"
import visibilityFilter from "./visibilityFilter"

export default combineReducers({
    report,
    visibilityFilter
})
