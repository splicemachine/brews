# ATP

This document will outline the flow of the ATP demo.

Gene covers that the user of the Notebook needs to run the following steps:

## Top -> Down Approach
- JDBC Setup (spark) **[COMPLETED]**
    + `20170622-063514_1166002275`
    + This one is just a way to configure the notebook with the URL to contact the database. This is completed with deployment for the application.
- Timeline Code (spark) **[UNNECESSARY]**
    + `20170622-231413_1135446195`
    + @Gene and @Murray say this is unnecessary.
- Create Schema (splicemachine) **[COMPLETED]**
    + `20170703-142111_1098530498`
    + This is done idempotently in the application. (Yay!)
- Create Tables (splicemachine) **[COMPLETED]**
    + `20170622-222153_977899468`
    + This is done idempotently in the application. (Yay!)
- Load Transfer Order Data (splicemachine) **[COMPLETED]**
    + `20170623-174025_718327456`
    + This works on the remote application and not on my local. There is some strange state issue on local, but that doesn't effect the cloud service.
    + @todo Find out what the local issue is so we can ameliorate the issue in the future.
- Transfer Orders (splicemachine) **[PARAMETERIZED SELECT]**
    + `20170623-175231_773807313`
    + Parameters
        * `destinationinventory`
    + This one is just a way to look at the data.
    + This is a table.
- Tracking Inventory As Timelines (splicemachine) **[PARAMETERIZED SELECT]**
    + `20170621-052218_96471785`
    + Parameters
        * `TIMELINE_ID` :: `inv`
    + This one is a way to look at the data again.
    + @todo I should complete this with d3 so we can see the data that was loaded.
- ATP on Date (splicemachine) **[PARAMETERIZED SELECT]**
    + `20171026-153617_679027547`
    + Parameters
        * `timeline_id` :: `Inv`
        * `st` :: `TimeATP`
        * `et` :: `TimeHorizon`
- Inventory on Date (splicemachine) **[PARAMETERIZED SELECT]**
    + `20171026-153537_959770350`
    + Parameters
        * `timeline_id` :: `Inv`
        * `st` :: `Time`
        * `et` :: `Time`
    + Notice that this one takes bot `st` and `et` but that they are the same value.
- Multi-Line ATP - Quick Promise (angular) **[JAVASCRIPT]**
    + `20171013-161049_2054081284`
    + Parameters
        * `targetDate` :: `Target Date`
        * `itemId` :: `Item ID`
        * `quantity` :: `Quantity`
    + Buttons
        * Add Line
            - Bind all parameters to `20171013-083816_1871485243` :: "Unknown Spark Block 01 (spark)" and run this paragraph.
        * Run ATP
            - Bind no parameters and run `20171027-112314_1454759430` :: "Unknown Spark Block 02 (spark)"
        * Clear Lines
            - Run
                + `20171017-111025_61937030` :: "Delete timeline.quick_check_lines (splicemachine)"
                + `20171017-170300_1458091248` :: "Delete timeline.\*date\* (splicemachine)"
                + `20171017-110511_1143487505` :: "Proposed Order (splicemachine)"
                + `20171017-154006_520921794` :: "Order ATP (splicemachine)"
                + `20171017-172449_57120769` :: "Line Item ATP (splicemachine)"
- Proposed Order (splicemachine) **[SELECT]**
    + `20171017-110511_1143487505`
- Order ATP (splicemachine) **[SELECT]**
    + `20171017-154006_520921794`
- Line Item ATP (splicemachine) **[SELECT]**
    + `20171017-172449_571207691`
- Unknown Spark Block 01 (spark) **[INSERT]**
    + `20171013-083816_1871485243`
    + Run
        * `20171017-170300_1458091248` :: "Delete timeline.\*date\* (splicemachine)"
        * `20171017-110511_1143487505` :: "Proposed Order (splicemachine)"
- Unknown Spark Block 02 (spark) **[SELECT]** **[INSERT]**
    + `20171027-112314_1454759430`
    + Select and Insert some stuff.
    + Run
        * `20171017-154006_520921794` :: "Order ATP (splicemachine)"
        * `20171017-172449_571207691` :: "Line Item ATP (splicemachine)"
- Delete timeline.quick_check_lines (splicemachine)
    + `20171017-111025_61937030`
- Delete timeline.\*date\* (splicemachine)
    + `20171017-170300_1458091248`


