import Taro from '@tarojs/taro';

export interface DepositItem {
  id: string | number;
  content: string;
  type: string;
  emotion?: string;
  difficulty: string;
  coins: number;
  note?: string;
  created_at: string;
}

const STORAGE_KEYS = {
  DEPOSITS: 'sb_deposits',
  TASKS: 'sb_tasks',
  TREE: 'sb_tree',
  TOOLBOX: 'sb_toolbox',
  BONUS_COINS: 'sb_bonus_coins',
};

const TASKS_21_DEF = [
  { day: 1, title: "对自己说我值得", desc: "站在镜子前，看着自己的眼睛，认真地说三遍：我值得所有美好。" },
  { day: 2, title: "写下3个优点", desc: "拿出纸笔，认真写下你身上的3个优点。不需要很伟大，我善良、我努力都算。" },
  { day: 3, title: "接受一次赞美", desc: "当别人夸你时，不要急着否定或谦虚，试着微笑说谢谢。" },
  { day: 4, title: "为自己做一件事", desc: "做一件纯粹为自己开心的事：买喜欢的零食、看一部想看的电影、泡个热水澡。" },
  { day: 5, title: "拒绝一个不合理请求", desc: "练习说不。哪怕是很小的拒绝，比如拒绝一次不必要的加班。" },
  { day: 6, title: "感恩练习", desc: "写下今天3件值得感恩的小事，可以是一杯好喝的咖啡、一个微笑。" },
  { day: 7, title: "阶段复盘：第一周", desc: "回顾这一周的变化，写下你的感受。你是否开始更关注自己的需求了？" },
  { day: 8, title: "对着镜子微笑", desc: "早晨起床后，对着镜子里的自己微笑。注意，是发自内心的那种。" },
  { day: 9, title: "允许自己犯错", desc: "今天，当你犯错时，不要自责，试着对自己说没关系，我在学习。" },
  { day: 10, title: "做一件害怕的小事", desc: "迈出舒适区：主动发言、尝试新食物、和不熟悉的人聊天。" },
  { day: 11, title: "停止自我比较", desc: "当你发现自己在和他人比较时，提醒自己：每个人都有自己的时区。" },
  { day: 12, title: "犒劳自己", desc: "给自己一个小奖励。不是因为你做了什么了不起的事，而是因为你值得。" },
  { day: 13, title: "写一封给自己的情书", desc: "用最温柔的语言，给自己写一封信。就像写给最亲密的朋友。" },
  { day: 14, title: "阶段复盘：第二周", desc: "回顾两周的变化，你是否开始更善待自己了？为自己鼓掌。" },
  { day: 15, title: "记录一次我做到了", desc: "今天完成一件事后，无论大小，对自己说我做到了并认真记录。" },
  { day: 16, title: "设定一个小边界", desc: "明确告诉某人你的底线。比如我需要一些独处时间或这个话题我不想聊。" },
  { day: 17, title: "承认一个脆弱", desc: "允许自己在信任的人面前展示脆弱。承认我需要帮助也是一种力量。" },
  { day: 18, title: "做5分钟正念冥想", desc: "找一个安静的地方，闭眼5分钟，专注于呼吸。不需要完美，走神也没关系。" },
  { day: 19, title: "删除一条自我批评", desc: "当你听到内心的批评声音时，有意识地把它转化为建设性的话。" },
  { day: 20, title: "为自己的成长庆祝", desc: "回顾21天旅程，列出你所有的进步。每一个都值得庆祝。" },
  { day: 21, title: "给未来的自己一封信", desc: "写给3个月后的自己，告诉TA你已经变得更勇敢、更值得了。" },
];

