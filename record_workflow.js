import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import fs from 'fs';

const URL = 'https://tdm-nexus.vercel.app/';

const phases = [
  { name: 'Funnel & Reviewing', text: 'Phase 1: Project Funnel - Reviewing initial requests.' },
  { name: 'Analysing & PI Readiness', text: 'Phase 2: Analysing requirements and PI readiness.' },
  { name: 'Finances & Approvals', text: 'Phase 3: Setting budget allocations and approvals.' },
  { name: 'Implementing & Build', text: 'Phase 4: Squad implementation and milestone tracking.' },
  { name: 'Testing & Quality', text: 'Phase 5: Monitoring SIT passes and defects.' },
  { name: 'Release Planning & Gates', text: 'Phase 6: Evaluating governance gates for release.' },
  { name: 'Walkthrough Wizard', text: 'Phase 7: Step-by-step guidance for TDM workflows.' },
  { name: 'Release & Governance', text: 'Phase 8: Final release go/no-go and risk assessment.' },
  { name: 'Go-Live & ELS', text: 'Phase 9: Post-launch hypercare and ELS support.' },
  { name: 'Digital POAP', text: 'Phase 10: Generating the Plan on a Page (POAP).' },
  { name: 'POAP Slide Builder', text: 'Phase 11: Exporting POAP presentation decks.' }
];

async function showSubtitle(page, text, durationMs = 3000) {
  await page.evaluate((subText) => {
    let sub = document.getElementById('puppeteer-subtitle-overlay');
    if (!sub) {
      sub = document.createElement('div');
      sub.id = 'puppeteer-subtitle-overlay';
      sub.style.position = 'fixed';
      sub.style.bottom = '50px';
      sub.style.left = '50%';
      sub.style.transform = 'translateX(-50%)';
      sub.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      sub.style.color = '#fff';
      sub.style.padding = '15px 30px';
      sub.style.borderRadius = '10px';
      sub.style.fontSize = '24px';
      sub.style.fontFamily = 'monospace';
      sub.style.zIndex = '999999';
      sub.style.textAlign = 'center';
      sub.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
      sub.style.border = '1px solid #444';
      sub.style.transition = 'opacity 0.3s';
      document.body.appendChild(sub);
    }
    sub.innerText = subText;
    sub.style.opacity = '1';
  }, text);

  // Wait for the duration
  await new Promise(r => setTimeout(r, durationMs));
  
  // Hide subtitle smoothly before next
  await page.evaluate(() => {
    const sub = document.getElementById('puppeteer-subtitle-overlay');
    if (sub) {
      sub.style.opacity = '0';
    }
  });
  await new Promise(r => setTimeout(r, 300));
}

(async () => {
  console.log("Launching browser...");
  // Use a standard viewport size (16:9)
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: { width: 1920, height: 1080 }
  });
  const page = await browser.newPage();
  
  const recorder = new PuppeteerScreenRecorder(page, {
    fps: 30,
    videoFrame: { width: 1920, height: 1080 },
    videoCrf: 18,
    videoCodec: 'libx264',
    videoPreset: 'ultrafast',
    videoBitrate: 1000,
    autopad: { color: 'black' }
  });

  console.log(`Navigating to ${URL}...`);
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });

  console.log("Starting video recording...");
  await recorder.start('./tdm_workflow.mp4');

  // Let initial animations settle
  await showSubtitle(page, "Technical Delivery Manager (TDM) Nexus - Workflow Overview", 4000);

  for (const phase of phases) {
    console.log(`Navigating to phase: ${phase.name}`);
    
    // Attempt to click the nav item by finding its span text
    await page.evaluate((phaseName) => {
      const items = Array.from(document.querySelectorAll('.nav-item span'));
      const target = items.find(el => el.textContent === phaseName);
      if (target) {
        // If mobile menu is open or needed, it might be hidden, but we have 1920x1080 so sidebar is open
        target.click();
      } else {
         console.warn("Could not find phase: ", phaseName);
      }
    }, phase.name);

    // Give it a moment to render the new view
    await new Promise(r => setTimeout(r, 1000));
    
    // Show subtitle and wait
    await showSubtitle(page, phase.text, 4000);
  }

  console.log("Finishing recording...");
  await showSubtitle(page, "Export project data and presentations with one click.", 4000);
  
  await recorder.stop();
  await browser.close();
  console.log("Recording saved to tdm_workflow.mp4");
})();
