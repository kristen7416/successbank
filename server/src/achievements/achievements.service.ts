import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

@Injectable()
export class AchievementsService {
  // 获取用户成就列表
  async getAchievements() {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('user_achievements')
      .select('id, achievement_id, unlocked_at')
      .order('unlocked_at', { ascending: false });

    if (error) throw new Error(`获取成就列表失败: ${error.message}`);
    return data || [];
  }

  // 解锁成就
  async unlockAchievement(achievementId: string) {
    const client = getSupabaseClient();

    // 检查是否已解锁
    const { data: existing, error: checkError } = await client
      .from('user_achievements')
      .select('id')
      .eq('achievement_id', achievementId)
      .maybeSingle();

    if (checkError) throw new Error(`检查成就状态失败: ${checkError.message}`);

    if (existing) {
      return { already_unlocked: true, achievement_id: achievementId };
    }

    const { data, error } = await client
      .from('user_achievements')
      .insert({ achievement_id: achievementId })
      .select();

    if (error) throw new Error(`解锁成就失败: ${error.message}`);
    return data?.[0] || null;
  }
}
