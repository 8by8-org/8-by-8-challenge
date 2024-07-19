import type { SupabaseClient } from '@supabase/supabase-js';

export async function clearTable(
  tableName: string,
  supabase: SupabaseClient,
): Promise<number> {
  const { data: rows, error } = await supabase.from(tableName).select();

  if (error) throw new Error(error.message);

  for (const row of rows) {
    const { error } = await supabase.from(tableName).delete().eq('id', row.id);
    if (error) throw new Error(error.message);
  }

  return rows.length;
}
