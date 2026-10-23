# Agent notes

## Component modules

Name a component file after the component. Do not use `index.tsx` as the component entry.

```
src/features/map/header/FluiHeader.tsx
src/features/map/HomeMapScreen.tsx
src/features/map/search/Search.tsx
src/features/map/search/Search.types.ts
src/features/map/search/Search.styles.ts
src/features/map/search/Search.utils.ts
src/hooks/useSearch.ts
src/context/SearchContext.tsx
```

- `Component.tsx` is the component.
- `Component.types.ts` sits beside it and holds that component's types.
- `Component.styles.ts` sits beside it when the component has its own styles.
- Hooks live in `src/hooks`. Create that folder when the repo does not have one.
- React context lives in `src/context`. Create that folder when the repo does not have one.

## Tests

NEVER add tests. Do not create test files, test cases, or test-only helpers.
