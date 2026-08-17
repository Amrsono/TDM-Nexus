import puppeteer from 'puppeteer';

(async () => {
  try {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    
    console.log("Navigating to app...");
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 30000 });
    
    console.log("Waiting for animations to settle...");
    await new Promise(r => setTimeout(r, 5000));
    
    console.log("Taking screenshot...");
    await page.screenshot({ path: 'actual_tdm_screenshot.png' });
    
    await browser.close();
    console.log("Screenshot saved to actual_tdm_screenshot.png");
  } catch (err) {
    console.error("Error taking screenshot:", err);
    process.exit(1);
  }
})();
