import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 所有成就定义（降低难度，覆盖多维度）
const ALL_ACHIEVEMENTS = [
  // === 存款类 ===
  { id: 'first_deposit', name: '第一桶金', desc: '存入第一笔成功', category: 'deposit', icon: '⭐', threshold: 1, field: 'total_deposits' },
  { id: 'deposit_5', name: '小有积蓄', desc: '累计存入5笔成功', category: 'deposit', icon: '💰', threshold: 5, field: 'total_deposits' },
  { id: 'deposit_15', name: '成功收藏家', desc: '累计存入15笔成功', category: 'deposit', icon: '🏦', threshold: 15, field: 'total_deposits' },
  { id: 'deposit_30', name: '成功大亨', desc: '累计存入30笔成功', category: 'deposit', icon: '👑', threshold: 30, field: 'total_deposits' },

  // === 连续打卡类 ===
  { id: 'streak_3', name: '三天小能手', desc: '连续存款3天', category: 'streak', icon: '🔥', threshold: 3, field: 'streak' },
  { id: 'streak_7', name: '一周坚持', desc: '连续存款7天', category: 'streak', icon: '🌟', threshold: 7, field: 'streak' },
  { id: 'streak_14', name: '两周达人', desc: '连续存款14天', category: 'streak', icon: '💫', threshold: 14, field: 'streak' },
  { id: 'streak_30', name: '月度传奇', desc: '连续存款30天', category: 'streak', icon: '🏆', threshold: 30, field: 'streak' },

  // === 成功币类 ===
  { id: 'coins_5', name: '初露锋芒', desc: '累计5成功币', category: 'coins', icon: '🪙', threshold: 5, field: 'total_coins' },
  { id: 'coins_15', name: '小富即安', desc: '累计15成功币', category: 'coins', icon: '💎', threshold: 15, field: 'total_coins' },
  { id: 'coins_35', name: '财源广进', desc: '累计35成功币', category: 'coins', icon: '💰', threshold: 35, field: 'total_coins' },
  { id: 'coins_70', name: '满级传奇', desc: '累计70成功币（满级）', category: 'coins', icon: '👑', threshold: 70, field: 'total_coins' },

  // === 任务类 ===
  { id: 'task_first', name: '启程第一步', desc: '完成第一个21天任务', category: 'task', icon: '🚀', threshold: 1, field: 'completed_tasks' },
  { id: 'task_7', name: '一周探险', desc: '完成7个21天任务', category: 'task', icon: '🎯', threshold: 7, field: 'completed_tasks' },
  { id: 'task_14', name: '两周征程', desc: '完成14个21天任务', category: 'task', icon: '🛡️', threshold: 14, field: 'completed_tasks' },
  { id: 'task_21', name: '配得感大师', desc: '完成全部21天计划', category: 'task', icon: '🎓', threshold: 21, field: 'completed_tasks' },

  // === 工具箱类 ===
  { id: 'gratitude_first', name: '感恩之心', desc: '写第一篇感恩日记', category: 'toolbox', icon: '🙏', threshold: 1, field: 'gratitude_count' },
  { id: 'gratitude_5', name: '感恩达人', desc: '写5篇感恩日记', category: 'toolbox', icon: '🌻', threshold: 5, field: 'gratitude_count' },
  { id: 'affirmation_first', name: '自我肯定', desc: '第一次自我肯定', category: 'toolbox', icon: '💪', threshold: 1, field: 'affirmation_count' },
  { id: 'affirmation_5', name: '自信之星', desc: '5次自我肯定', category: 'toolbox', icon: '✨', threshold: 5, field: 'affirmation_count' },
  { id: 'value_first', name: '破框而出', desc: '第一次重写价值条件', category: 'toolbox', icon: '🔓', threshold: 1, field: 'value_count' },
  { id: 'challenge_first', name: '勇敢尝试', desc: '完成第一次微恐惧挑战', category: 'toolbox', icon: '🦁', threshold: 1, field: 'challenge_count' },
  { id: 'challenge_5', name: '挑战先锋', desc: '完成5次微恐惧挑战', category: 'toolbox', icon: '⚔️', threshold: 5, field: 'challenge_count' },

  // === 树木类 ===
  { id: 'tree_sprout', name: '破土而出', desc: '树木成长为嫩芽', category: 'tree', icon: '🌱', threshold: 1, field: 'tree_level' },
  { id: 'tree_small', name: '小树初成', desc: '树木成长为小树', category: 'tree', icon: '🪴', threshold: 3, field: 'tree_level' },
  { id: 'tree_big', name: '大树参天', desc: '树木成长为大树', category: 'tree', icon: '🌲', threshold: 5, field: 'tree_level' },
  { id: 'tree_max', name: '生命之树', desc: '树木成长为参天大树', category: 'tree', icon: '🎄', threshold: 6, field: 'tree_level' },
];

