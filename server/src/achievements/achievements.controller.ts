import { Controller, Get, Post, Body } from '@nestjs/common';
import { AchievementsService } from './achievements.service';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  // 获取用户成就列表
  @Get()
  async getAchievements() {
    console.log('[AchievementsController] GET /api/achievements');
    const achievements = await this.achievementsService.getAchievements();
    return { code: 200, msg: 'success', data: achievements };
  }

  // 解锁成就
  @Post()
  async unlockAchievement(@Body() body: { achievement_id: string }) {
    console.log('[AchievementsController] POST /api/achievements', body);
    const result = await this.achievementsService.unlockAchievement(body.achievement_id);
    return { code: 200, msg: 'success', data: result };
  }
}