const ALL_ACHIEVEMENTS = [
  { id: 'first_deposit', name: '第一桶金', desc: '存入第一笔成功', category: 'deposit', icon: '⭐', threshold: 1, field: 'total_deposits' },
  { id: 'deposit_5', name: '小有积蓄', desc: '累计存入5笔成功', category: 'deposit', icon: '💰', threshold: 5, field: 'total_deposits' },
  { id: 'deposit_15', name: '成功收藏家', desc: '累计存入15笔成功', category: 'deposit', icon: '🏦', threshold: 15, field: 'total_deposits' },
  { id: 'deposit_30', name: '成功大亨', desc: '累计存入30笔成功', category: 'deposit', icon: '👑', threshold: 30, field: 'total_deposits' },
  { id: 'streak_3', name: '三天小能手', desc: '连续存款3天', category: 'streak', icon: '🔥', threshold: 3, field: 'streak' },
  { id: 'streak_7', name: '一周坚持', desc: '连续存款7天', category: 'streak', icon: '🌟', threshold: 7, field: 'streak' },
  { id: 'streak_14', name: '两周达人', desc: '连续存款14天', category: 'streak', icon: '💫', threshold: 14, field: 'streak' },
  { id: 'streak_30', name: '月度传奇', desc: '连续存款30天', category: 'streak', icon: '🏆', threshold: 30, field: 'streak' },
  { id: 'coins_5', name: '初露锋芒', desc: '累计5成功币', category: 'coins', icon: '🪙', threshold: 5, field: 'total_coins' },
  { id: 'coins_15', name: '小富即安', desc: '累计15成功币', category: 'coins', icon: '💎', threshold: 15, field: 'total_coins' },
  { id: 'coins_35', name: '财源广进', desc: '累计35成功币', category: 'coins', icon: '💰', threshold: 35, field: 'total_coins' },
  { id: 'coins_70', name: '满级传奇', desc: '累计70成功币（满级）', category: 'coins', icon: '👑', threshold: 70, field: 'total_coins' },
  { id: 'task_first', name: '启程第一步', desc: '完成第一个21天任务', category: 'task', icon: '🚀', threshold: 1, field: 'completed_tasks' },
  { id: 'task_7', name: '一周探险', desc: '完成7个21天任务', category: 'task', icon: '🎯', threshold: 7, field: 'completed_tasks' },
  { id: 'task_14', name: '两周征程', desc: '完成14个21天任务', category: 'task', icon: '🛡️', threshold: 14, field: 'completed_tasks' },
  { id: 'task_21', name: '配得感大师', desc: '完成全部21天计划', category: 'task', icon: '🎓', threshold: 21, field: 'completed_tasks' },
  { id: 'tree_sprout', name: '破土而出', desc: '树木成长为嫩芽', category: 'tree', icon: '🌱', threshold: 1, field: 'tree_level' },
  { id: 'tree_small', name: '小树初成', desc: '树木成长为小树', category: 'tree', icon: '🪴', threshold: 3, field: 'tree_level' },
  { id: 'tree_big', name: '大树参天', desc: '树木成长为大树', category: 'tree', icon: '🌲', threshold: 5, field: 'tree_level' },
  { id: 'tree_max', name: '生命之树', desc: '树木成长为参天大树', category: 'tree', icon: '🎄', threshold: 6, field: 'tree_level' },
];

const TREE_MILESTONES = [
  { level: 0, minCoins: 0 },
  { level: 1, minCoins: 5 },
  { level: 2, minCoins: 16 },
  { level: 3, minCoins: 31 },
  { level: 4, minCoins: 46 },
  { level: 5, minCoins: 52 },
  { level: 6, minCoins: 70 },
];

let memoryDeposits: DepositItem[] | null = null;
let memoryBonusCoins: number | null = null;

export const EVENT_DATA_UPDATED = 'SUCCESSBANK_DATA_UPDATED';

export function notifyDataUpdated() {
  try {
    Taro.eventCenter.trigger(EVENT_DATA_UPDATED);
  } catch (e) {
    console.warn('[LocalStorageBackend] eventCenter.trigger error:', e);
  }
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('successbank_data_updated'));
    } catch {}
  }
}

function getStoredDeposits(): DepositItem[] {
  if (memoryDeposits && Array.isArray(memoryDeposits) && memoryDeposits.length > 0) {
    return memoryDeposits;
  }

  let parsed: any = null;
  try {
    parsed = Taro.getStorageSync(STORAGE_KEYS.DEPOSITS);
  } catch (e) {
    console.warn('[LocalStorageBackend] getStorageSync error:', e);
  }

  if (!parsed && typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.DEPOSITS);
      if (raw) parsed = JSON.parse(raw);
    } catch {}
  }

  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch {}
  }

  if (Array.isArray(parsed) && parsed.length > 0) {
    memoryDeposits = parsed;
    return parsed;
  }

  // 初始预置示范存款，让用户初次体验即有成就感
  const now = Date.now();
  const initialDeposits: DepositItem[] = [
    {
      id: 'seed_1',
      content: '按时起床，开启元气满满的一天',
      type: 'preset',
      emotion: '开心',
      difficulty: 'easy',
      coins: 1,
      note: '早起迎接晨光，感觉很好',
      created_at: new Date(now - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 'seed_2',
      content: '主动微笑打招呼',
      type: 'preset',
      emotion: '自豪',
      difficulty: 'medium',
      coins: 3,
      note: '突破内向舒适区',
      created_at: new Date(now - 1000 * 60 * 180).toISOString(),
    },
    {
      id: 'seed_3',
      content: '开启配得感成就旅程',
      type: 'custom',
      emotion: '突破',
      difficulty: 'medium',
      coins: 3,
      note: '再小的成功都值得被铭记',
      created_at: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
    },
  ];
  saveDeposits(initialDeposits);
  return initialDeposits;
}

