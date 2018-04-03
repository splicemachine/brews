/**
 *
 */

export const select_models = [
    `
    SELECT * FROM MLDEMO.ML_MODEL_MANAGER
        ORDER BY UPDATE_DATE DESC
    `
];

export const select_datasets = [
    `
     SELECT S.SCHEMANAME ||'.' || T.TABLENAME FROM SYS.SYSSCHEMAS S JOIN SYS.SYSTABLES T ON S.SCHEMAID = T.SCHEMAID
         WHERE T.TABLETYPE <> 'S'
         AND S.SCHEMANAME <> 'SYS'
         ORDER BY S.SCHEMANAME, T.TABLENAME
    `
];

export const job_status = [
    `
    SELECT * FROM MLDEMO.ML_JOBS
        ORDER BY UPDATE_DATE DESC
    `
];

export const job_output = [
    `
    SELECT * FROM MLDEMO.ML_RUN_OUTPUT
        WHERE JOB_ID = ?
    `
];

export const insert_job = [
    `
    INSERT INTO MLDEMO.ML_JOBS
        (NAME, TYPE, FEATURES_TABLE , STATUS, UPDATE_DATE)
        Values (?,?,?, 'NEW', CURRENT_TIMESTAMP)
    `
];

export const soft_delete = [
    `
     UPDATE MLDEMO.ML_MODEL_MANAGER
     SET STATUS = 'DELETED'
     WHERE NAME = ?
    `
];
