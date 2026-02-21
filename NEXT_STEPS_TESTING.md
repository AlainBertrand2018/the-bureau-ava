# Stress Testing Status (Post-Reboot)

## Current Progress
- [x] Playwright Installed
- [x] Browser Binaries Installed
- [x] Basic Test Created (`frontend/e2e-tests/basic.spec.ts`)
- [x] Playwright Config Created (`frontend/playwright.config.ts`)
- [ ] Initial Baseline Test Passed (Failed last time due to slow build/timeout)

## Next Steps
1. Run `npm run dev` in the root and wait for both backend and frontend to be fully responsive.
2. Run `npx playwright test` in the `frontend` directory to confirm baseline connectivity.
3. Once baseline is green, expand `basic.spec.ts` to cover core flows:
    - User Login/Authentication (if applicable)
    - File Upload
    - Report Generation
    - Simulation Scenarios
4. Increase concurrency/load to stress test.

## Notes
- The machine was restarted due to slow performance/freezing. 
- Ensure `npm run dev` is running before attempting tests.
