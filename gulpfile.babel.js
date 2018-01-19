import gulp from "gulp";
import ts from "gulp-typescript";
import pm2 from "pm2";
import chalk from "chalk";
import del from "del";

const paths = {
    styles: {
        src: "src/styles/**/*.less",
        dest: "assets/styles/"
    },
    scripts: {
        src: "src/scripts/**/*.js",
        dest: "assets/scripts/"
    }
};


let log = {
    server: false,
    client: false
};

const tsProject = ts.createProject("tsconfig.json");

export const clean = () => del(["server/**/*.js"]);

export function compile() {
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
                    "NODE_ENV": "development"
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
    gulp.watch("server/**/*.ts", gulp.series(clean, compile, restart), () => {
    });
}

export const watch = gulp.task("watch", gulp.series(dev, watcher));
