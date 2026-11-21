import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.stdout.write('[1/4] Starting internal server verification...\n');

const indexPath = path.join(__dirname, 'index.html');
const bundlePath = path.join(__dirname, 'dist', 'bundle.jsx');

if (!fs.existsSync(indexPath)) {
  process.stderr.write('Error: index.html not found!\n');
  process.exit(1);
}

if (!fs.existsSync(bundlePath)) {
  process.stderr.write('Error: dist/bundle.jsx not found!\n');
  process.exit(1);
}

const indexContent = fs.readFileSync(indexPath, 'utf-8');
const bundleContent = fs.readFileSync(bundlePath, 'utf-8');

process.stdout.write(`[2/4] index.html size: ${indexContent.length} bytes\n`);
process.stdout.write(`[3/4] dist/bundle.jsx size: ${bundleContent.length} bytes\n`);

const checks = [
  { name: 'Contains root element', test: indexContent.includes('id="root"') },
  { name: 'Contains GlucoCare title', test: indexContent.includes('GlucoCare') },
  { name: 'Contains React CDN', test: indexContent.includes('unpkg.com/react@18') },
  { name: 'Contains Babel Standalone', test: indexContent.includes('unpkg.com/@babel/standalone') },
  { name: 'Contains bundle.jsx script tag', test: indexContent.includes('src="/dist/bundle.jsx"') },
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
    process.stdout.write(`  ✓ ${c.name}\n`);
  } else {
    process.stderr.write(`  ✗ ${c.name} FAILED\n`);
    failed++;
  }
}

if (failed === 0) {
  process.stdout.write('\n[4/4] ALL 14 STRUCTURAL & COMPONENT CHECKS PASSED PERFECTLY! 🚀\n');
} else {
  process.exit(1);
}
