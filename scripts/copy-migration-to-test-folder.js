/**
 * copies file from @/supabase/migrations/20240711063356_initial_schema.sql --> src/__tests__/supabase/migrations/20240711063356_initial_schema.sql
 */
const fs = require('fs-extra');
const path = require('path');

let sourcePath = path.join(__dirname, '../supabase/migrations');
let destPath = path.join(__dirname, '../src/__tests__/supabase/migrations');

async function copyDirectory() {
  try {
    await fs.copy(sourcePath, destPath);
    console.log('Directory copied successfully!');
  } catch (err) {
    console.error('Error copying directory:', err);
  }
}

copyDirectory();
