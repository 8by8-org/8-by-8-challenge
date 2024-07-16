/*
  Hides warning messages due to multiple Supabase clients being created for tests. 
  Supabase prints a warning message to the console because multiple Supabase 
  clients existing in the same browser context could result in unexpected 
  behavior. Multiple Supabase clients is often a necessity for testing, so this 
  warning message is hidden.
*/
const { warn } = console;

const actualWarn = (message, ...optionalParams) => {
  warn.call(console, message, ...optionalParams);
};

console.warn = (message, ...optionalParams) => {
  if (
    message &&
    message.includes(
      'Multiple GoTrueClient instances detected in the same browser context.',
    )
  ) {
    return;
  }

  actualWarn(message, ...optionalParams);
};
