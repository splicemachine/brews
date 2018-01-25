/**
 * Rename this file to environment.ts
 * @type {string | undefined | string}
 */


let jdbc = process.env.JDBC_URL ? process.env.JDBC_URL : "jdbc:splice://localhost:1527/splicedb;user=splice;password=admin";
let atp_s3_user = process.env.ATP_S3_USER ? process.env.ATP_S3_USER : "";
let atp_s3_secret = process.env.ATP_S3_SECRET ? process.env.ATP_S3_SECRET : "";


export default {
    JDBC_URL: jdbc,
    ATP_S3_USER: atp_s3_user,
    ATP_S3_SECRET: atp_s3_secret
}
