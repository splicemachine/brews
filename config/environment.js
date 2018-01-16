// export default class Env {
//
// }

export default function(){
    if(window.location.host === "localhost:8080"){
        console.log("Environment:", "Split Server");
        /**
         * Send back the other server for now.
         */
        return "//localhost:3000"
    }
    /**
     * If you didn't find anything, then just don't do anything.
     */
    return ""
}
