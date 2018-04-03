/**
 * Rename this file to environment.ts
 * @type {string | undefined | string}
 */

const atp_jdbc = process.env.ATP_JDBC_URL ? process.env.ATP_JDBC_URL : "";
const atp_s3_user = process.env.ATP_S3_USER ? process.env.ATP_S3_USER : "";
const atp_s3_secret = process.env.ATP_S3_SECRET ? process.env.ATP_S3_SECRET : "";
const modeling_jdbc = process.env.MODELING_JDBC_URL ? process.env.MODELING_JDBC_URL : "";

export const atp_db_config = {
    url: atp_jdbc,
    user: "user",
    password: "admin"
};

export const atp_s3_config = {
    key: atp_s3_user,
    secret: atp_s3_secret
};

export const modeling_db_config = {
    url: modeling_jdbc,
    user: "user",
    password: "admin"
};
