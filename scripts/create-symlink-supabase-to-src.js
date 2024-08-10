const fs = require('fs');
const path = require('path');

// Define the paths to the directories
const databaseDirPath = path.join(__dirname, '../supabase/migrations');
const testDirPath = path.join(
  __dirname,
  '../src/__tests__/supabase/migrations',
);

// Function to create a symbolic link
function createSymlink(source, destination) {
  fs.stat(destination, (err, stats) => {
    if (!err) {
      console.log(`Existing file or symlink at ${destination}:`);
      console.log(`- Is a symlink: ${stats.isSymbolicLink()}`);
      console.log(`- Is a file: ${stats.isFile()}`);
      console.log(`- Is a directory: ${stats.isDirectory()}`);
      console.log(`- Size: ${stats.size} bytes`);
      console.log(`- Last modified: ${stats.mtime}\n`);

      if (stats.isSymbolicLink() || stats.isDirectory()) {
        console.error(
          'Symlink or Directory already exists. Please remove before running this script.',
        );
      } else {
        console.error(
          `Error: ${destination} exists but is not a directory or symlink.\n`,
        );
      }
    } else if (err.code === 'ENOENT') {
      fs.symlink(source, destination, 'dir', symlinkErr => {
        if (symlinkErr) {
          console.error(`Error creating symlink: ${symlinkErr.message}\n`);
        } else {
          console.log(`Symlink created: ${destination} -> ${source}\n`);
        }
      });
    } else {
      console.error(`Error checking destination: ${err.message}\n`);
    }
  });
}

createSymlink(databaseDirPath, testDirPath);
