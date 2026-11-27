---
name: db-change
description: Change the Neon Postgres schema safely with Drizzle - edit db/schema.ts, generate and review a migration, and hand the migrate step to the owner. Use when adding/removing tables, columns, indexes or relations, or when a feature needs new stored data.
---

# Database schema change

1. **Edit** `db/schema.ts` (camelCase columns; `.notNull()` and defaults
   explicit; foreign keys with an intentional `onDelete`). Add relations in
   `db/relations.ts` when you'll query with `with:`.
2. **Plan for existing rows.** A new `NOT NULL` column needs a default or a
   backfill step; renames are drop+add to Drizzle unless written by hand. If
   data could be lost, stop and ask the owner first.
3. **Generate:** `npm run db:generate`. Open the new SQL file in
   `db/migrations/` and read it: check for unexpected `DROP`s, type casts
   and locking operations on large tables.
4. **Update code** that reads/writes the table: zod schemas, queries,
   actions, types derived with `InferSelectModel`.
5. **Do not run** `npm run db:migrate` or `db:push` yourself. Tell the owner
   the exact command and what the migration does; they apply it.
6. After they confirm it applied, run the `verify` skill.

Never edit a migration that has already been applied. Fix forward with a new
migration instead.
