const env = require('../config/env');

async function checkDatabaseConnection() {
  if (!env.databaseUrl) {
    console.error('Database connection failed: DATABASE_URL is not configured.');
    process.exitCode = 1;
    return;
  }

  const pool = require('../config/database');
  const expectedTables = [
    'users',
    'patients',
    'doctors',
    'patient_cases',
    'case_conversations',
    'appointments',
    'medical_records',
    'doctor_case_notes',
    'doctor_schedules',
    'doctor_leave',
    'notifications'
  ];

  try {
    const result = await pool.query(
      'SELECT current_database() AS database_name, current_user AS database_user, $1::text AS check_value',
      ['swasthya-database-connection-ok']
    );
    const tableResult = await pool.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = $1 AND table_name = ANY($2::text[])
       ORDER BY table_name`,
      ['public', expectedTables]
    );
    const foundTables = tableResult.rows.map((row) => row.table_name);
    const missingTables = expectedTables.filter((table) => !foundTables.includes(table));
    const columnResult = await pool.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = $1 AND table_name = $2
         AND column_name = ANY($3::text[])`,
      ['public', 'patient_cases', ['doctor_notes']]
    );
    const constraintResult = await pool.query(
      `SELECT pg_get_constraintdef(oid) AS definition
       FROM pg_constraint
       WHERE conrelid = $1::regclass AND conname = $2`,
      ['public.patient_cases', 'patient_cases_status_check']
    );
    const missingCaseFeatures = [];
    if (!columnResult.rows.some((row) => row.column_name === 'doctor_notes')) missingCaseFeatures.push('doctor_notes');
    if (!constraintResult.rows[0] || !constraintResult.rows[0].definition.includes('reviewed')) missingCaseFeatures.push('reviewed status');

    console.log(JSON.stringify({
      ...result.rows[0],
      tables: foundTables,
      missing_tables: missingTables,
      missing_case_features: missingCaseFeatures
    }, null, 2));

    if (missingTables.length > 0 || missingCaseFeatures.length > 0) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

checkDatabaseConnection();