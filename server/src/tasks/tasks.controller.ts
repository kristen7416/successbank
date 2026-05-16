import { Controller, Get, Post, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AchievementsService } from '@/achievements/achievements.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly achievementsService: AchievementsService,
  ) {}

  // 获取今日任务
  @Get('today')
  async getTodayTask() {
    console.log('[TasksController] GET /api/tasks/today');
    const task = await this.tasksService.getTodayTask();
    return { code: 200, msg: 'success', data: task };
  }

  // 获取任务进度
  @Get('progress')
  async getProgress() {
    console.log('[TasksController] GET /api/tasks/progress');
    const progress = await this.tasksService.getProgress();
    return { code: 200, msg: 'success', data: progress };
  }

  // 完成任务打卡
  @Post('complete')
  async completeTask(@Body() body: { day: number; feeling?: string }) {
    console.log('[TasksController] POST /api/tasks/complete', body);
    const result = await this.tasksService.completeTask(body.day, body.feeling);
    // 异步检查成就解锁 + 树木除虫
    this.achievementsService.checkAndUnlockAll().catch(() => {});
    return { code: 200, msg: 'success', data: result };
  }
}
