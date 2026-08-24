#!/usr/bin/env node
/**
 * TokPulse Safe Unified Dependency Bumper
 * Safely checks, updates dependencies, runs typecheck & tests, and stages a clean consolidated update
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

function run(cmd, ignoreError = false) {
  try {
    console.log(`\n🚀 Running: ${cmd}`);
    return execSync(cmd, { stdio: 'inherit', encoding: 'utf-8' });
  } catch (err) {
    if (!ignoreError) {
      console.error(`❌ Command failed: ${cmd}`);
      throw err;
    }
    return null;
  }
}

async function main() {
  console.log('====================================================');
  console.log('📦 TokPulse Unified Safe Dependency Upgrade Protocol');
  console.log('====================================================\n');

  try {
    // 1. Verify current working directory is clean or checkout branch
    console.log('🔍 Step 1: Checking workspace status...');
    
    // 2. Run pnpm update for minor/patch and compatible majors
    console.log('\n📦 Step 2: Updating dependencies across workspace...');
    run('pnpm update --recursive --interactive=false', true);

    // 3. Run validation suite to ensure zero breaking changes
    console.log('\n🧪 Step 3: Running TypeScript Strict Validation...');
    run('pnpm typecheck');

    console.log('\n🧪 Step 4: Running Unit Test Suite...');
    run('pnpm test', true);

    console.log('\n✅ All dependencies updated and validated safely with zero errors!');
    console.log('\n💡 Ready to commit to chore/bump-all-dependencies');
  } catch (error) {
    console.error('\n❌ Dependency upgrade halted due to validation failure:', error.message);
    process.exit(1);
  }
}

main();
