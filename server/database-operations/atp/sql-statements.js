"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * DO NOT AUTOFORMAT THIS FILE
 */
const environment_1 = require("../../environment");
let schemaCreationStatements = [
    `create schema TIMELINE`,
    `drop table IF EXISTS TIMELINE.TRANSFERORDERS`,
    `drop table IF EXISTS TIMELINE.TO_DELIVERY_CHG_EVENT`,
    `drop table IF EXISTS TIMELINE.TIMELINE_INT`,
    `drop table IF EXISTS TIMELINE.STOCKOUTS`,
    `create table TIMELINE.TRANSFERORDERS(
        TO_ID   BIGINT,
        PO_ID   BIGINT,
        SHIPFROM BIGINT,
        SHIPTO  BIGINT,
        SHIPDATE TIMESTAMP,
        DELIVERYDATE TIMESTAMP,
        MODDELIVERYDATE TIMESTAMP,
        SOURCEINVENTORY BIGINT,
        DESTINATIONINVENTORY BIGINT,
        QTY BIGINT,
        SUPPLIER BIGINT,
        ASN VARCHAR(100),
        CONTAINER VARCHAR(100),
        TRANSPORTMODE SMALLINT,
        CARRIER BIGINT,
        FROMWEATHER SMALLINT,
        TOWEATHER SMALLINT,
        LATITUDE  DOUBLE,
        LONGITUDE DOUBLE,
        primary key (TO_ID)
    )`,
    `create index TIMELINE.TOSTIDX on TRANSFERORDERS (
        ShipDate,
        TO_Id
    )`,
    `create index TIMELINE.TOETIDX on TRANSFERORDERS (
        Deliverydate,
        TO_Id
    )`,
    `create table TIMELINE.TO_DELIVERY_CHG_EVENT(
        TO_event_Id bigint,
        TO_Id bigint ,
        ShipFrom bigint,
        ShipTo bigint,
        OrgDeliveryDate timestamp,
        newDeliveryDate timestamp,
        Supplier varchar(100) ,
        TransportMode smallint ,
        Carrier bigint ,
        Fromweather smallint,
        ToWeather smallint,
        primary key (TO_event_Id)
    )`,
    `create table TIMELINE.TIMELINE_INT(
        Timeline_Id BIGINT,
        ST          TIMESTAMP,
        ET          TIMESTAMP,
        VAL         BIGINT,
        primary key (Timeline_Id, ST)
    )`,
    `create table TIMELINE.STOCKOUTS(
        TO_ID   BIGINT,
        Timeline_Id BIGINT,
        ST          TIMESTAMP,
        primary key (TO_ID,ST)
    )`,
    `drop table if exists timeline.result_date`,
    `create table timeline.result_date (
        combined_atp date
    )`,
    `drop table if exists timeline.result_dates`,
    `create table timeline.result_dates (
        inv_id int,
        atp_on_target_date int,
        atp_date date
    )`,
    `drop table if exists timeline.quick_check_lines`,
    `create table timeline.quick_check_lines (
        inv_id int,
        qty int
    )`
];
/**
 * Replace credentials with public
 * @type {string[]}
 * splice-demo-user
 */
let dataImportStatements = [
    `call SYSCS_UTIL.IMPORT_DATA('TIMELINE','TRANSFERORDERS',null, 's3a://${environment_1.default.ATP_S3_USER}:${environment_1.default.ATP_S3_SECRET}@splice-demo/supplychain/data_0623/train_orders.csv', null, null, 'yyyy-MM-dd HH:mm:ss.S', null, null, -1, '/tmp', true, null);`,
    `call SYSCS_UTIL.IMPORT_DATA('TIMELINE','TO_DELIVERY_CHG_EVENT', null, 's3a://${environment_1.default.ATP_S3_USER}:${environment_1.default.ATP_S3_SECRET}@splice-demo/supplychain/data_0623/train_events.csv', null, null, 'yyyy-MM-dd HH:mm:ss.S', null, null, -1, '/tmp', true, null);`,
    `call SYSCS_UTIL.IMPORT_DATA('TIMELINE','TIMELINE_INT', null, 's3a://${environment_1.default.ATP_S3_USER}:${environment_1.default.ATP_S3_SECRET}@splice-demo/supplychain/data_0623/train_inv.csv', null, null, 'yyyy-MM-dd HH:mm:ss.S', null, null, -1, '/tmp', true, null);`,
];
exports.default = {
    create: schemaCreationStatements,
    import: dataImportStatements
};
