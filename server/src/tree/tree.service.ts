import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 树木生长等级定义
// 每级需要的累计成功币
const TREE_LEVELS = [
  { level: 0, name: '种子', minCoins: 0, emoji: '🌰' },
  { level: 1, name: '嫩芽', minCoins: 5, emoji: '🌱' },
  { level: 2, name: '幼苗', minCoins: 12, emoji: '🌿' },
  { level: 3, name: '小树', minCoins: 22, emoji: '🪴' },
  { level: 4, name: '中树', minCoins: 35, emoji: '🌳' },
  { level: 5, name: '大树', minCoins: 52, emoji: '🌲' },
  { level: 6, name: '参天大树', minCoins: 70, emoji: '🎄' },
];

@Injectable()
export class TreeService {
  // 获取树木状态
  async getTreeState() {
    const client = getSupabaseClient();
    const state = await this.getOrCreateTree(client);

    // 获取当前成功币总数
    const totalCoins = await this.getTotalCoins(client);

    // 计算应有等级
    const expectedLevel = this.calculateTreeLevel(totalCoins);

    return {
      growth_level: state.growth_level,
      level_name: TREE_LEVELS[state.growth_level]?.name || '种子',
      level_emoji: TREE_LEVELS[state.growth_level]?.emoji || '🌰',
      has_bug: state.has_bug === 1,
      total_coins: totalCoins,
      expected_level: expectedLevel,
      can_grow: expectedLevel > state.growth_level,
      next_level: expectedLevel < TREE_LEVELS.length - 1
        ? TREE_LEVELS[Math.min(state.growth_level + 1, TREE_LEVELS.length - 1)]
        : null,
      current_level_info: TREE_LEVELS[state.growth_level],
    };
  }

  // 检查并生长
  async checkAndGrow() {
    const client = getSupabaseClient();
    const state = await this.getOrCreateTree(client);
    const totalCoins = await this.getTotalCoins(client);
    const expectedLevel = this.calculateTreeLevel(totalCoins);

    if (expectedLevel > state.growth_level) {
      const oldLevel = state.growth_level;
      const newLevel = expectedLevel;

      const { data, error } = await client
        .from('tree_state')
        .update({
          growth_level: newLevel,
          total_coins_at_growth: totalCoins,
          updated_at: new Date().toISOString(),
        })
        .eq('id', state.id)
        .select();

      if (error) throw new Error(`树木生长失败: ${error.message}`);

      return {
        grew: true,
        old_level: oldLevel,
        new_level: newLevel,
        level_name: TREE_LEVELS[newLevel]?.name || '未知',
        level_emoji: TREE_LEVELS[newLevel]?.emoji || '🌿',
        message: `树木从${TREE_LEVELS[oldLevel]?.name}成长为${TREE_LEVELS[newLevel]?.name}！`,
      };
    }

    return {
      grew: false,
      current_level: state.growth_level,
      level_name: TREE_LEVELS[state.growth_level]?.name || '种子',
      level_emoji: TREE_LEVELS[state.growth_level]?.emoji || '🌰',
      message: '树木暂未达到成长条件',
    };
  }

  // 检查昨日任务是否完成，未完成则生虫
  async checkYesterdayTask() {
    const client = getSupabaseClient();
    const state = await this.getOrCreateTree(client);

    if (state.has_bug === 1) {
      return { has_bug: true, message: '树上有虫子！完成任务来除虫吧' };
    }

    // 检查昨日是否有任务完成记录
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).toISOString();
    const yesterdayEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1).toISOString();

    const { data: yesterdayTasks } = await client
      .from('task_completions')
      .select('id')
      .gte('created_at', yesterdayStart)
      .lt('created_at', yesterdayEnd);

    // 如果昨日没有任务完成，且用户至少有一个任务记录（已经开始计划了）
    const { count: totalTasks } = await client
      .from('task_completions')
      .select('*', { count: 'exact', head: true });

    if (totalTasks && totalTasks > 0 && (!yesterdayTasks || yesterdayTasks.length === 0)) {
      // 昨日未完成任务，生虫
      await client
        .from('tree_state')
        .update({ has_bug: 1, updated_at: new Date().toISOString() })
        .eq('id', state.id);

      return { has_bug: true, just_got_bug: true, message: '昨日任务未完成，树上长了虫子！' };
    }

    return { has_bug: false, message: '树木状态良好，没有虫子' };
  }

  // 除虫
  async removeBug() {
    const client = getSupabaseClient();
    const state = await this.getOrCreateTree(client);

    if (state.has_bug !== 1) {
      return { removed: false, message: '树上没有虫子' };
    }

    const { error } = await client
      .from('tree_state')
      .update({ has_bug: 0, updated_at: new Date().toISOString() })
      .eq('id', state.id);

    if (error) throw new Error(`除虫失败: ${error.message}`);

    return { removed: true, message: '虫子已清除！树木恢复健康' };
  }

  // 施肥（获得成就时调用）
  async fertilize() {
    const client = getSupabaseClient();
    const state = await this.getOrCreateTree(client);

    const { error } = await client
      .from('tree_state')
      .update({
        last_fertilized_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', state.id);

    if (error) throw new Error(`施肥失败: ${error.message}`);

    // 施肥后也检查能否生长
    return this.checkAndGrow();
  }

  // 获取或创建树木
  private async getOrCreateTree(client: any) {
    const { data: existing } = await client
      .from('tree_state')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (existing) return existing;

    // 创建初始树木
    const { data, error } = await client
      .from('tree_state')
      .insert({ growth_level: 0, total_coins_at_growth: 0, has_bug: 0 })
      .select();

    if (error) throw new Error(`创建树木失败: ${error.message}`);
    return data?.[0];
  }

  private async getTotalCoins(client: any): Promise<number> {
    const { data } = await client
      .from('success_deposits')
      .select('coins');

    return (data || []).reduce((sum: number, item: any) => sum + (item.coins || 0), 0);
  }

  private calculateTreeLevel(totalCoins: number): number {
    let level = 0;
    for (let i = TREE_LEVELS.length - 1; i >= 0; i--) {
      if (totalCoins >= TREE_LEVELS[i].minCoins) {
        level = i;
        break;
      }
    }
    return level;
  }
}
