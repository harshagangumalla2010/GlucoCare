import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function log(msg) {
  fs.writeSync(1, msg + '\n');
}

function errLog(msg) {
  fs.writeSync(2, msg + '\n');
}

log('[1/4] Starting internal verification...');

const indexPath = path.join(__dirname, 'index.html');
const bundlePath = path.join(__dirname, 'public', 'bundle.jsx');

if (!fs.existsSync(indexPath)) {
  errLog('Error: index.html not found!');
  process.exit(1);
}

if (!fs.existsSync(bundlePath)) {
  errLog('Error: public/bundle.jsx not found!');
  process.exit(1);
}

const indexContent = fs.readFileSync(indexPath, 'utf-8');
const bundleContent = fs.readFileSync(bundlePath, 'utf-8');

log(`[2/4] index.html size: ${indexContent.length} bytes`);
log(`[3/4] public/bundle.jsx size: ${bundleContent.length} bytes`);

const checks = [
  { name: 'Contains root element', test: indexContent.includes('id="root"') },
  { name: 'Contains GlucoCare title', test: indexContent.includes('GlucoCare') },
  { name: 'Contains React CDN', test: indexContent.includes('unpkg.com/react@18') },
  { name: 'Contains Babel Standalone', test: indexContent.includes('unpkg.com/@babel/standalone') },
  { name: 'Loads /bundle.jsx (Vite public asset)', test: indexContent.includes('src="/bundle.jsx"') },
  { name: 'Does NOT load /dist/bundle.jsx', test: !indexContent.includes('src="/dist/bundle.jsx"') },
  { name: 'Bundle has GlucoCareApp', test: bundleContent.includes('GlucoCareApp') },
  { name: 'Bundle has DashboardView', test: bundleContent.includes('DashboardView') },
  { name: 'Bundle has GlucoseTrackerView', test: bundleContent.includes('GlucoseTrackerView') },
  { name: 'Bundle has FoodDiaryView', test: bundleContent.includes('FoodDiaryView') },
  { name: 'Bundle has RemindersView', test: bundleContent.includes('RemindersView') },
  { name: 'Bundle has HealthReportsView', test: bundleContent.includes('HealthReportsView') },
  { name: 'Bundle has EmergencyModal', test: bundleContent.includes('EmergencyModal') },
  { name: 'Bundle has Rule of 15 Protocol', test: bundleContent.includes('Rule of 15') },
  { name: 'Bundle has Medical Safety Disclaimer', test: bundleContent.includes('Medical Disclaimer') }
];

let failed = 0;
for (const c of checks) {
  if (c.test) {
    log(`  ✓ ${c.name}`);
  } else {
    errLog(`  ✗ ${c.name} FAILED`);
    failed++;
  }
}

if (failed === 0) {
  log('\n[4/4] ALL 15 VERIFICATION CHECKS PASSED PERFECTLY! 🚀');
} else {
  process.exit(1);
}
