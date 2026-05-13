# Backup System

Automated daily backups run via GitHub Actions. Each run produces two archives and stores them in a private Cloudflare R2 bucket. A retention policy keeps the 7 most recent of each.

---

## What is backed up

| Archive | Contents | Stored under |
|---|---|---|
| `db-backup-YYYY-MM-DD-HH-mm.sql.gz` | Full PostgreSQL dump (plain SQL, gzip-compressed) | `backups/daily/db/` |
| `storage-backup-YYYY-MM-DD-HH-mm.zip` | All files from the app's R2 storage bucket | `backups/daily/storage/` |

Both archives land in a **separate, private** R2 bucket — not the same bucket that serves app uploads.

---

## Required GitHub Secrets

Add these in **GitHub → Repository → Settings → Secrets and variables → Actions → New repository secret**.

| Secret name | Where to find it |
|---|---|
| `DATABASE_URL` | Your Neon dashboard → Connection string (e.g. `postgresql://user:pass@host/db?sslmode=require`) |
| `R2_ACCOUNT_ID` | Cloudflare dashboard → R2 → Overview → right sidebar |
| `R2_ACCESS_KEY_ID` | R2 → Manage R2 API Tokens → Create API Token (Object Read & Write on both buckets) |
| `R2_SECRET_ACCESS_KEY` | Same token creation screen — shown only once |
| `R2_APP_BUCKET_NAME` | The name of the bucket that stores app uploads (e.g. `fitlife-media`) |
| `R2_BACKUP_BUCKET_NAME` | The name of the private backup bucket (e.g. `fitlife-backups`) |

### Creating the backup bucket

1. Go to Cloudflare dashboard → **R2 → Create bucket**
2. Name it (e.g. `fitlife-backups`)
3. **Do NOT enable public access** — this bucket must stay private
4. The API token used for `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` needs **Object Read & Write** on both `fitlife-media` (to read app files) and `fitlife-backups` (to write backups)

---

## How the workflow runs

**File:** `.github/workflows/project-backup.yml`

```
Schedule: 03:00 UTC every day  (cron: '0 3 * * *')
Runner:   ubuntu-latest
Timeout:  60 minutes
```

**Steps executed on each run:**

1. Generate a timestamp (`YYYY-MM-DD-HH-MM` in UTC)
2. Install PostgreSQL 16 client from the official PGDG apt repo
3. Run `pg_dump` against `DATABASE_URL` and pipe the output through `gzip`
4. Run `aws s3 sync` to download all files from the app bucket
5. Zip the downloaded files into a single archive
6. Upload both archives to the backup bucket
7. Prune backups older than the 7 most recent (for each type independently)
8. Print a summary

---

## How to run it manually

1. Go to **GitHub → Actions → Project Backup**
2. Click **Run workflow** (top right of the run list)
3. Select the branch (`main`) and click **Run workflow**

The run appears in the list within a few seconds. Click it to follow the live logs.

---

## How to restore the PostgreSQL database

### Download the backup file

From the Cloudflare R2 dashboard or via AWS CLI:

```bash
# Configure AWS CLI for R2 once
export AWS_ACCESS_KEY_ID=<R2_ACCESS_KEY_ID>
export AWS_SECRET_ACCESS_KEY=<R2_SECRET_ACCESS_KEY>
export R2_ENDPOINT=https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com

# Download a specific backup
aws s3 cp \
  "s3://fitlife-backups/backups/daily/db/db-backup-2026-05-12-03-00.sql.gz" \
  ./db-backup.sql.gz \
  --endpoint-url "$R2_ENDPOINT"
```

### List available backups

```bash
aws s3 ls "s3://fitlife-backups/backups/daily/db/" \
  --endpoint-url "$R2_ENDPOINT" \
  | sort -r
```

### Restore to a database

```bash
# Decompress and pipe directly into psql
gunzip -c db-backup.sql.gz | psql "$DATABASE_URL"
```

> **Warning:** This replays all SQL statements from the dump. For a full replacement, drop and re-create the target database first, or restore into a fresh database.

### Restore to a fresh Neon branch

1. In the Neon dashboard, create a new branch or new database
2. Copy its connection string
3. Run:
   ```bash
   gunzip -c db-backup.sql.gz | psql "postgresql://user:pass@host/newdb?sslmode=require"
   ```

---

## How to inspect and extract the storage backup

### List the contents of a storage archive

```bash
unzip -l storage-backup-2026-05-12-03-00.zip
```

### Extract to a local directory

```bash
unzip storage-backup-2026-05-12-03-00.zip -d restored-storage/
```

Files are stored inside the zip under the `storage-backup/` prefix, mirroring the R2 bucket structure. For example, a profile image stored in the bucket as `avatars/abc123.jpg` will appear at `storage-backup/avatars/abc123.jpg` after extraction.

### Re-upload a specific file to R2

```bash
aws s3 cp restored-storage/avatars/abc123.jpg \
  "s3://fitlife-media/avatars/abc123.jpg" \
  --endpoint-url "$R2_ENDPOINT"
```

---

## Retention policy

The workflow keeps the **7 most recent** backups of each type and automatically deletes the rest after every run. Backups are named with timestamps, so "most recent" is determined by lexicographic sort (which matches chronological order for `YYYY-MM-DD-HH-mm` filenames).

---

## Notes

- Backups run in a clean GitHub Actions VM — no application code is executed and no runtime logic is changed.
- Secrets are never printed to logs. GitHub Actions redacts all secret values automatically.
- If `DATABASE_URL` is unavailable, `pg_dump` will fail fast and the workflow will error — no partial backup is uploaded.
- If the app storage bucket is empty, the storage archive is created with an empty directory (valid zip, safe to ignore).
