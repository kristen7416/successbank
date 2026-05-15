import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

@Injectable()
export class ToolboxService {
  // 保存自我肯定（奖励1成功币）
  async saveAffirmation(content: string) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('affirmation_records')
      .insert({ content })
      .select();

    if (error) throw new Error(`保存自我肯定失败: ${error.message}`);

    // 存入1成功币
    await client
      .from('success_deposits')
      .insert({
        content: `自我肯定：${content.substring(0, 20)}${content.length > 20 ? '...' : ''}`,
        type: 'affirmation',
        emotion: '平静',
        difficulty: 'easy',
        coins: 1,
      });

    return data?.[0] || null;
  }

  // 保存感恩日记（奖励2成功币）
  async saveGratitude(items: string[]) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('gratitude_entries')
      .insert({ items: JSON.stringify(items) })
      .select();

    if (error) throw new Error(`保存感恩日记失败: ${error.message}`);

    // 存入2成功币
    await client
      .from('success_deposits')
      .insert({
        content: `感恩日记：${items.join('、').substring(0, 30)}...`,
        type: 'gratitude',
        emotion: '感恩',
        difficulty: 'easy',
        coins: 2,
      });

    return data?.[0] || null;
  }

  // 保存价值条件化（奖励2成功币）
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

    // 存入2成功币
    const firstCondition = inserts[0].condition_text;
    await client
      .from('success_deposits')
      .insert({
        content: `重写价值条件：${firstCondition.substring(0, 20)}${firstCondition.length > 20 ? '...' : ''}`,
        type: 'value-condition',
        emotion: '突破',
        difficulty: 'medium',
        coins: 2,
      });

    return data || [];
  }
}
