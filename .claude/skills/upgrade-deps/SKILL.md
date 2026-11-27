---
name: upgrade-deps
description: Upgrade npm dependencies to their latest stable versions without --force or --legacy-peer-deps - tiered same-major then major upgrades, peer-conflict root-causing, changelog review against actual usage, and bundle/behavior verification. Use when asked to update packages, fix peer dependency conflicts, or check what's outdated.
---

# Upgrade dependencies

Hard rule: never `--force` or `--legacy-peer-deps`. A peer conflict means find
the cause, or hold the package back and say why.

1. **Survey:** `npm outdated`, `npm ls <pkg>` for anything marked `invalid`.
2. **Root-cause conflicts.** `npm view <pkg>@<version> peerDependencies` for
   both sides. Usually a newer version of the _dependent_ package widens the
   range (e.g. `eslint-config-next` 16.4 fixed the TypeScript 6 conflict).
3. **Tier A, same major:** pin-exact packages (`next`, `react`, `react-dom`,
   `eslint-config-next`) with `npm install --save-exact pkg@x.y.z`; then
   `npm update`. Run the `verify` skill.
4. **Tier B, majors, one package (or tight family) at a time:**
   - `grep` how the repo uses it; the usage surface is usually small.
   - Read the changelog/migration guide for those exact APIs.
   - Install, typecheck, then fix what changed. Watch for behavior changes
     types don't catch (return values, defaults, runtime requirements).
5. **Hold back** a major when its ecosystem isn't ready (check peers of the
   plugins that depend on it). Currently held: ESLint 10 (eslint-plugin-react
   / import / jsx-a11y support ≤9), TypeScript 7 (typescript-eslint <6.1),
   `@types/node` newer than the Node runtime (24.x).
6. **Runtime requirements:** if a package needs a newer Node, update
   `engines.node` and tell the owner to match the Vercel setting.
7. **Verify** with the `verify` skill, including the bundle check: new
   versions can pull extra code into client bundles.
8. **Report:** a table of package → old → new → code change needed, the held
   packages with reasons, and any `npm audit` findings that can't be fixed
   without force.
