import env from "../../environment";

/**
 * These statements exist because Splice Machine does not have fully
 * idempotent operations. Things like IF NOT EXISTS do not exits.
 * I must run these statements without regard to errors to clean the database
 * prior to running the code I want.
 * @type {string[]}
 */
export const force = [
    `drop table IF EXISTS TIMELINE.TRANSFERORDERS`,
    `drop table IF EXISTS TIMELINE.TO_DELIVERY_CHG_EVENT`,
    `drop table IF EXISTS TIMELINE.TIMELINE_INT`,
    `drop table IF EXISTS TIMELINE.STOCKOUTS`,
    `drop table IF EXISTS TIMELINE.RESULT_DATES`,
    `drop table IF EXISTS TIMELINE.RESULT_DATE`,
    `drop table IF EXISTS TIMELINE.QUICK_CHECK_LINES`,

    `drop schema TIMELINE restrict`
];

export const createSchema = [
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

export const dataImport = [
    `call SYSCS_UTIL.IMPORT_DATA('TIMELINE','TRANSFERORDERS',null, 's3a://${env.ATP_S3_USER}:${env.ATP_S3_SECRET}@splice-demo/supplychain/data_0623/train_orders.csv', null, null, 'yyyy-MM-dd HH:mm:ss.S', null, null, -1, '/tmp', true, null)`,
    `call SYSCS_UTIL.IMPORT_DATA('TIMELINE','TO_DELIVERY_CHG_EVENT', null, 's3a://${env.ATP_S3_USER}:${env.ATP_S3_SECRET}@splice-demo/supplychain/data_0623/train_events.csv', null, null, 'yyyy-MM-dd HH:mm:ss.S', null, null, -1, '/tmp', true, null)`,
    `call SYSCS_UTIL.IMPORT_DATA('TIMELINE','TIMELINE_INT', null, 's3a://${env.ATP_S3_USER}:${env.ATP_S3_SECRET}@splice-demo/supplychain/data_0623/train_inv.csv', null, null, 'yyyy-MM-dd HH:mm:ss.S', null, null, -1, '/tmp', true, null)`,
];

/**
 * Generated function calls
 */

export const transferOrders = [
    `select * from timeline.transferorders where shipfrom in (1,2,3) and shipto in (1,2,3) and destinationinventory=?`
];

export const atpOnDate = [
    `select case when min(val) < 0 then 0 else min(val) end AS Available from timeline.timeline_int
        where timeline_id = ? 
        AND ST >= ?  
        AND ET < ?`
];

export const trackingInventoryAsTimelines = [
    `select * from timeline.timeline_int
        where TIMELINE_ID = ?
        and st >= date('2016-09-15')
        order by TIMELINE.TIMELINE_INT.ST`
];

export const inventoryOnDate = [
    `select val as Inventory from timeline.timeline_int where timeline_id = ?
        AND ST <= ?  
        AND ET > ?`
];

export const proposedOrder = [
    `
    select inv_id, qty from timeline.quick_check_lines order by inv_id
    `
];

export const orderATP = [
    `
    select combined_atp from timeline.result_date
    `
];

export const lineItemATP = [
    `
    select inv_id, atp_on_target_date, atp_date from timeline.result_dates order by atp_date desc
    `
];

export const addQuickCheckLine = [
    `
    INSERT INTO TIMELINE.QUICK_CHECK_LINES VALUES (?, ?)
    `
];

export const deleteTimelineDates = [
    `delete from timeline.result_date`,
    `delete from timeline.result_dates`
];

/**
 * We do not ave the TSQL ability to DECLARE and SET local variables,
 * This means that each of the `?` in the prepared statements will have to be set to a corresponding value.
 * Gene got around this by using the variable interpolation $targetDate.
 * I could easily "prepare" my own statements by passing in the variable to a function, but that might
 * be a worse idea than actually doing the iteration for this series.
 *
 * I think I will create a function for these statements because they are somewhat special
 * @type {string[]}
 */

export const addResultDate = [
    `
    INSERT INTO timeline.result_date 
    SELECT Max(Nvl(Date(et), ?)) AS COMBINED_ATP 
    FROM   timeline.quick_check_lines qc 
           LEFT JOIN (SELECT inv_id, 
                             et, 
                             val, 
                             qty 
                      FROM   timeline.timeline_int 
                             JOIN timeline.quick_check_lines 
                               ON timeline_id = inv_id 
                      WHERE  st >= ? 
                             AND val < qty) y 
                  ON qc.inv_id = y.inv_id 
    `,
];

export const addResultDates = [
    `
    INSERT INTO timeline.result_dates 
    SELECT qc.inv_id, 
           (SELECT CASE 
                     WHEN Min(val) < 0 THEN 0 
                     ELSE Min(val) 
                   END 
            FROM   timeline.timeline_int 
            WHERE  timeline_id = qc.inv_id 
                   AND st >= ?) ATP_ON_TARGET_DATE, 
           Nvl(atp, ?)          AS ATP_DATE 
    FROM   timeline.quick_check_lines qc 
           LEFT JOIN (SELECT inv_id, 
                             Date(Max(et)) AS ATP 
                      FROM   timeline.timeline_int 
                             JOIN timeline.quick_check_lines 
                               ON timeline_id = inv_id 
                      WHERE  st >= ? 
                             AND val < qty 
                      GROUP  BY inv_id 
                      ORDER  BY atp DESC) y 
                  ON qc.inv_id = y.inv_id     
    `,
];


