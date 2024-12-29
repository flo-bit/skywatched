import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Database, SQLQueryBindings } from 'bun:sqlite';
import { getFormattedDetails } from './tmdb';
import { getAllRated, getProfile } from './atp';

const litefsDir = process.env.NODE_ENV === 'production' ? '/var/lib/litefs' : './litefs';
const litefsPath = join(litefsDir, 'db.sqlite');

if (!existsSync(litefsDir)) {
  console.error('Unable to reach LiteFS directory at', litefsDir);
  process.exit(1);
}

const db = new Database(litefsPath);

type MainRecord = {
  uri: string;
  cid: string;

  author: {
    did: string;
    handle: string;
    displayName?: string;
    avatar?: string;
  };

  indexedAt: string;
  createdAt: string;
  updatedAt: string;

  record: {
    $type: string;
    item: {
      ref: string;
      value: string;
    };
    note?: {
      value: string;
      createdAt: string;
      updatedAt: string;
    };
    rating?: {
      value: number;
      createdAt: string;
    };
    metadata?: {
      title: string;
      poster_path: string;
      backdrop_path: string;
      tagline: string;
      overview: string;
      genres: string[];
      release_date?: string;
    };
    crosspost?: {
      uri: string;
      likes?: number;
      reposts?: number;
      replies?: number;
    };

    likes?: number;
  }
};

type Record = {
  uri: string;
  cid: string;

  author_did: string;
  author_handle: string;
  author_displayName: string;
  author_avatar: string;

  indexedAt: string;
  createdAt: string;
  updatedAt: string;

  record_type: string;
  record_item_ref: string;
  record_item_value: string;

  record_note_value?: string;
  record_note_createdAt?: string;
  record_note_updatedAt?: string;

  record_rating_value?: number;
  record_rating_createdAt?: string;

  record_metadata_title?: string;
  record_metadata_poster_path?: string;
  record_metadata_backdrop_path?: string;
  record_metadata_tagline?: string;
  record_metadata_overview?: string;
  record_metadata_genres?: string;
  record_metadata_release_date?: string;

  record_crosspost_uri?: string;
  record_crosspost_likes?: number;
  record_crosspost_reposts?: number;
  record_crosspost_replies?: number;

  record_likes?: number;
};

type LikeRecord = {
  uri: string;
  author_did: string;
  subject_cid: string;
  subject_uri: string;
  createdAt: string;
};

