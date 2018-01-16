/**
 * Gulp will run our development servers for front and back ends.
 */

// noinspection NpmUsedModulesInstalled
const clean = require("gulp-clean");
const gulp = require("gulp");
const ts = require("gulp-typescript");
const pm2 = require("pm2");

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
    return gulp.src("server/**/*.js", {read: false})
        .pipe(clean());
});

gulp.task("compile", ["clean"], () => {
    // noinspection JSCheckFunctionSignatures
    const tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest("server"));
});

gulp.task("watch", ["clean", "compile", "dev:server"], () => {
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
    pm2.connect(true, function () {
        pm2.restart("server", () => {
            pm2.restart("client", () => {
                cb()
            });
        });
    })
});

gulp.task("dev:server", ["clean", "compile"], () => {
    pm2.connect(false, function () {
        // noinspection Annotator
        pm2.start({
            name: "server",
            script: "server/index.js",
            color: true,
            env: {
                "NODE_ENV": "development"
            }
        }, function (err, proc) {
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
                "NODE_ENV": "development"
            }
        }, function (err, proc) {
            if (!log.client) {
                log.client = true;
                pm2.streamLogs("client", 0, false, 'LLLL');
            }
        });
    });
});
