import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

@Injectable()
export class ToolboxService {
  // 保存自我肯定
  async saveAffirmation(content: string) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('affirmation_records')
      .insert({ content })
      .select();

    if (error) throw new Error(`保存自我肯定失败: ${error.message}`);
    return data?.[0] || null;
  }

  // 保存感恩日记
  async saveGratitude(items: string[]) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('gratitude_entries')
      .insert({ items: JSON.stringify(items) })
      .select();

    if (error) throw new Error(`保存感恩日记失败: ${error.message}`);
    return data?.[0] || null;
  }

  // 保存价值条件化
  async saveValueConditions(conditions: Array<{ condition: string; rewrite: string }>) {
    const client = getSupabaseClient();

    const inserts = conditions
      .filter(c => c.condition.trim())
      .map(c => ({
        condition_text: c.condition,
        rewrite_text: c.rewrite || null,
      }));

    if (inserts.length === 0) return [];

    const { data, error } = await client
      .from('value_conditions')
      .insert(inserts)
      .select();

    if (error) throw new Error(`保存价值条件失败: ${error.message}`);
    return data || [];
  }
}
