const { chromium } = require('playwright');
const path = require('path');

/**
 * AVA SIEGE ENGINE v1.0
 * Purpose: Stress test the deployed AVA ecosystem (Frontend + Render Backend)
 * Targets: https://ava.launchableai.online/
 */

const TARGET_URL = 'https://ava.launchableai.online/';
const CONCURRENCY = 5; // Start with 5 simultaneous users
const TIMEOUT = 120000; // 2 minutes for full flow

async function runSingleUser(id) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();

    console.log(`[User ${id}] Starting mission...`);
    const startTime = Date.now();

    try {
        // 1. Landing & Navigation
        await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: TIMEOUT });
        console.log(`[User ${id}] Landing page loaded.`);

        // 2. Enter OS Playground
        await page.click('button:has-text("Access Playground")');
        await page.waitForURL('**/os', { timeout: TIMEOUT });
        console.log(`[User ${id}] Entered OS Playground.`);

        // 3. Initialize Mission
        await page.fill('input[placeholder*="What are you measuring"]', 'Stress Testing the Bureau Ecosystem');
        await page.click('button:has-text("Initialize Mission")');

        // Wait for streaming agents (Sentinel, Profiler, Architect)
        // We look for the final "Architect" phase or a specific success indicator
        await page.waitForSelector('text=MISSION_ID', { timeout: TIMEOUT });
        console.log(`[User ${id}] Mission Initialized successfully.`);

        // 4. Navigate to Field Interpreter
        await page.click('button:has-text("Field Interpreter")');
        await page.waitForSelector('text=Consolidate raw fieldwork', { timeout: TIMEOUT });
        console.log(`[User ${id}] Entered Field Interpreter.`);

        // 5. Upload Test CSV
        // Note: In a real 'siege', we'd need a valid path to a test CSV
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.click('text=Drop your fieldwork data here');
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(path.join(__dirname, 'test_survey.csv'));

        // 6. Wait for Infographic Dashboard
        await page.waitForSelector('[data-infographic-container]', { timeout: TIMEOUT });
        console.log(`[User ${id}] Infographic Dashboard rendered.`);

        // 7. Test PDF Export
        await page.click('button:has-text("DOWNLOAD INFOGRAPHIC PDF")');
        console.log(`[User ${id}] PDF Download triggered.`);

        const duration = (Date.now() - startTime) / 1000;
        console.log(`[User ${id}] SUCCESS in ${duration}s`);

    } catch (err) {
        console.error(`[User ${id}] FAILED: ${err.message}`);
    } finally {
        await browser.close();
    }
}

async function startSiege() {
    console.log(`--- AVA SIEGE STARTING ---`);
    console.log(`Target: ${TARGET_URL}`);
    console.log(`Concurrency: ${CONCURRENCY} users`);
    console.log(`--------------------------`);

    const users = [];
    for (let i = 1; i <= CONCURRENCY; i++) {
        users.push(runSingleUser(i));
    }

    await Promise.all(users);
    console.log(`--- SIEGE COMPLETE ---`);
}

startSiege();
