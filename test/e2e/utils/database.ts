import { DataSource } from 'typeorm';
import { uniqueSuffix } from './value';

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for e2e tests`);
  }

  return value;
};

const getEnvWithDefault = (name: string, defaultValue: string): string => {
  const value = process.env[name];

  if (!value) {
    return defaultValue;
  }

  return value;
};

export const getOptionalEnv = (name: string): string | null => {
  const value = process.env[name];

  if (!value) {
    return null;
  }

  return value;
};

export const getRequiredDatabaseName = (): string =>
  getRequiredEnv('DATABASE_NAME');

const sanitizeDatabaseName = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9_]/g, '_');

const quoteIdentifier = (identifier: string): string => {
  if (!/^[a-z0-9_]+$/.test(identifier)) {
    throw new Error(`Invalid database identifier: ${identifier}`);
  }

  return `"${identifier}"`;
};

export const buildDatabaseUrl = (databaseName: string): string => {
  const username = encodeURIComponent(getRequiredEnv('DATABASE_USERNAME'));
  const password = encodeURIComponent(getRequiredEnv('DATABASE_PASSWORD'));
  const host = getRequiredEnv('DATABASE_HOST');
  const port = getRequiredEnv('DATABASE_PORT');

  return `postgresql://${username}:${password}@${host}:${port}/${databaseName}`;
};

const createMaintenanceDataSource = (): DataSource =>
  new DataSource({
    type: 'postgres',
    host: getRequiredEnv('DATABASE_HOST'),
    port: Number(getRequiredEnv('DATABASE_PORT')),
    username: getRequiredEnv('DATABASE_USERNAME'),
    password: getRequiredEnv('DATABASE_PASSWORD'),
    database: getEnvWithDefault('DATABASE_MAINTENANCE_NAME', 'postgres'),
  });

export const createTemporaryDatabase = async (): Promise<string> => {
  const maintenanceDataSource = createMaintenanceDataSource();
  const baseDatabaseName = sanitizeDatabaseName(getRequiredDatabaseName());
  const workerId = sanitizeDatabaseName(
    getEnvWithDefault('JEST_WORKER_ID', '0'),
  );
  const suffix = sanitizeDatabaseName(uniqueSuffix());
  const databaseName = `${baseDatabaseName}_e2e_${workerId}_${suffix}`;

  await maintenanceDataSource.initialize();

  try {
    await maintenanceDataSource.query(
      `CREATE DATABASE ${quoteIdentifier(databaseName)}`,
    );
  } finally {
    await maintenanceDataSource.destroy();
  }

  return databaseName;
};

export const dropTemporaryDatabase = async (
  databaseName: string,
): Promise<void> => {
  const maintenanceDataSource = createMaintenanceDataSource();

  await maintenanceDataSource.initialize();

  try {
    await maintenanceDataSource.query(
      `
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = $1 AND pid <> pg_backend_pid()
      `,
      [databaseName],
    );
    await maintenanceDataSource.query(
      `DROP DATABASE IF EXISTS ${quoteIdentifier(databaseName)}`,
    );
  } finally {
    await maintenanceDataSource.destroy();
  }
};
