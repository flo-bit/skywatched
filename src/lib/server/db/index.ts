import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN });
export const db = drizzle(client, { schema: schema });

client.execute(`CREATE TABLE IF NOT EXISTS auth_state (
    key TEXT PRIMARY KEY UNIQUE,
    state TEXT NOT NULL
    );`);

client.execute(`CREATE TABLE IF NOT EXISTS auth_session (
    key TEXT PRIMARY KEY UNIQUE,
    session TEXT NOT NULL
    );`);
