# Copilot Instructions for kg-vis

- Keep changes small and focused on the requested feature.
- Use the existing `@/` alias for imports from `src/`.
- Prefer feature-first placement under `src/features/*` and shared utilities under `src/shared/*`.
- Do not mutate graph source payloads; derive new objects in transforms.
- Use strict TypeScript patterns already present in the codebase.
- Before finalizing code changes, run `npm run lint`, `npm run test`, and `npm run build`.
