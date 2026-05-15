import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

@Injectable()
export class DepositsService {
  // 创建成功存款
  async createDeposit(data: {
    content: string;
    type?: string;
    emotion?: string;
    difficulty?: string;
    coins?: number;
    note?: string;
  }) {
    const client = getSupabaseClient();
    const { data: result, error } = await client
      .from('success_deposits')
      .insert({
        content: data.content,
        type: data.type || 'custom',
        emotion: data.emotion || null,
        difficulty: data.difficulty || 'easy',
        coins: data.coins || 1,
        note: data.note || null,
      })
      .select();

    if (error) throw new Error(`创建存款失败: ${error.message}`);
    return result?.[0] || null;
  }

  // 获取存款列表
  async getDeposits(limit: number = 20) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('success_deposits')
      .select('id, content, type, emotion, difficulty, coins, note, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`获取存款列表失败: ${error.message}`);
    return data || [];
  }

  // 获取存款统计
  async getStats() {
    const client = getSupabaseClient();

    // 总存款数和成功币
    const { count: totalCount, error: countError } = await client
      .from('success_deposits')
      .select('*', { count: 'exact', head: true });

    if (countError) throw new Error(`统计存款总数失败: ${countError.message}`);

    // 成功币总额
    const { data: coinsData, error: coinsError } = await client
      .from('success_deposits')
      .select('coins');

    if (coinsError) throw new Error(`统计成功币失败: ${coinsError.message}`);

    const totalCoins = (coinsData || []).reduce((sum: number, item: any) => sum + (item.coins || 0), 0);

    // 今日存款数
    const today = new Date().toISOString().split('T')[0];
    const { count: todayCount, error: todayError } = await client
      .from('success_deposits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today);

    if (todayError) throw new Error(`统计今日存款失败: ${todayError.message}`);

    // 连续存款天数
    const streak = await this.calculateStreak();

    // 计算等级（基于成功币）
    const level = this.calculateLevel(totalCoins);

    return {
      totalDeposits: totalCount || 0,
      total_coins: totalCoins,
      total_deposits: totalCount || 0,
      streak,
      level: level.level,
      levelName: level.name,
      todayDeposits: todayCount || 0,
      completedTasks: 0,
      challengesCompleted: 0,
    };
  }

  private async calculateStreak(): Promise<number> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('success_deposits')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !data || data.length === 0) return 0;

    // Group by date
    const dates = [...new Set(
      data.map((item: any) => new Date(item.created_at).toISOString().split('T')[0])
    )];

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Start from today or yesterday
    if (dates[0] === today || dates[0] === yesterday) {
      streak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);
        const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / 86400000);
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    }

    return streak;
  }

  private calculateLevel(totalCoins: number): { level: number; name: string } {
    const levels = [
      { level: 1, name: '新手储户', min: 0 },
      { level: 2, name: '见习储蓄员', min: 5 },
      { level: 3, name: '储蓄达人', min: 10 },
      { level: 4, name: '自信存户', min: 16 },
      { level: 5, name: '成长之星', min: 23 },
      { level: 6, name: '配得感探索者', min: 31 },
      { level: 7, name: '勇敢储户', min: 40 },
      { level: 8, name: '成功理财师', min: 50 },
      { level: 9, name: '配得感大师', min: 60 },
      { level: 10, name: '成功银行家', min: 70 },
    ];

    let result = levels[0];
    for (const lv of levels) {
      if (totalCoins >= lv.min) {
        result = lv;
      }
    }
    return result;
  }
}
