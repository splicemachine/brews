/**
 *
 */

export const select_models = [
    `select * from MLDEMO.ML_MODEL_MANAGER`
];

export const select_datasets = [
    `
     select s.schemaname ||'.' || t.tablename from sys.sysschemas s join sys.systables t on s.schemaid = t.schemaid
         where t.tabletype <> 'S'
         and s.schemaname <> 'SYS'
         order by s.schemaname, t.tablename
    `
];

export const job_status = [
  `select * from MLDEMO.ML_JOBS`
];

export const job_output = [
  `select * from MLDEMO.ML_RUN_OUTPUT where JOB_ID = ?`
];