function saveDeposits(deposits: DepositItem[]) {
  memoryDeposits = deposits;
  try {
    Taro.setStorageSync(STORAGE_KEYS.DEPOSITS, deposits);
  } catch (e) {
    console.warn('[LocalStorageBackend] setStorageSync error:', e);
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(deposits));
    } catch {}
  }
}

function getBonusCoins(): number {
  if (typeof memoryBonusCoins === 'number') {
    return memoryBonusCoins;
  }
  let val: any = null;
  try {
    val = Taro.getStorageSync(STORAGE_KEYS.BONUS_COINS);
  } catch {}
  if (val === null || val === undefined || val === '') {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEYS.BONUS_COINS);
        if (raw !== null) val = Number(raw);
      } catch {}
    }
  }
  const num = Number(val) || 0;
  memoryBonusCoins = num;
  return num;
}

function addBonusCoins(coins: number) {
  const current = getBonusCoins();
  const next = current + coins;
  memoryBonusCoins = next;
  try {
    Taro.setStorageSync(STORAGE_KEYS.BONUS_COINS, next);
  } catch {}
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEYS.BONUS_COINS, String(next));
    } catch {}
  }
}

function calculateStreak(deposits: DepositItem[]): number {
  if (deposits.length === 0) return 0;
  const dates = Array.from(
    new Set(
      deposits.map(d => {
        const date = new Date(d.created_at);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      })
    )
  ).sort().reverse();

  if (dates.length === 0) return 0;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const yesterday = new Date(today.getTime() - 86400000);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  if (dates[0] !== todayStr && dates[0] !== yesterdayStr) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const d1 = new Date(dates[i]);
    const d2 = new Date(dates[i + 1]);
    const diffDays = Math.round((d1.getTime() - d2.getTime()) / 86400000);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function getTreeLevel(totalCoins: number): number {
  let level = 0;
  for (const m of TREE_MILESTONES) {
    if (totalCoins >= m.minCoins) {
      level = m.level;
    }
  }
  return level;
}

export function handleLocalApi(option: Taro.request.Option<any>): Promise<Taro.request.SuccessCallbackResult<any>> {
  const url = option.url || '';
  const method = (option.method || 'GET').toUpperCase();
  const rawPath = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
  const path = rawPath.replace(/\/+$/, '') || '/';

  console.log(`[LocalStorageBackend] Intercepted ${method} ${path}`, option.data);

  let result: any = { code: 200, msg: 'success', data: null };

  const deposits = getStoredDeposits();
  const totalDepositCoins = deposits.reduce((sum, d) => sum + (Number(d.coins) || 0), 0);
  const totalCoins = totalDepositCoins + getBonusCoins();
  const streak = calculateStreak(deposits);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDepositsCount = deposits.filter(d => (d.created_at || '').startsWith(todayStr)).length;

  // 1. 存款统计接口
  if (path === '/api/deposits/stats') {
    const treeLevel = getTreeLevel(totalCoins);
    result = {
      code: 200,
      msg: 'success',
      data: {
        totalDeposits: deposits.length,
        total_deposits: deposits.length,
        totalCoins,
        total_coins: totalCoins,
        streak,
        level: treeLevel,
        levelName: `Lv.${treeLevel}`,
        todayDeposits: todayDepositsCount,
        completedTasks: 0,
        challengesCompleted: 0,
      },
    };
  }

  // 2. 存款列表与新增存款接口
  else if (path === '/api/deposits') {
    if (method === 'POST') {
      let data = option.data || {};
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {}
      }
      const coinsVal = Number(data.coins);
      const validCoins = !Number.isNaN(coinsVal) && coinsVal > 0 ? coinsVal : 1;

      const newDeposit: DepositItem = {
        id: `dep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        content: String(data.content || '').trim() || '记录一次成功',
        type: data.type || (data.content ? 'custom' : 'preset'),
        emotion: data.emotion || '开心',
        difficulty: data.difficulty || 'easy',
        coins: validCoins,
        note: data.note || '',
        created_at: new Date().toISOString(),
      };

      deposits.unshift(newDeposit);
      saveDeposits(deposits);

      console.log(`[LocalStorageBackend] Successfully stored deposit: +${newDeposit.coins} 成功币!`, newDeposit);
      notifyDataUpdated();

      result = {
        code: 200,
        msg: 'success',
        data: newDeposit,
      };
    } else {
      // GET
      let limit: number | undefined;
      if (option.data && typeof option.data === 'object' && option.data.limit) {
        limit = Number(option.data.limit);
      }
      const list = limit && limit > 0 ? deposits.slice(0, limit) : deposits;
      result = {
        code: 200,
        msg: 'success',
        data: { list },
        list,
      };
    }
  }

  // 3. 今日任务接口
  else if (path === '/api/tasks/today') {
    let taskState: any = {};
    try {
      taskState = Taro.getStorageSync(STORAGE_KEYS.TASKS) || {};
    } catch {
      // ignore
    }

    const currentDay = Math.min(21, Math.max(1, Number(taskState.current_day) || 1));
    const isCompleted = (taskState.completed_days || []).includes(currentDay);
    const taskInfo = TASKS_21_DEF[currentDay - 1] || TASKS_21_DEF[0];

    result = {
      code: 200,
      msg: 'success',
      data: {
        day: currentDay,
        title: taskInfo.title,
        desc: taskInfo.desc,
        coins: 3,
        completed: isCompleted,
      },
    };
  }

  // 4. 任务进度接口
  else if (path === '/api/tasks/progress') {
    let taskState: any = {};
    try {
      taskState = Taro.getStorageSync(STORAGE_KEYS.TASKS) || {};
    } catch {
      // ignore
    }

    const currentDay = Math.min(21, Math.max(1, Number(taskState.current_day) || 1));
    const completedDays = Array.isArray(taskState.completed_days) ? taskState.completed_days : [];
    const isTodayCompleted = completedDays.includes(currentDay);

    result = {
      code: 200,
      msg: 'success',
      data: {
        current_day: currentDay,
        completed_days: completedDays,
        today_completed: isTodayCompleted,
      },
    };
  }

  // 5. 完成任务接口
  else if (path === '/api/tasks/complete' && method === 'POST') {
    const data = option.data || {};
    let taskState: any = {};
    try {
      taskState = Taro.getStorageSync(STORAGE_KEYS.TASKS) || {};
    } catch {
      // ignore
    }

    const currentDay = Number(data.day) || Number(taskState.current_day) || 1;
    const completedDays: number[] = Array.isArray(taskState.completed_days) ? [...taskState.completed_days] : [];

    if (!completedDays.includes(currentDay)) {
      completedDays.push(currentDay);
      addBonusCoins(3);
      taskState.completed_days = completedDays;
      taskState.current_day = Math.min(21, currentDay + 1);
      taskState.today_completed = true;
      try {
        Taro.setStorageSync(STORAGE_KEYS.TASKS, taskState);
      } catch {
        // ignore
      }
      notifyDataUpdated();
      result = {
        code: 200,
        msg: 'success',
        data: { success: true, coins: 3, already_completed: false },
      };
    } else {
      result = {
        code: 200,
        msg: 'success',
        data: { success: true, already_completed_today: true },
      };
    }
  }

  // 6. 花园与树木接口
  else if (path === '/api/tree') {
    const currentGrowthLevel = getTreeLevel(totalCoins);
    result = {
      code: 200,
      msg: 'success',
      data: {
        growth_level: currentGrowthLevel,
        has_bug: false,
        total_coins: totalCoins,
        can_grow: totalCoins >= 5,
        streak_days: streak,
      },
    };
  } else if (path === '/api/tree/grow' && method === 'POST') {
    notifyDataUpdated();
    result = {
      code: 200,
      msg: 'success',
      data: {
        grew: true,
        message: '浇水成功！生命之树吸纳了成功币正在茁壮成长 🌱',
      },
    };
  } else if (path === '/api/tree/remove-bug' && method === 'POST') {
    notifyDataUpdated();
    result = {
      code: 200,
      msg: 'success',
      data: { success: true, message: '除虫成功！花园更加繁盛了 🌸' },
    };
  }

  // 7. 成就系统接口
  else if (path === '/api/achievements') {
    let taskState: any = {};
    try {
      taskState = Taro.getStorageSync(STORAGE_KEYS.TASKS) || {};
    } catch {
      // ignore
    }
    const completedTasksCount = (taskState.completed_days || []).length;
    const treeLevel = getTreeLevel(totalCoins);

    const statsMap: Record<string, number> = {
      total_deposits: deposits.length,
      streak,
      total_coins: totalCoins,
      completed_tasks: completedTasksCount,
      tree_level: treeLevel,
    };

    const achievements = ALL_ACHIEVEMENTS.map(ach => {
      const currentVal = statsMap[ach.field] || 0;
      const unlocked = currentVal >= ach.threshold;
      return {
        ...ach,
        unlocked,
        unlocked_at: unlocked ? new Date().toISOString() : null,
        current_value: currentVal,
      };
    });

    result = {
      code: 200,
      msg: 'success',
      data: achievements,
    };
  }

  // 8. 心理工具箱接口
  else if (path.startsWith('/api/toolbox')) {
    result = {
      code: 200,
      msg: 'success',
      data: { success: true },
    };
  }

  // 返回符合 Taro.request SuccessCallbackResult 格式的对象
  const response: Taro.request.SuccessCallbackResult<any> = {
    data: result,
    statusCode: 200,
    header: { 'content-type': 'application/json' },
    cookies: [],
    errMsg: 'request:ok',
  };

  return Promise.resolve(response);
}
