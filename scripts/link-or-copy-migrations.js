const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '../supabase/migrations');
const destination = path.join(
  __dirname,
  '../src/__tests__/supabase/migrations',
);

linkOrCopyMigrations();

/**
 * Creates a symbolic link or junction (if the operating system is Windows)
 * between `supabase/migrations` and `src/__tests__/supabase/migrations` if
 * `src/__tests__supabase/migrations` does not already exist.
 *
 * The symbolic link eliminates the need to manually update
 * `src/__tests__/supabase/migrations` when `supabase/migrations` is edited.
 *
 * If the function is called from a Github Actions workflow, the directory
 * will be copied instead as symbolic links do not appear to be processed
 * within this environment.
 */
function linkOrCopyMigrations() {
  if (isEnvironmentGithubActions()) {
    copyMigrations();
  } else {
    if (migrationsExist()) {
      if (!migrationsAreLinked()) {
        console.warn(
          'Warning:\n' +
            'src/__tests__/supabase/migrations is not a Symlink or Junction.\n\n' +
            'For best results, remove src/__tests__/supabase/migrations and ' +
            're-run this command to replace it with a Symlink or Junction.\n',
        );
      }

      return;
    }

    linkMigrations();
  }
}

function isEnvironmentGithubActions() {
  return !!process.env.GITHUB_ACTIONS;
}

function copyMigrations() {
  fs.cpSync(source, destination, { recursive: true });
  console.log('Successfully copied migrations.');
}

function migrationsExist() {
  return fs.existsSync(destination);
}

function migrationsAreLinked() {
  const stats = fs.lstatSync(destination);
  return stats.isSymbolicLink();
}

function linkMigrations() {
  /*
    Create a Junction if the OS is Windows as creating SymbolicLinks requires
    administrator priveleges.
  */
  const linkType = isWindows() ? 'junction' : 'dir';
  fs.symlinkSync(source, destination, linkType);
  console.log('Successfully linked migrations.\n');
}

function isWindows() {
  return process.platform === 'win32';
}
