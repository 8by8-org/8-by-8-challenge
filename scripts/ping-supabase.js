/* 
  A Script that can be executed within a Github actions file to ping Supabase 
  by reading a record from a the keep_alive table. The actions file must 
  specify the environment in which it executes ("production" or "staging") in
  order to have access to the appropriate environment variables.
*/
const { createClient } = require('@supabase/supabase-js');
const core = require('@actions/core');

pingSupabase();

async function pingSupabase() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
  );

  const { data, error } = await supabase.from('keep_alive').select().limit(1);

  if (data) {
    core.info('Successfully Pinged supabase.');
  } else if (error || !data) {
    if (error) core.error(error);
    core.setFailed('Failed to read data from Supabase.');
  }
}
