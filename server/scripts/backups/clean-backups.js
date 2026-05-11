/**
 * FitLife Backup Cleanup Script
 * --------------------------------
 * Removes .sql backup files older than MAX_AGE_DAYS from the backup directory.
 *
 * Why this is important:
 *   - In production, backups accumulate every day (or every hour).
 *   - Without cleanup, disk space fills up silently.
 *   - A retention policy (e.g. keep the last 7 days) balances safety and storage.
 *
 * Usage:
 *   cd server
 *   node scripts/backups/clean-backups.js
 *   # or via npm:
 *   npm run backup:clean
 *
 * To change retention, edit MAX_AGE_DAYS below.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ── Configuration ─────────────────────────────────────────────────────────────

// Delete backups older than this many days
const MAX_AGE_DAYS = 7;

const BACKUP_DIR = path.resolve(__dirname, '../../backups/database');
const MAX_AGE_MS = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

// ── Run ───────────────────────────────────────────────────────────────────────

console.log('[clean] ─────────────────────────────────────');
console.log('[clean] FitLife Backup Cleanup');
console.log(`[clean] Retention: ${MAX_AGE_DAYS} days`);
console.log('[clean] ─────────────────────────────────────');

if (!fs.existsSync(BACKUP_DIR)) {
  console.log('[clean] Backup directory does not exist. Nothing to clean.');
  process.exit(0);
}

const allFiles = fs.readdirSync(BACKUP_DIR).filter((f) => f.endsWith('.sql'));

if (allFiles.length === 0) {
  console.log('[clean] No backup files found. Nothing to clean.');
  process.exit(0);
}

const now = Date.now();
let removed = 0;
let kept = 0;

for (const file of allFiles) {
  const filepath = path.join(BACKUP_DIR, file);
  const stats = fs.statSync(filepath);
  const ageMs = now - stats.mtimeMs;
  const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));

  if (ageMs > MAX_AGE_MS) {
    fs.unlinkSync(filepath);
    console.log(`[clean] Removed: ${file}  (${ageDays} day(s) old)`);
    removed++;
  } else {
    console.log(`[clean] Kept:    ${file}  (${ageDays} day(s) old)`);
    kept++;
  }
}

console.log('[clean] ─────────────────────────────────────');
console.log(`[clean] Removed: ${removed} file(s)  |  Kept: ${kept} file(s)`);
console.log('[clean] ─────────────────────────────────────');
