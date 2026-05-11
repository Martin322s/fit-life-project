/**
 * FitLife Database Backup Script
 * --------------------------------
 * Why backups matter:
 *   - Disaster recovery: if the database is corrupted, deleted, or migrated,
 *     a backup lets you restore all user data quickly.
 *   - Data protection: prevents permanent loss caused by accidental writes,
 *     bugs, or a misconfigured migration.
 *   - Audit trail: a dated SQL file is a snapshot you can diff, inspect,
 *     or replay at any point in time.
 *
 * How it works:
 *   1. Reads DATABASE_URL from server/.env.local
 *   2. Tries pg_dump (the industry-standard PostgreSQL backup tool)
 *   3. Falls back to a pure Node.js export using the 'pg' package
 *   4. Saves a .sql file to server/backups/database/
 *
 * Usage:
 *   cd server
 *   node scripts/backups/backup-db.js
 *   # or via npm:
 *   npm run backup:db
 */

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ── Configuration ─────────────────────────────────────────────────────────────

// Load .env.local from the server root so DATABASE_URL is available
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;
const BACKUP_DIR = path.resolve(__dirname, '../../backups/database');

// ── Guards ────────────────────────────────────────────────────────────────────

if (!DATABASE_URL) {
  console.error('[backup] ERROR: DATABASE_URL is not set.');
  console.error('[backup] Add it to server/.env.local:');
  console.error('[backup]   DATABASE_URL=postgresql://user:pass@host/db');
  process.exit(1);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Builds a timestamp string like "2025-05-11-14-30" for the filename
function buildTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate()),
    pad(d.getHours()),
    pad(d.getMinutes()),
  ].join('-');
}

// Masks credentials in a connection string for safe logging
function maskUrl(url) {
  return url.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
}

// ── Ensure backup directory exists ───────────────────────────────────────────

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log(`[backup] Created directory: ${BACKUP_DIR}`);
}

const filename = `backup-${buildTimestamp()}.sql`;
const filepath = path.join(BACKUP_DIR, filename);

// ── Strategy 1: pg_dump ───────────────────────────────────────────────────────
// pg_dump is the official PostgreSQL backup tool. It produces a complete,
// reliable SQL dump including schema + data + sequences.
// Requires PostgreSQL client tools: https://www.postgresql.org/download/

function tryPgDump() {
  // Quick check — does pg_dump exist on this machine?
  try {
    execSync('pg_dump --version', { stdio: 'pipe', shell: true });
  } catch {
    return false;
  }

  console.log('[backup] pg_dump detected — running full backup...');

  try {
    // Single command string avoids the Node.js DEP0190 warning (args array + shell)
    execSync(
      `pg_dump "${DATABASE_URL}" --no-password --format=plain --file="${filepath}"`,
      { stdio: 'inherit', shell: true, env: { ...process.env } }
    );
    return true;
  } catch (err) {
    console.error('[backup] pg_dump failed:', err.message);
    return false;
  }
}

// ── Strategy 2: Node.js + pg package fallback ─────────────────────────────────
// Uses the 'pg' npm package to connect, read every table, and write
// INSERT statements. Not as complete as pg_dump (no indexes/constraints),
// but good enough for data backup and a capstone demo.

async function nodeJsExport() {
  let Client;
  try {
    ({ Client } = require('pg'));
  } catch {
    console.error('[backup] The "pg" package is missing.');
    console.error('[backup] Run:  npm install --save-dev pg');
    console.error('[backup] Then re-run:  npm run backup:db');
    process.exit(1);
  }

  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
  } catch (err) {
    console.error('[backup] Could not connect to database:', err.message);
    process.exit(1);
  }

  console.log(`[backup] Connected to: ${maskUrl(DATABASE_URL)}`);
  console.log('[backup] Exporting tables...');

  const lines = [
    `-- FitLife database backup`,
    `-- Generated: ${new Date().toISOString()}`,
    `-- Source:    ${maskUrl(DATABASE_URL)}`,
    `-- Strategy:  Node.js pg export (INSERT statements)`,
    '',
    `SET client_encoding = 'UTF8';`,
    `SET standard_conforming_strings = on;`,
    '',
  ];

  // Discover all user tables in the public schema
  const tablesResult = await client.query(
    `SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = 'public'
       AND table_type = 'BASE TABLE'
     ORDER BY table_name`
  );

  const tables = tablesResult.rows.map((r) => r.table_name);

  if (tables.length === 0) {
    console.warn('[backup] No tables found in the public schema.');
  } else {
    console.log(`[backup] Tables: ${tables.join(', ')}`);
  }

  for (const table of tables) {
    lines.push(`-- ────────────────────────────────────────`);
    lines.push(`-- Table: ${table}`);
    lines.push(`-- ────────────────────────────────────────`);

    const rows = await client.query(`SELECT * FROM "${table}"`);

    if (rows.rows.length === 0) {
      lines.push(`-- (empty table)`);
      lines.push('');
      console.log(`[backup]   ${table}: 0 rows`);
      continue;
    }

    const columns = rows.fields.map((f) => `"${f.name}"`).join(', ');

    for (const row of rows.rows) {
      const values = rows.fields.map((f) => {
        const val = row[f.name];
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number' || typeof val === 'boolean') return String(val);
        // Escape single quotes by doubling them (standard SQL)
        return `'${String(val).replace(/'/g, "''")}'`;
      });
      lines.push(`INSERT INTO "${table}" (${columns}) VALUES (${values.join(', ')});`);
    }

    lines.push('');
    console.log(`[backup]   ${table}: ${rows.rows.length} row(s)`);
  }

  await client.end();
  fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
}

// ── Entry point ───────────────────────────────────────────────────────────────

(async () => {
  console.log('[backup] ─────────────────────────────────────');
  console.log('[backup] FitLife Database Backup');
  console.log('[backup] ─────────────────────────────────────');
  console.log(`[backup] File: ${filename}`);

  const pgDumpSucceeded = tryPgDump();

  if (!pgDumpSucceeded) {
    console.log('[backup] pg_dump not available — using Node.js export.');
    console.log('[backup] Tip: install PostgreSQL tools for a full schema backup.');
    console.log('[backup]      https://www.postgresql.org/download/');
    await nodeJsExport();
  }

  const stats = fs.statSync(filepath);
  const sizeKB = (stats.size / 1024).toFixed(1);

  console.log('[backup] ─────────────────────────────────────');
  console.log(`[backup] Done!  ${filename}  (${sizeKB} KB)`);
  console.log(`[backup] Saved: ${filepath}`);
  console.log('[backup] ─────────────────────────────────────');
})();
