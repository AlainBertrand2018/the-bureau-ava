# SOB Project Development Protocol (Golden State)

## 1. The "Golden State" Principle
**Current Status:** The codebase (as of commit `54a1086`) is considered the **Golden State**. It is stable, functional, and bug-free regarding core navigation and report generation.

**Rule:** The core engine and existing working features are **OFF-LIMITS** for modification unless explicitly authorized for a critical bug fix. We must not regress from this state.

## 2. Non-Destructive Development
*   **Additive Only:** All new features, modules, or pages must be created as **new** files or components. Do not modify existing files to "squeeze in" new functionality.
*   **Isolation First:** Develop new features in isolation (e.g., a separate route or a standalone component) and verify they work 100% *before* integrating them into the main application flow.
*   **No "Ninja" Edits:** Do not make "quick fixes" or "minute additions" to core files (like `LabShell.tsx`, `MissionContext.tsx`, etc.) while working on something else. If a core file needs a change, it requires a dedicated task and explicit user approval.

## 3. Separation of Concerns (UI vs. Logic)
*   **Visuals $\neq$ Logic:** When asked to update styles (CSS, Tailwind), **NEVER** touch the component's logic, state, or hooks.
*   **Strict Styling Boundaries:** If a visual change requires a structural change, create a wrapper component rather than rewriting the existing one.

## 4. Defensive Coding Standards
*   **Hook Discipline:** All React Hooks (`useState`, `useEffect`, `useCallback`, etc.) must be declared at the very top of the component, **unconditionally**. Never place hooks after a conditional `return`.
*   **Null-Safety:** All data access (e.g., `mission.config.target_country`) must be guarded. Always assume data might be missing and provide a safe fallback UI instead of crashing.
*   **Type Safety:** Strictly adhere to TypeScript interfaces. Do not use `any` unless absolutely unavoidable.

## 5. Deployment & Verification
*   **Run the Build:** Before confirming any task is complete, run `npm run build` locally to catch any type errors or build failures.
*   **Console Check:** ensure no "React Hook order" or "Runtime Error" messages appear in the browser console during standard usage.

---
**Signed:** Antigravity & User
**Date:** February 18, 2026
