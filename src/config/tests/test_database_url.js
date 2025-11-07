import 'dotenv/config';

export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || "postgres://user:password@localhost:5432/testdb";