@Injectable()
export class AchievementsService {
  // 获取所有成就定义及解锁状态
  async getAchievements() {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('user_achievements')
      .select('achievement_id, unlocked_at')
      .order('unlocked_at', { ascending: false });

    if (error) throw new Error(`获取成就列表失败: ${error.message}`);

    const unlockedIds = (data || []).map((a: any) => a.achievement_id);

    // 返回所有成就定义 + 解锁状态
    return ALL_ACHIEVEMENTS.map(ach => ({
      ...ach,
      unlocked: unlockedIds.includes(ach.id),
      unlocked_at: (data || []).find((a: any) => a.achievement_id === ach.id)?.unlocked_at || null,
    }));
  }

  // 自动检测并解锁所有应得的成就
  async checkAndUnlockAll() {
    const client = getSupabaseClient();

    // 获取当前统计数据
    const stats = await this.getUserStats(client);

    // 获取已解锁成就
    const { data: existing } = await client
      .from('user_achievements')
      .select('achievement_id');
    const unlockedIds = new Set((existing || []).map((a: any) => a.achievement_id));

    const newlyUnlocked: string[] = [];

    for (const ach of ALL_ACHIEVEMENTS) {
      if (unlockedIds.has(ach.id)) continue;

      const currentValue = stats[ach.field] || 0;
      if (currentValue >= ach.threshold) {
        await client
          .from('user_achievements')
          .insert({ achievement_id: ach.id });
        newlyUnlocked.push(ach.id);
      }
    }

    return { newly_unlocked: newlyUnlocked, total_unlocked: unlockedIds.size + newlyUnlocked.length };
  }

  // 解锁单个成就
  async unlockAchievement(achievementId: string) {
    const client = getSupabaseClient();
    const { data: existing } = await client
      .from('user_achievements')
      .select('id')
      .eq('achievement_id', achievementId)
      .maybeSingle();

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

  // 获取各类统计
  private async getUserStats(client: any) {
    // 总存款数
    const { count: totalDeposits } = await client
      .from('success_deposits')
      .select('*', { count: 'exact', head: true });

    // 成功币总额
    const { data: coinsData } = await client
      .from('success_deposits')
      .select('coins');
    const totalCoins = (coinsData || []).reduce((sum: number, item: any) => sum + (item.coins || 0), 0);

    // 连续天数
    const streak = await this.calculateStreak(client);

    // 任务完成数
    const { count: completedTasks } = await client
      .from('task_completions')
      .select('*', { count: 'exact', head: true });

    // 感恩日记数
    const { count: gratitudeCount } = await client
      .from('gratitude_entries')
      .select('*', { count: 'exact', head: true });

    // 自我肯定数
    const { count: affirmationCount } = await client
      .from('affirmation_records')
      .select('*', { count: 'exact', head: true });

    // 价值条件数
    const { count: valueCount } = await client
      .from('value_conditions')
      .select('*', { count: 'exact', head: true });

    // 挑战数 (type=challenge 的存款)
    const { count: challengeCount } = await client
      .from('success_deposits')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'challenge');

    // 树木等级
    const { data: treeData } = await client
      .from('tree_state')
      .select('growth_level')
      .limit(1)
      .maybeSingle();
    const treeLevel = treeData?.growth_level || 0;

    return {
      total_deposits: totalDeposits || 0,
      total_coins: totalCoins,
      streak,
      completed_tasks: completedTasks || 0,
      gratitude_count: gratitudeCount || 0,
      affirmation_count: affirmationCount || 0,
      value_count: valueCount || 0,
      challenge_count: challengeCount || 0,
      tree_level: treeLevel,
    };
  }

  private async calculateStreak(client: any): Promise<number> {
    const { data, error } = await client
      .from('success_deposits')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !data || data.length === 0) return 0;

    const dates = [...new Set(
      data.map((item: any) => new Date(item.created_at).toISOString().split('T')[0])
    )];

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (dates[0] === today || dates[0] === yesterday) {
      streak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(String(dates[i - 1]));
        const currDate = new Date(String(dates[i]));
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
}
