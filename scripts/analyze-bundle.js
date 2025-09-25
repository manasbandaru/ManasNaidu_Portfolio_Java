#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔍 Analyzing bundle size...\n');

// Build the project
try {
  console.log('Building project...');
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Analyze bundle sizes
const distPath = 'dist';
if (!existsSync(distPath)) {
  console.error('❌ Dist folder not found');
  process.exit(1);
}

// Get file sizes
try {
  const output = execSync('du -sh dist/assets/js/* dist/assets/*.css 2>/dev/null || true', { encoding: 'utf8' });
  
  console.log('\n📊 Bundle Analysis:');
  console.log('==================');
  
  if (output.trim()) {
    const lines = output.trim().split('\n');
    lines.forEach(line => {
      const [size, file] = line.split('\t');
      const filename = file.split('/').pop();
      console.log(`${size.padStart(8)} - ${filename}`);
    });
  }
  
  // Check total size
  const totalOutput = execSync('du -sh dist/', { encoding: 'utf8' });
  const totalSize = totalOutput.split('\t')[0];
  console.log(`\n📦 Total bundle size: ${totalSize}`);
  
  // Performance recommendations
  console.log('\n💡 Performance Recommendations:');
  console.log('================================');
  
  const jsFiles = execSync('find dist/assets/js -name "*.js" -exec wc -c {} + 2>/dev/null || echo "0 total"', { encoding: 'utf8' });
  const totalJsSize = parseInt(jsFiles.split('\n').pop().split(' ')[0]) || 0;
  
  if (totalJsSize > 1000000) { // 1MB
    console.log('⚠️  Large JavaScript bundle detected (>1MB)');
    console.log('   Consider additional code splitting');
  } else {
    console.log('✅ JavaScript bundle size is optimal');
  }
  
  console.log('\n🚀 Deployment ready!');
  
} catch (error) {
  console.error('❌ Analysis failed:', error.message);
}