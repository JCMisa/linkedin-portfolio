---
paths:
  - "features/**/*.ts"
  - "features/**/actions/**"
  - "lib/**/*.ts"
  - "db/**/*.ts"
  - "app/api/**/*.ts"
---

# Data layer: reads, writes, validation

## Shape of a feature

| File                          | Runs on | Rules                                                                                                                  |
| ----------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------- |
| `schemas.ts`                  | both    | zod 4 schemas + inferred types. Shared by actions and react-hook-form (`zodResolver`).                                 |
| `constants.ts`                | both    | Plain values (enums, labels). **Client code imports values from here, not from `schemas.ts`**, which would bundle zod. |
| `queries.ts`                  | server  | Starts with `import "server-only"`. Drizzle reads only.                                                                |
| `actions.ts` / `actions/*.ts` | server  | `"use server"`. Every export is a next-safe-action action.                                                             |
| `hooks.ts`                    | client  | TanStack Query hooks that call `app/api/*` routes via `lib/fetch-json.ts`.                                             |

## Writes (server actions)

```ts
export const updateThing = adminActionClient
  .inputSchema(thingSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db
      .update(Things)
      .set(parsedInput)
      .where(eq(Things.id, parsedInput.id));
    updateTag(THING_TAG); // invalidate cached reads
    return { id: parsedInput.id };
  });
```

- Pick the client by who may call it: `actionClient` (public), `authActionClient`
  (signed in, `ctx.user`), `adminActionClient` (admin/owner).
- Ownership checks use `ctx.user`, never an id from the input.
- Throw `ActionError` (`lib/errors.ts`) for messages the user should see;
  anything else becomes a generic error (details are logged server-side).
- In forms, apply results with `applyActionResult(form, result)`
  (`lib/form-errors.ts`) so server field errors land on the right inputs.

## Reads

- Server components call `queries.ts` directly. Wrap per-request duplicates
  in React `cache()` (e.g. `getProjectById` is shared by `generateMetadata` and
  the page).
- Cross-request caching: `unstable_cache(fn, key, { revalidate, tags })` +
  `updateTag(tag)` in the mutating action. Don't introduce `"use cache"` until
  `cacheComponents` is adopted project-wide.
- Avoid N+1: the feed uses one SQL query with correlated subqueries
  (`getProjectsPage`); follow that pattern for counts/flags per row.
- Client reads go through `app/api/*` route handlers + TanStack Query. Pass
  server-rendered data as `initialData` only when the query key matches what
  the server fetched (see `useProjectsFeed`).
- URL-driven filters use nuqs (`features/projects/use-project-filters.ts`).

## Database (Drizzle + Neon)

- Schema in `db/schema.ts`, relations in `db/relations.ts`, columns camelCase.
- Change flow: edit schema → `npm run db:generate` → review the SQL in
  `db/migrations/` → the owner runs `npm run db:migrate`. Never edit an
  applied migration; never run migrate/push yourself.
- Validate route params before querying (e.g. `z.uuid()` for project ids) and
  `notFound()` on invalid/missing rows.

## Route handlers (`app/api`)

- Validate the body/query with zod; return `{ error }` with a proper status.
- Check the session in the handler (`getSessionUser()` / `auth()`), even if
  `proxy.ts` also protects the path.
- Never return other users' emails or private fields.
