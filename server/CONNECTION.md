# DB connection notes

This project uses `pg` and reads configuration from `.env`. For Aiven (managed PostgreSQL), connect using SSL.

Environment variables to set in `.env` (recommended):
- `DB_HOST` — host address
- `DB_PORT` — port number
- `DB_NAME` — database name
- `DB_USER` — database user
- `DB_PASSWORD` — password
- `DB_SSL=true` — enable SSL for Aiven
- `DB_SSL_REJECT_UNAUTHORIZED=false` — (dev/test only) skip certificate verification
- `DB_SSL_CA` — path to CA cert file or literal PEM text (for production set to the Aiven CA)

Quick steps:
1. In Aiven console, whitelist your client IP if required.
2. Download the Aiven CA certificate and set `DB_SSL_CA` to its file path, then set `DB_SSL_REJECT_UNAUTHORIZED=true` for secure verification.
3. In pgAdmin, enable SSL and supply the CA file under the SSL tab (or use `require`/`verify-ca`/`verify-full`).
4. If you need to test quickly, set `DB_SSL_REJECT_UNAUTHORIZED=false` to bypass certificate validation (not recommended for production).

Debugging tips:
- If you see `no pg_hba.conf entry for host` with `no encryption`, the client attempted a non-SSL connection — enable `DB_SSL=true`.
- If you see `certificate is not yet valid` or `self signed certificate`, use `DB_SSL_REJECT_UNAUTHORIZED=false` or provide the CA via `DB_SSL_CA`.
- Make sure `.env` values use the correct Aiven username (often `avnadmin`) and password.

Test with the included script:
```powershell
$env:DB_SSL='true'; $env:DB_SSL_REJECT_UNAUTHORIZED='false'; cd server; node test-db.js
```

If you want me to add automated tests or help set up secure CA cert verification, tell me and I’ll add it.