function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS records (
      uri TEXT PRIMARY KEY,
      cid TEXT NOT NULL,

      author_did TEXT NOT NULL,
      author_handle TEXT NOT NULL,
      author_displayName TEXT,
      author_avatar TEXT,

      indexedAt TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,

      record_type TEXT NOT NULL,
      record_item_ref TEXT NOT NULL,
      record_item_value TEXT NOT NULL,

      record_note_value TEXT,
      record_note_createdAt TEXT,
      record_note_updatedAt TEXT,

      record_rating_value INTEGER,
      record_rating_createdAt TEXT,

      record_metadata_title TEXT,
      record_metadata_poster_path TEXT,
      record_metadata_backdrop_path TEXT,
      record_metadata_tagline TEXT,
      record_metadata_overview TEXT,
      record_metadata_genres TEXT,
      record_metadata_release_date TEXT,

      record_crosspost_uri TEXT,
      record_crosspost_likes INTEGER,
      record_crosspost_reposts INTEGER,
      record_crosspost_replies INTEGER,

      record_likes INTEGER
    );

    CREATE INDEX IF NOT EXISTS idx_uri ON records (uri);
    CREATE INDEX IF NOT EXISTS idx_author_did ON records (author_did);
    CREATE INDEX IF NOT EXISTS idx_indexedAt ON records (indexedAt);
    CREATE INDEX IF NOT EXISTS idx_createdAt ON records (createdAt);
    CREATE INDEX IF NOT EXISTS idx_updatedAt ON records (updatedAt);
    CREATE INDEX IF NOT EXISTS idx_item_ref_value ON records (record_item_ref, record_item_value);
    CREATE INDEX IF NOT EXISTS idx_crosspost_uri ON records (record_crosspost_uri);
    CREATE INDEX IF NOT EXISTS idx_likes ON records (record_likes);
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS latest_indexedAt (
      indexedAt TEXT PRIMARY KEY
    );

    CREATE INDEX IF NOT EXISTS idx_indexedAt ON latest_indexedAt (indexedAt);
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS likes (
      uri TEXT PRIMARY KEY,
      author_did TEXT NOT NULL,
      subject_cid TEXT NOT NULL,
      subject_uri TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_uri ON likes (uri);
    CREATE INDEX IF NOT EXISTS idx_author_did ON likes (author_did);
    CREATE INDEX IF NOT EXISTS idx_subject_uri ON likes (subject_uri);
    CREATE INDEX IF NOT EXISTS idx_createdAt ON likes (createdAt);
  `);
}

// Function to get the latest timestamp (either creation or update)
export function getLatestTimestamp(): string | null {
  const row = db.query('SELECT MAX(indexedAt) AS latest FROM latest_indexedAt;').get() as { latest: string } | undefined;
  return row?.latest ?? null;
}

export function setLatestTimestamp(indexedAt: string): void {
  db.query('DELETE FROM latest_indexedAt').run();
  db.query('INSERT OR REPLACE INTO latest_indexedAt (indexedAt) VALUES (?)').run(indexedAt);
}

export function getRecord(uri: string): MainRecord | null {
  const row = db.query('SELECT * FROM records WHERE uri = ?').get(uri) as Record | undefined;
  return row ? transformRecord(row) : null;
}

export function getAuthorDids(): string[] {
  const rows = db.query('SELECT DISTINCT author_did FROM records').all() as { author_did: string }[];
  return rows.map(row => row.author_did);
}

export function createRecord(record: MainRecord): void {
  const sql = `
    INSERT INTO records (
      uri, cid, 
      
      author_did, author_handle, author_displayName, author_avatar, 
      
      indexedAt, createdAt, updatedAt,
      
      record_type, 
      
      record_item_ref, record_item_value,
      
      record_note_value, record_note_createdAt, record_note_updatedAt,
      
      record_rating_value, record_rating_createdAt,
      
      record_metadata_title, record_metadata_poster_path, record_metadata_backdrop_path, record_metadata_tagline, record_metadata_overview, record_metadata_genres, record_metadata_release_date,
      
      record_crosspost_uri, record_crosspost_likes, record_crosspost_reposts, record_crosspost_replies
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  const params = [
      record.uri, record.cid,
      record.author.did, record.author.handle, record.author.displayName, record.author.avatar,
      record.indexedAt, record.createdAt, record.updatedAt,
      record.record.$type,
      record.record.item.ref, record.record.item.value,
      record.record.note?.value ?? null, record.record.note?.createdAt ?? null, record.record.note?.updatedAt ?? null,
      record.record.rating?.value ?? null, record.record.rating?.createdAt ?? null,

      record.record.metadata?.title ?? null, record.record.metadata?.poster_path ?? null, record.record.metadata?.backdrop_path ?? null, 
      record.record.metadata?.tagline ?? null, record.record.metadata?.overview ?? null, record.record.metadata?.genres?.join(',') ?? null, 
      record.record.metadata?.release_date ?? null,

      record.record.crosspost?.uri ?? null,
      record.record.crosspost?.likes ?? null,
      record.record.crosspost?.reposts ?? null,
      record.record.crosspost?.replies ?? null
  ];
  db.query(sql).run(...params as SQLQueryBindings[]);
}

export function transformRecord(record: Record): MainRecord {
  return {
    uri: record.uri,
    cid: record.cid,
    indexedAt: record.indexedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    author: {
      did: record.author_did,
      handle: record.author_handle,
      displayName: record.author_displayName,
      avatar: record.author_avatar,
    },
    record: {
      $type: record.record_type,
      item: {
        ref: record.record_item_ref,
        value: record.record_item_value,
      },
      note: record.record_note_value ? {
        value: record.record_note_value,
        createdAt: record.record_note_createdAt ?? new Date().toISOString(),
        updatedAt: record.record_note_updatedAt ?? new Date().toISOString(),
      } : undefined,
      rating: record.record_rating_value ? {
        value: record.record_rating_value,
        createdAt: record.record_rating_createdAt ?? new Date().toISOString(),
      } : undefined,
      metadata: {
        title: record.record_metadata_title ?? '',
        poster_path: record.record_metadata_poster_path ?? '',
        backdrop_path: record.record_metadata_backdrop_path ?? '',
        tagline: record.record_metadata_tagline ?? '',
        overview: record.record_metadata_overview ?? '',
        genres: record.record_metadata_genres?.split(',') ?? [],
        release_date: record.record_metadata_release_date ?? '',
      },
      likes: record.record_likes ?? 0,
    }
  };
}

// Function to get the most recent created records with pagination
export function getMostRecentRecords(limit: number = 100, cursor: string | null = null): MainRecord[] {
  let sql = 'SELECT * FROM records WHERE 1=1';
  const params: (string | number)[] = [];

  if (cursor) {
    sql += ' AND createdAt < ?';
    params.push(cursor);
  }

  sql += ' ORDER BY createdAt DESC LIMIT ?';
  params.push(limit);

  const rows = db.query(sql).all(...params) as Record[];
  return rows.map(row => transformRecord(row));
}

// // Function to update a record
// export function updateRecord(uri: string, updates: Partial<MainRecord>): void {
//   const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
//   const values = Object.values(updates);
//   const sql = `UPDATE records SET ${fields} WHERE uri = ?`;
//   db.query(sql).run(...values as SQLQueryBindings[], uri);
// }

// Function to get the most recent records for a specific user
export function getRecentRecordsByUser(user_did: string, limit: number = 100, cursor: string | null = null): MainRecord[] {
  let sql = 'SELECT * FROM records WHERE author_did = ?';
  const params: (string | number)[] = [user_did];

  if (cursor) {
    sql += ' AND createdAt < ?';
    params.push(cursor);
  }

  sql += ' ORDER BY createdAt DESC LIMIT ?';
  params.push(limit);

  const rows = db.query(sql).all(...params) as Record[];
  return rows.map(row => transformRecord(row));
}

// Function to get the most recent records for a specific item ref and value with pagination
export function getRecentRecordsByItemRef(item_ref: string, item_value: string, limit: number = 100, cursor: string | null = null): MainRecord[] {
  let sql = 'SELECT * FROM records WHERE record_item_ref = ? AND record_item_value = ?';
  const params: (string | number)[] = [item_ref, item_value];

  if (cursor) {
    sql += ' AND createdAt < ?';
    params.push(cursor);
  }

  sql += ' ORDER BY createdAt DESC LIMIT ?';
  params.push(limit);

  const rows = db.query(sql).all(...params) as Record[];
  return rows.map(row => transformRecord(row));
}

// Function to delete a record
// export function deleteRecord(uri: string): void {
//   const sql = 'DELETE FROM records WHERE uri = ?';
//   db.query(sql).run(uri);
// }

export function deleteAllByUser(user_did: string): void {
  const sql = 'DELETE FROM records WHERE author_did = ?';
  db.query(sql).run(user_did);
}

export function deleteAllRecords(): void {
  const sql = 'DELETE FROM records';
  db.query(sql).run();
}

export function recreateTables() {
  db.run('DROP TABLE IF EXISTS records');
  db.run('DROP TABLE IF EXISTS latest_indexedAt');
  db.run('DROP TABLE IF EXISTS likes');

  // create the tables again
  createTables();
}

export async function backfillUserIfNecessary(did: string): Promise<void> {
  // check if at least one record exists for this user
  const records = getRecentRecordsByUser(did, 1);
  if(records.length !== 0) return;

  const items = await getAllRated({ did });
  const profile = await getProfile({ did });
  
  for(const item of items) {
    if(item.value.item.ref !== 'tmdb:s' && item.value.item.ref !== 'tmdb:m') {
      continue;
    }

    const metadata = await getFormattedDetails(item.value.item.value, item.value.item.ref);

    createRecord({
      uri: item.uri,
      cid: item.cid,
      author: {
        did: did,
        handle: profile.handle,
        displayName: profile.displayName,
        avatar: profile.avatar,
      },
      indexedAt: item.value.note?.createdAt ?? item.value.rating?.createdAt ?? new Date().toISOString(),
      createdAt: item.value.note?.createdAt ?? item.value.rating?.createdAt ?? new Date().toISOString(),
      updatedAt: item.value.note?.updatedAt ?? item.value.rating?.createdAt ?? new Date().toISOString(),
      record: {
        $type: item.value.$type,
        item: item.value.item,
        rating: item.value.rating,
        note: item.value.note,
        metadata,
      }
    });
  }
}

export async function saveLikeToDatabase(json: LikeRecord) {
  // first check if the like already exists
  const existingLike = db.query('SELECT * FROM likes WHERE author_did = ? AND subject_uri = ?').get(json.author_did, json.subject_uri);
  if(existingLike) return;

  // check if the record exists
  const record = getRecord(json.subject_uri);
  if(!record) return;

  // save the like to the database
  const sql = 'INSERT INTO likes (uri, author_did, subject_cid, subject_uri, createdAt) VALUES (?, ?, ?, ?, ?)';
  db.query(sql).run(json.uri, json.author_did, json.subject_cid, json.subject_uri, json.createdAt);

  // update the record with the new like count
  const newLikes = record.record.likes ? record.record.likes + 1 : 1;
  db.query('UPDATE records SET record_likes = ? WHERE uri = ?').run(newLikes, json.subject_uri);
}

export { db, MainRecord };
