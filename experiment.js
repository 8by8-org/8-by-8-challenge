const { exec } = require('child_process');

exec('npm run supabase-test:start', (error, output) => {
  if (error) throw new Error(error.message);

  const apiUrl = output.match(/API URL: \S+/)[0];
  const anonKey = output.match(/anon key: \S+/)[0];
  const serviceRoleKey = output.match(/service_role key: \S+/)[0];

  console.log(apiUrl);
  console.log(anonKey);
  console.log(serviceRoleKey);
});
