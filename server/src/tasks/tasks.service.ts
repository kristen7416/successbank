import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const TASKS_21 = [
  { day: 1, title: '对自己说"我值得"', category: 'self-affirmation' },
  { day: 2, title: '写下3个优点', category: 'self-discovery' },
  { day: 3, title: '接受一次赞美', category: 'acceptance' },
  { day: 4, title: '为自己做一件事', category: 'self-care' },
  { day: 5, title: '拒绝一个不合理请求', category: 'boundary' },
  { day: 6, title: '感恩练习', category: 'gratitude' },
  { day: 7, title: '阶段复盘：第一周', category: 'review' },
  { day: 8, title: '对着镜子微笑', category: 'self-affirmation' },
  { day: 9, title: '允许自己犯错', category: 'self-compassion' },
  { day: 10, title: '做一件害怕的小事', category: 'courage' },
  { day: 11, title: '停止自我比较', category: 'acceptance' },
  { day: 12, title: '犒劳自己', category: 'self-care' },
  { day: 13, title: '写一封给自己的情书', category: 'self-love' },
  { day: 14, title: '阶段复盘：第二周', category: 'review' },
  { day: 15, title: '记录一次"我做到了"', category: 'achievement' },
  { day: 16, title: '设定一个小边界', category: 'boundary' },
  { day: 17, title: '承认一个脆弱', category: 'vulnerability' },
  { day: 18, title: '做5分钟正念冥想', category: 'mindfulness' },
  { day: 19, title: '删除一条自我批评', category: 'self-compassion' },
  { day: 20, title: '为自己的成长庆祝', category: 'celebration' },
  { day: 21, title: '给未来的自己一封信', category: 'self-love' },
];

@Injectable()
export class TasksService {
  // 获取今日任务
  async getTodayTask() {
    const client = getSupabaseClient();

    // 获取已完成的天数
    const { data: completions, error } = await client
      .from('task_completions')
      .select('day')
      .order('day', { ascending: true });

    if (error) throw new Error(`获取任务进度失败: ${error.message}`);

    const completedDays = (completions || []).map((c: any) => c.day);
    const currentDay = completedDays.length > 0
      ? Math.min(Math.max(...completedDays) + 1, 21)
      : 1;

    const task = TASKS_21.find(t => t.day === currentDay) || TASKS_21[0];

    return {
      ...task,
      is_completed: completedDays.includes(task.day),
    };
  }

  // 获取任务进度
  async getProgress() {
    const client = getSupabaseClient();

    const { data: completions, error } = await client
      .from('task_completions')
      .select('day, created_at')
      .order('day', { ascending: true });

    if (error) throw new Error(`获取任务进度失败: ${error.message}`);

    const completedDays = (completions || []).map((c: any) => c.day);
    const currentDay = completedDays.length > 0
      ? Math.min(Math.max(...completedDays) + 1, 21)
      : 1;

    // Check if already completed a task today
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

    const todayCompleted = (completions || []).some((c: any) => {
      const createdAt = new Date(c.created_at).toISOString();
      return createdAt >= todayStart && createdAt < todayEnd;
    });

    return {
      completed_days: completedDays,
      current_day: currentDay,
      total: 21,
      today_completed: todayCompleted,
    };
  }

  // 完成任务打卡（每天限一次）
  async completeTask(day: number, feeling?: string) {
    const client = getSupabaseClient();

    // Check if already completed this day
    const { data: existing, error: checkError } = await client
      .from('task_completions')
      .select('id')
      .eq('day', day)
      .maybeSingle();

    if (checkError) throw new Error(`检查任务完成状态失败: ${checkError.message}`);

    if (existing) {
      return { already_completed: true, day, message: '该任务已完成' };
    }

    // Check if already completed a task today (one per real-world day)
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

    const { data: todayCompletions, error: todayError } = await client
      .from('task_completions')
      .select('id, day')
      .gte('created_at', todayStart)
      .lt('created_at', todayEnd);

    if (todayError) throw new Error(`检查今日打卡状态失败: ${todayError.message}`);

    if (todayCompletions && todayCompletions.length > 0) {
      return { already_completed_today: true, day: todayCompletions[0].day, message: '今日已打卡，明天继续加油' };
    }

    const { data, error } = await client
      .from('task_completions')
      .insert({ day, feeling: feeling || null })
      .select();

    if (error) throw new Error(`完成任务失败: ${error.message}`);

    return data?.[0] || null;
  }
}
