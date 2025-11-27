# Script Updates

## scripts/db.sh
- **Change**: Updated `start_db` function to use `docker compose` instead of `docker run`.
- **Reason**: The original script used `docker run` which created anonymous volumes, leading to data loss. Using `docker compose` ensures the named volume `db_pgdata` is used, persisting data across restarts.
