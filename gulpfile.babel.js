import gulp from "gulp";
import ts from "gulp-typescript";
import chalk from "chalk";
// noinspection NpmUsedModulesInstalled
import del from "del";
// noinspection ES6CheckImport
import pm2 from "pm2";

let log = {
    server: false,
    client: false
};

const tsProject = ts.createProject("tsconfig.json");

export const clean = () => del(["server/**/*.js"]);

export function compile() {

    // noinspection JSCheckFunctionSignatures
    let tsResult = gulp.src("server/**/*.ts").pipe(tsProject());
    return tsResult.js.pipe(gulp.dest("server"));
}

const restart = () => {
    return new Promise((resolve) => {
        pm2.connect(true, function () {
            pm2.restart("server", () => {
                pm2.restart("client", () => {
                    resolve()
                });
            });
        })
    });
};

export function pm2server() {
    return new Promise((resolve) => {
        pm2.connect(function () {
            pm2.start({
                name: "server",
                script: "server/index.js",
                color: true,
                env: {
                    "NODE_ENV": "development",
                    "JDBC_URL":"jdbc:splice://localhost:1527/splicedb;user=splice;password=admin"
                }
            }, function () {
                if (!log.server) {
                    log.server = true;
                    pm2.streamLogs("server", 0, false, "LLLL");
                }
                resolve()
            });
        })
    });
}

export function pm2client() {
    return new Promise((resolve) => {
        pm2.connect(function () {
            pm2.start({
                name: "client",
                script: "webpack-dev-server",
                color: true,
                env: {
                    "NODE_ENV": "development"
                }
            }, function () {
                if (!log.client) {
                    log.client = true;
                    pm2.streamLogs("client", 0, false, "LLLL");
                }
                resolve()
            });
        })
    });
}

export const dev = gulp.series(clean, compile, gulp.parallel(pm2client, pm2server));

// noinspection JSUnusedGlobalSymbols
export function kill() {
    return new Promise((resolve) => {
        pm2.connect(function () {
            pm2.stop("server", function () {
                console.log(chalk.green("Killing PM2"));
                console.log("PM2 Stopped for Server");
                pm2.stop("client", function () {
                    console.log("PM2 Stopped for Client");
                    pm2.disconnect();
                    resolve();
                });
            });
        });
    })
}

function watcher() {
    // noinspection JSCheckFunctionSignatures
    gulp.watch("server/**/*.ts", gulp.series(clean, compile, restart), () => {
    });
}

// noinspection JSUnusedGlobalSymbols
// export const watch = gulp.task("watch", gulp.series(dev, watcher));

gulp.task("default",  gulp.series(dev, watcher));
