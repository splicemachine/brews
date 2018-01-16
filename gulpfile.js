/**
 * This is for the server only.
 */

// noinspection NpmUsedModulesInstalled
const clean = require("gulp-clean");
const gulp = require("gulp");
const ts = require("gulp-typescript");
const pm2 = require("pm2");
const watch = require('gulp-watch');

const tsProject = ts.createProject("tsconfig.json");

gulp.task("default", ["watch"], () => {
});


// var gulp = require('gulp'),
//     watch = require('gulp-watch');
//
// gulp.task('stream', function () {
//     // Endless stream mode
//     return watch('css/**/*.css', { ignoreInitial: false })
//         .pipe(gulp.dest('build'));
// });
//
// gulp.task('callback', function () {
//     // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
//     return watch('css/**/*.css', function () {
//         gulp.src('css/**/*.css')
//             .pipe(gulp.dest('build'));
//     });
// });


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

    return watch("server/**/*.ts", () => {
        console.log("Running compile.");
        // noinspection JSCheckFunctionSignatures
        const tsResult = tsProject.src()
            .pipe(tsProject());
        return tsResult.js.pipe(gulp.dest("server"));
    });


});

gulp.task("clean", [], () => {
    console.log("Running clean.");
    return gulp.src("server/**/*.js", {read: false})
        .pipe(clean());
});

gulp.task("compile", ["clean"], () => {
    // return watch("server/**/*.ts", () => {
        console.log("Running compile.");
        // noinspection JSCheckFunctionSignatures
        const tsResult = tsProject.src()
            .pipe(tsProject());
        return tsResult.js.pipe(gulp.dest("server"));
    // });
});

gulp.task("dev:server", ["clean", "compile"], () => {
    pm2.connect(true, function () {
        // noinspection Annotator
        pm2.start({
            name: "server",
            script: "server/index.js",
            watch: true,
            color: true,
            env: {
                // "NODE_ENV": require("../config").ENV
                "NODE_ENV": "development"
            }
        }, function () {
            console.log("PM2 Started for Server");
            //function streamLogs(id, lines, timestamp, exclusive)
            pm2.streamLogs("all", 0, true);
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
        }, function () {
            console.log("PM2 Started for Client");
            pm2.streamLogs("all", 0, true);
        });
    });
    // pm2.connect(true, function () {
    // });
});
