/**
 * DO NOT AUTOFORMAT THIS FILE
 */
import env from "../../environment";

/**
 * These statements exist because Splice Machine does not have fully
 * idempotent operations. Things like IF NOT EXISTS do not exits.
 * I must run these statements without regard to errors to clean the database
 * prior to running the code I want.
 * @type {string[]}
 */
let errorInvariant = [
    `drop table IF EXISTS TIMELINE.TRANSFERORDERS`,
    `drop table IF EXISTS TIMELINE.TO_DELIVERY_CHG_EVENT`,
    `drop table IF EXISTS TIMELINE.TIMELINE_INT`,
    `drop table IF EXISTS TIMELINE.STOCKOUTS`,
    `drop table IF EXISTS TIMELINE.RESULT_DATES`,
    `drop table IF EXISTS TIMELINE.RESULT_DATE`,
    `drop table IF EXISTS TIMELINE.QUICK_CHECK_LINES`,

    `drop schema TIMELINE restrict`
];//8


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
];//17

/**
 * Replace credentials with public
 * @type {string[]}
 * splice-demo-user
 *
 * call SYSCS_UTIL.IMPORT_DATA('TIMELINE','TRANSFERORDERS',null, 's3a://AKIAJWRKNM6STEY6QWRA:n6k+agcYz23wyyzC42okfmM8FV1jQQqkOyMR6FMo@splice-demo/supplychain/data_0623/train_orders.csv', null, null, 'yyyy-MM-dd HH:mm:ss.S', null, null, -1, '/tmp', true, null)
 */
let dataImportStatements = [
    // `call SYSCS_UTIL.IMPORT_DATA('TIMELINE','TRANSFERORDERS',null, 'file:///tmp/train_orders.csv', null, null, 'yyyy-MM-dd HH:mm:ss.S', null, null, -1, '/tmp', true, null)`,
    `call SYSCS_UTIL.IMPORT_DATA('TIMELINE','TRANSFERORDERS',null, 's3a://${env.ATP_S3_USER}:${env.ATP_S3_SECRET}@splice-demo/supplychain/data_0623/train_orders.csv', null, null, 'yyyy-MM-dd HH:mm:ss.S', null, null, -1, '/tmp', true, null)`,
    `call SYSCS_UTIL.IMPORT_DATA('TIMELINE','TO_DELIVERY_CHG_EVENT', null, 's3a://${env.ATP_S3_USER}:${env.ATP_S3_SECRET}@splice-demo/supplychain/data_0623/train_events.csv', null, null, 'yyyy-MM-dd HH:mm:ss.S', null, null, -1, '/tmp', true, null)`,
    `call SYSCS_UTIL.IMPORT_DATA('TIMELINE','TIMELINE_INT', null, 's3a://${env.ATP_S3_USER}:${env.ATP_S3_SECRET}@splice-demo/supplychain/data_0623/train_inv.csv', null, null, 'yyyy-MM-dd HH:mm:ss.S', null, null, -1, '/tmp', true, null)`,
];//3


let transferOrders = [
    `select * from timeline.transferorders where shipfrom in (1,2,3) and shipto in (1,2,3) and destinationinventory = 100`
];

let trackingInventoryAsTimelines = [
    `select * from timeline.timeline_int
     where TIMELINE_ID = \${inv=200}
     and st >= date('2016-09-15')
     order by TIMELINE.TIMELINE_INT.ST;`
];

let inventoryOnDate = [];
let ATPOnDate = [];


export default {
    create: schemaCreationStatements,
    insert: dataImportStatements,
    errorInvariant: errorInvariant
}


/**
 * This is the identifier for "Timeline Code" it shouldn't appear anywhere else.
 * If it does appear in other places, we have more of an issue because this is a lot of code.
 * 20170622-231413_1135446195
 */

