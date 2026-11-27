---
name: server-action
description: Add or change a data mutation in this repo the house way - zod schema, next-safe-action server action with the right auth client, cache invalidation, and a react-hook-form editor dialog that surfaces server errors. Use when adding create/update/delete behavior, an admin editor, or a form that saves data.
---

# Add a server action (+ form)

Follow `.claude/rules/data-layer.md` and `.claude/rules/security.md`.

## 1. Schema (`features/<f>/schemas.ts`)

```ts
export const thingSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
});
export type ThingInput = z.infer<typeof thingSchema>;
```

Messages are user-facing, in sentence case. Plain values the client needs
(enums, labels) go in `constants.ts`, not here.

## 2. Action (`features/<f>/actions.ts`, `"use server"`)

```ts
export const updateThing = adminActionClient // or authActionClient / actionClient
  .inputSchema(thingSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [row] = await db
      .update(Things)
      .set(parsedInput)
      .where(eq(Things.id, id))
      .returning();
    if (!row) throw new ActionError("That item no longer exists.");
    updateTag(THING_TAG);
    return row;
  });
```

- Choose the client by who may call it; ownership checks use `ctx.user`.
- `ActionError` for messages the user should read; other errors stay generic.
- Invalidate every cached read that shows this data (`updateTag`), or
  `router.refresh()` on the client for uncached server components.
- Images: upload in the browser via `uploadImageFile(file, folder)`; on
  replace call `deleteReplacedImage(oldUrl, newUrl)` server-side.

## 3. Form

Use `EditorDialog` + shadcn `Form` with react-hook-form:

```tsx
const form = useForm<ThingInput>({
  resolver: zodResolver(thingSchema),
  defaultValues,
});
const onValid = async (values: ThingInput) => {
  // Puts server field errors on the inputs; returns a message to show, or null
  const error = applyActionResult(form, await updateThing(values));
  if (error) return void toast.error(error);
  toast.success("Saved");
  onOpenChange(false);
};
```

Reuse `components/forms/` (`ImageUploadField`, `TagInput`, `DatePicker`,
`EditIconButton`). Admin-only dialogs are exported lazily from the feature's
`admin-dialogs.tsx` with `next/dynamic`.

## 4. Check

- Signed out / non-admin calls are rejected (the auth client throws).
- Invalid input shows field errors; the dialog stays open.
- Run the `verify` skill.
