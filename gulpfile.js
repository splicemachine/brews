/**
 * This is for the server only.
 */

// noinspection NpmUsedModulesInstalled
const clean = require("gulp-clean");
const gulp = require("gulp");
const ts = require("gulp-typescript");
const pm2 = require("pm2");
const watch = require("gulp-watch");

const tsProject = ts.createProject("tsconfig.json");

gulp.watch("server/**/*.ts", ["clean", "compile", "dev:restart"], () => {
});

let log = {
    server: false,
    client: false
};

gulp.task("default", ["watch"], () => {
});

gulp.task("clean", [], () => {
    console.log("CLEAN");
    console.log("Running clean.");
    return gulp.src("server/**/*.js", {read: false})
        .pipe(clean());
});

gulp.task("compile", ["clean"], () => {
    console.log("COMPILE");
    // noinspection JSCheckFunctionSignatures
    const tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest("server"));
    // });
});

gulp.task("watch", ["clean", "compile", "dev:server"], () => {
    console.log("WATCH");
    process.on("SIGINT", function () {

        let kill = new Promise((resolve) => {
            pm2.connect(true, function () {
                pm2.stop("server", function () {
                    console.log(" <----- Control + C");
                    console.log("PM2 Stopped for Server");
                    pm2.stop("client", function () {
                        console.log("PM2 Stopped for Client");
                        resolve();
                    });
                });
            });
        });

        kill.then(() => {
            process.exit(1);
        });

    });

});

gulp.task("dev:restart", ["clean", "compile"], (cb) => {
    console.log("DEV:STOP");
    pm2.connect(true, function () {
        pm2.restart("server", () => {
            pm2.restart("client", () => {
                cb()
            });
        });
    })
});

gulp.task("dev:server", ["clean", "compile"], () => {
    console.log("DEV:SERVER");

    pm2.connect(false, function () {
        // noinspection Annotator
        pm2.start({
            name: "server",
            script: "server/index.js",
            color: true,
            env: {
                // "NODE_ENV": require("../config").ENV
                "NODE_ENV": "development"
            }
        }, function (err, proc) {
            console.log("PM2 Started for Server");
            //function streamLogs(id, lines, timestamp, exclusive)
            if (!log.server) {
                log.server = true;
                pm2.streamLogs("server", 0, false, 'LLLL');
            }
        });

        // noinspection Annotator
        pm2.start({
            name: "client",
            script: "webpack-dev-server",
            color: true,
            env: {
                // "NODE_ENV": require("../config").ENV
                "NODE_ENV": "development"
            }
        }, function (err, proc) {
            console.log("PM2 Started for Client");
            if (!log.client) {
                log.client = true;
                pm2.streamLogs("client", 0, false, 'LLLL');
            }
        });
    });
    // pm2.connect(true, function () {
    // });
});