let statementMappings = {
    "Timeline Code": "20170622-231413_1135446195",
    "Create Schema": "20170703-142111_1098530498",
    "Create Tables": "20170622-222153_977899468",
    "Load Transfer Order Data": "20170623-174025_718327456",
    "Transfer Orders": "20170623-175231_773807313",
    "Tracking Inventory As Timelines": "20170621-052218_96471785",
    "Inventory on Date": "20171026-153537_959770350",
    "ATP on Date": "20171026-153617_679027547",
    "Multi-Line ATP - Quick Promise": "20171013-161049_2054081284",
    "Proposed Order": "20171017-110511_1143487505",
    "Order ATP": "20171017-154006_520921794",
    "Line Item ATP": "20171017-172449_571207691",
    "UNNAMED SPARK CODE": "20171013-083816_1871485243",
    "DELETE QUICK CHECK LINES": "20171017-111025_61937030",
    "DELETE RESULT DATES": "20171017-170300_1458091248",
    "MORE SPARK CODE": "20171027-112314_1454759430",
};
/*


inventory on date


select val as Inventory from timeline.timeline_int where timeline_id = ${Inv=100}
    AND ST <= TIMESTAMP('${Time=2017-01-01 00:00:00.0}')
AND ET > TIMESTAMP('${Time=2017-01-01 00:00:00.0}')

atp on date

select case when min(val) < 0 then 0 else min(val) end AS Available from timeline.timeline_int
where timeline_id = ${Inv=100}
    AND ST >= TIMESTAMP('${TimeATP=2017-01-01 00:00:00.0}')
AND ET < TIMESTAMP('${TimeHorizon=2017-05-05 00:00:00.0}')







multi line atp

Target Date
ngModel.targetDate

Item
ngModel.itemID

Quantitiy
ngModel.quantity

Add Line









<button
	type="submit"
	class="btn btn-primary"
	ng-click="z.angularBind('itemId',itemId,'20171013-083816_1871485243');z.angularBind('quantity',quantity,'20171013-083816_1871485243'); z.angularBind('targetDate',targetDate,'20171013-083816_1871485243');z.runParagraph('20171013-083816_1871485243')">
	Add Line
</button>

20171013-083816_1871485243
z.run("20171017-170300_1458091248");
	delete from timeline.result_date;
	delete from timeline.result_dates

val item = z.angular("itemId").toString.toInt
val quantity = z.angular("quantity").toString.toInt
val targetDateString = z.angular("targetDate").toString

// val splicemachineContext = new SplicemachineContext(defaultJDBCURL)
case class LineItem(INV_ID: Int, QTY: Int)
val li = new LineItem(item, quantity)
val liDF = Seq(li).toDF

splicemachineContext.insert(liDF,"timeline.quick_check_lines" )
z.run("20171017-110511_1143487505");
	select inv_id, qty from timeline.quick_check_lines order by inv_id





<button
	type="submit"
	class="btn btn-primary"
	ng-click="z.runParagraph('20171027-112314_1454759430')">
	Run ATP
</button>


20171027-112314_1454759430
val stmt = s"select max(NVL(date(et),'$targetDateString')) as COMBINED_ATP from timeline.quick_check_lines qc left join (select inv_id, et, val, qty from timeline.timeline_int join timeline.quick_check_lines on timeline_id = inv_id where st >= '$targetDateString' and val < qty) y on qc.inv_id = y.inv_id"
val rdDF = splicemachineContext.df(stmt)
splicemachineContext.insert(rdDF,"timeline.result_date")

val stmt2 = s"select qc.INV_ID , (select case when min(val) < 0 then 0 else min(val) end from timeline.timeline_int where timeline_id = qc.inv_id and st >= '$targetDateString') ATP_ON_TARGET_DATE, NVL(ATP,'$targetDateString') as ATP_DATE from timeline.quick_check_lines qc left join (select INV_ID, date(max(et)) as ATP from timeline.timeline_int join timeline.quick_check_lines on timeline_id = inv_id where st >= '$targetDateString' and val < qty group by inv_id order by ATP desc) y on qc.inv_id = y.inv_id"
val rd2DF = splicemachineContext.df(stmt2)
splicemachineContext.insert(rd2DF,"timeline.result_dates")

z.run("20171017-154006_520921794");
	select combined_atp from timeline.result_date;
z.run("20171017-172449_571207691");
	select inv_id, atp_on_target_date, atp_date from timeline.result_dates order by atp_date desc



<button
	type="submit"
	class="btn btn-primary"
	ng-click="
		z.runParagraph('20171017-111025_61937030');
		z.runParagraph('20171017-170300_1458091248');
		z.runParagraph('20171017-110511_1143487505');
		z.runParagraph('20171017-154006_520921794');
		z.runParagraph('20171017-172449_571207691')">
	Clear Lines
</button>

20171017-111025_61937030
	delete from timeline.quick_check_lines
20171017-170300_1458091248
	delete from timeline.result_date;
	delete from timeline.result_dates
20171017-110511_1143487505
	select inv_id, qty from timeline.quick_check_lines order by inv_id
20171017-154006_520921794
	select combined_atp from timeline.result_date;
20171017-172449_571207691
	select inv_id, atp_on_target_date, atp_date from timeline.result_dates order by atp_date desc



*/

